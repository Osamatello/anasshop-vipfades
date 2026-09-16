-- Additive review-only migration. No booking tables, functions or migrations are touched.
create table public.google_business_stats (
  business_key text primary key check (business_key = 'vip-fades'),
  location_name text not null unique check (location_name ~ '^accounts/[0-9]+/locations/[0-9]+$'),
  rating numeric not null check (rating between 0 and 5),
  total_review_count integer not null check (total_review_count >= 0),
  last_synced_at timestamptz not null,
  expires_at timestamptz not null,
  check (total_review_count = 0 or rating >= 1),
  check (expires_at <= last_synced_at + interval '29 days')
);

create table public.google_reviews (
  business_key text not null references public.google_business_stats(business_key) on delete cascade,
  google_review_id text not null,
  reviewer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (length(btrim(review_text)) > 0),
  published_at timestamptz not null,
  updated_at timestamptz not null,
  last_synced_at timestamptz not null,
  expires_at timestamptz not null,
  primary key (business_key, google_review_id),
  check (expires_at <= last_synced_at + interval '29 days')
);
create index google_reviews_latest_written on public.google_reviews (business_key, published_at desc, google_review_id);

alter table public.google_reviews enable row level security;
alter table public.google_business_stats enable row level security;
revoke all on public.google_reviews, public.google_business_stats from anon, authenticated;
grant select on public.google_reviews, public.google_business_stats to anon, authenticated;
grant all on public.google_reviews, public.google_business_stats to service_role;
create policy google_reviews_public_read on public.google_reviews
  for select to anon, authenticated using (business_key = 'vip-fades' and expires_at > now());
create policy google_stats_public_read on public.google_business_stats
  for select to anon, authenticated using (business_key = 'vip-fades' and expires_at > now());

-- One read statement provides the same committed snapshot for both website consumers.
create function public.get_google_reviews() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'stats', (select jsonb_build_object('rating', s.rating, 'totalReviewCount', s.total_review_count, 'lastSyncedAt', s.last_synced_at)
      from public.google_business_stats s where s.business_key = 'vip-fades' and s.expires_at > now()),
    'reviews', coalesce((select jsonb_agg(r.review order by r.published_at desc, r.id) from (
      select g.published_at, g.google_review_id as id, jsonb_build_object(
        'id', g.google_review_id, 'name', g.reviewer_name, 'rating', g.rating, 'text', g.review_text,
        'publishedAt', g.published_at, 'updatedAt', g.updated_at
      ) as review from public.google_reviews g
      where g.business_key = 'vip-fades' and g.expires_at > now() and length(btrim(g.review_text)) > 0
      order by g.published_at desc, g.google_review_id limit 7
    ) r), '[]'::jsonb),
    'status', case when exists(select 1 from public.google_business_stats s where s.business_key = 'vip-fades' and s.expires_at > now()) then 'ready' else 'pending' end
  );
$$;
revoke all on function public.get_google_reviews() from public;
grant execute on function public.get_google_reviews() to anon, authenticated, service_role;

-- Atomic snapshot replacement. Repeat deliveries cannot duplicate review IDs.
-- A review-specific lock prevents slower/older syncs from replacing newer data.
create function public.sync_google_reviews(
  p_location_name text, p_rating numeric, p_total_review_count integer,
  p_reviews jsonb, p_synced_at timestamptz
) returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if p_synced_at is null or p_synced_at > clock_timestamp() + interval '2 minutes' then
    raise exception 'Invalid synchronization timestamp';
  end if;
  if jsonb_typeof(p_reviews) <> 'array' or jsonb_array_length(p_reviews) > 7 then
    raise exception 'Only the seven required written reviews may be cached';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('vip-fades-google-reviews', 0));
  if exists(select 1 from public.google_business_stats where business_key = 'vip-fades' and last_synced_at >= p_synced_at) then
    return false;
  end if;

  insert into public.google_business_stats (business_key, location_name, rating, total_review_count, last_synced_at, expires_at)
  values ('vip-fades', p_location_name, p_rating, p_total_review_count, p_synced_at, p_synced_at + interval '29 days')
  on conflict (business_key) do update set location_name = excluded.location_name, rating = excluded.rating,
    total_review_count = excluded.total_review_count, last_synced_at = excluded.last_synced_at, expires_at = excluded.expires_at;

  insert into public.google_reviews (business_key, google_review_id, reviewer_name, rating, review_text, published_at, updated_at, last_synced_at, expires_at)
  select 'vip-fades', r.google_review_id, r.reviewer_name, r.rating, r.review_text, r.published_at, r.updated_at,
    p_synced_at, p_synced_at + interval '29 days'
  from jsonb_to_recordset(p_reviews) as r(google_review_id text, reviewer_name text, rating smallint, review_text text, published_at timestamptz, updated_at timestamptz)
  on conflict (business_key, google_review_id) do update set reviewer_name = excluded.reviewer_name,
    rating = excluded.rating, review_text = excluded.review_text, published_at = excluded.published_at,
    updated_at = excluded.updated_at, last_synced_at = excluded.last_synced_at, expires_at = excluded.expires_at;

  -- Remove cached records that Google removed or that are no longer among the latest seven.
  delete from public.google_reviews g where g.business_key = 'vip-fades'
    and not exists(select 1 from jsonb_to_recordset(p_reviews) as r(google_review_id text) where r.google_review_id = g.google_review_id);
  return true;
end;
$$;
revoke all on function public.sync_google_reviews(text, numeric, integer, jsonb, timestamptz) from public, anon, authenticated;
grant execute on function public.sync_google_reviews(text, numeric, integer, jsonb, timestamptz) to service_role;

create function public.purge_expired_google_reviews() returns void
language sql security invoker set search_path = '' as $$
  delete from public.google_reviews where expires_at <= now();
  delete from public.google_business_stats where expires_at <= now();
$$;
revoke all on function public.purge_expired_google_reviews() from public, anon, authenticated;
grant execute on function public.purge_expired_google_reviews() to service_role;

-- Do not install extensions or change project settings automatically.
-- When Supabase Cron is already enabled, expiry cleanup works even if Google OAuth fails.
do $$ begin
  if exists(select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('vip-fades-google-reviews-cache-expiry', '15 * * * *', 'select public.purge_expired_google_reviews();');
  else
    raise notice 'Enable Supabase Cron and schedule hourly purge_expired_google_reviews before activating the Google cache.';
  end if;
end $$;
