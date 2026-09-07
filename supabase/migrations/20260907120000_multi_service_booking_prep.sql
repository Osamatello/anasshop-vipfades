-- ============================================================================
-- Migration: multi-service booking — PREPARATION (Milestone 3)
-- Project:   vip-fades-booking  (ffflhmarvhwpimctjsmx)
-- Status:    PREPARED FOR REVIEW — *** NOT YET APPLIED ***
-- ============================================================================
--
-- GOAL
--   Let ONE booking = one appointment = one Google Calendar event = one
--   cancellation flow, but able to contain MULTIPLE services, while preserving
--   every existing booking and every existing service exactly as they are.
--
-- WHAT THIS MIGRATION DOES (all additive)
--   1. public.booking_services  — junction table, one row per service in a
--      booking, with historical price/duration snapshots.
--   2. public.bookings.total_price, public.bookings.total_duration_minutes
--      — booking-level totals (nullable during the transition).
--   3. public.bookings.service_id — made NULLable, but KEPT, with every value
--      preserved (backward compatibility with current code + history).
--   4. public.services.sort_order, .original_price, .is_exclusive.
--   5. Inserts the TWO exclusive VIP packages, most premium first:
--        VIP KÖNIGSKLASSE (vip-koenigsklasse)  65 EUR / 60 min / sort_order 10
--        VIP EXKLUSIV     (vip-exklusiv)       45 EUR / 40 min / sort_order 20
--      The existing individual services follow at sort_order 101..107.
--   6. Backfills booking_services + bookings.total_* from the single
--      service_id currently on every booking.
--   7. Creates public.create_booking_with_services(...) — the RPC the server
--      uses to write a booking and all of its service lines ATOMICALLY.
--
-- SAFETY MODEL
--   * Every statement is transaction-safe (no CREATE INDEX CONCURRENTLY, no
--     VACUUM, no ALTER TYPE ... ADD VALUE). Run the whole file ATOMICALLY as a
--     single transaction — Supabase `apply_migration` and `supabase db push`
--     both do this. If ANY statement fails, the whole migration rolls back and
--     production is byte-for-byte unchanged. If you apply it with a tool that
--     does NOT wrap in a transaction, wrap it yourself: BEGIN; \i <file>; COMMIT;
--   * 100% additive: no DROP, no destructive ALTER, no DELETE, no RENAME.
--   * Re-run safe: IF NOT EXISTS / ON CONFLICT DO NOTHING / NOT EXISTS guards,
--     and "only touch rows still at the default".
--   * lock_timeout is set low so the brief ACCESS EXCLUSIVE locks on
--     public.bookings / public.services fail fast instead of queuing behind a
--     long transaction and stalling live traffic. On lock_timeout the whole
--     migration aborts with zero changes — just retry in a quiet window.
--
-- VERIFIED READ-ONLY AGAINST PRODUCTION BEFORE WRITING THIS FILE
--   * 38 bookings at the time of the audit (30 booked, 8 cancelled). 0 NULL
--     service_id/barber_id/date/time. 0 orphan service_id. 0 duplicate ids.
--     0 rows with end_time <= start_time. All had a google_calendar_event_id.
--     NOTE: this count is only a snapshot — the live site keeps taking real
--     bookings (it was already 39 a few hours later), so the backfill and the
--     verification queries are deliberately count-agnostic.
--   * Services in use: Men's Haircut x25, Haircut + Beard x12, Eyebrows x1 —
--     all is_active = true.
--   * services.price = numeric(10,2) CHECK (price >= 0);
--     services.duration_minutes = integer CHECK (duration_minutes > 0);
--     services.slug UNIQUE. bookings.id/service_id/barber_id = uuid.
--   * FK conventions: ON UPDATE CASCADE everywhere; ON DELETE RESTRICT for
--     bookings->services and bookings->barbers; ON DELETE CASCADE for
--     blocked_times->barbers.
--   * bookings already has exclusion constraint
--     bookings_prevent_overlapping_appointments (GiST, btree_gist 1.7) that
--     blocks overlapping 'booked' appointments per barber. NOT touched here.
--   * RLS enabled on every public table (none FORCED). bookings + blocked_times
--     have ZERO policies. anon/authenticated have NO SELECT/INSERT/UPDATE/DELETE
--     on bookings; service_role has full DML. -> booking_services mirrors this.
--   * No views / materialized views depend on bookings or services.
--   * No public table is in the supabase_realtime publication.
--   * No user-defined triggers anywhere in public (no updated_at auto-touch),
--     so backfilling bookings will NOT change bookings.updated_at.
--   * gen_random_uuid() available (used as default on every existing table).
--   * supabase_migrations schema does not exist yet — apply_migration bootstraps it.
--
-- RE-VERIFIED (read-only) WHEN THE VIP STRUCTURE WAS UPDATED TO TWO PACKAGES
--   * Still unapplied: 7 services, 38 bookings, no booking_services table, no
--     sort_order / original_price / is_exclusive columns, and NO row with slug
--     'vip-paket', 'vip-exklusiv' or 'vip-koenigsklasse'. Editing this file in
--     place is therefore safe — nothing from the earlier single-package draft
--     ever reached the database.
-- ============================================================================

set lock_timeout = '5s';

-- ----------------------------------------------------------------------------
-- 1. Junction table: one row per service within a booking
-- ----------------------------------------------------------------------------
create table if not exists public.booking_services (
    id                uuid          primary key default gen_random_uuid(),

    booking_id        uuid          not null
                        references public.bookings (id)
                        on update cascade on delete cascade,
    --  ^ ON DELETE CASCADE: a line item is meaningless without its parent
    --    booking and is fully owned by it. The app never hard-deletes a
    --    booking (cancellation = status change), so in practice this never
    --    fires; it is an integrity safety net and matches the existing
    --    blocked_times -> barbers ON DELETE CASCADE pattern.

    service_id        uuid          not null
                        references public.services (id)
                        on update cascade on delete restrict,
    --  ^ ON DELETE RESTRICT: identical to the existing bookings_service_id_fkey.
    --    A service that has ever been booked cannot be hard-deleted; deactivate
    --    it with is_active = false (which is how the app already works). This
    --    protects historical line items.

    price_each        numeric(10,2) not null check (price_each >= 0),
    duration_each     integer       not null check (duration_each > 0),
    --  ^ historical SNAPSHOTS captured at booking time. Types + checks mirror
    --    services.price / services.duration_minutes exactly. If a service's
    --    price or duration changes later, past bookings keep the values the
    --    customer originally agreed to.

    position          integer       not null default 1 check (position >= 1),
    created_at        timestamptz   not null default now(),

    constraint booking_services_unique_service_per_booking
        unique (booking_id, service_id)
    --  ^ the same service cannot be added to the same booking twice. One
    --    customer per booking here, so there is no legitimate "2x haircut"
    --    case. If that ever changes, replace this with
    --    UNIQUE (booking_id, position) plus a quantity column.
);

comment on table public.booking_services is
    'Services contained in a booking (one row per service). price_each / '
    'duration_each are historical snapshots captured at booking time. '
    'Source of truth for what a booking contains.';

-- RLS: mirror public.bookings exactly — enabled, NO policies, server-only.
alter table public.booking_services enable row level security;

-- Neutralise any default-privilege grants to the public API roles; keep the
-- server (service_role, which bypasses RLS) able to read/write.
revoke all on table public.booking_services from anon, authenticated;
grant select, insert, update, delete on table public.booking_services to service_role;

-- booking_services is intentionally NOT added to the supabase_realtime
-- publication (no public table is), so it is never broadcast to clients.

-- ----------------------------------------------------------------------------
-- 2. Indexes on the junction table
-- ----------------------------------------------------------------------------
-- "every service in this booking" is already covered by the leftmost prefix of
-- the UNIQUE (booking_id, service_id) index. The explicit booking_id index
-- below is kept anyway: negligible cost on this small table, and it keeps a
-- dedicated access path if the unique constraint is ever changed.
create index if not exists booking_services_booking_id_idx
    on public.booking_services (booking_id);

create index if not exists booking_services_service_id_idx
    on public.booking_services (service_id);

-- ----------------------------------------------------------------------------
-- 3. services: new columns (additive, safe defaults)
-- ----------------------------------------------------------------------------
alter table public.services
    add column if not exists sort_order     integer       not null default 1000,
    add column if not exists original_price numeric(10,2),
    add column if not exists is_exclusive   boolean       not null default false;

do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'services_original_price_check') then
        alter table public.services
            add constraint services_original_price_check
            check (original_price is null or original_price >= 0);
    end if;
end $$;

comment on column public.services.sort_order     is 'Ascending display order in the booking menu; lower value shown first.';
comment on column public.services.original_price is 'Optional "was" price for a discounted service (display only).';
comment on column public.services.is_exclusive   is 'If true, this service may not share a booking with any other service (enforced server-side in the booking API).';

-- Give existing services explicit, stable ordering. The app currently orders
-- the catalogue by price ASC — preserve that intent. Only rows still at the
-- default 1000 are touched, so this is a no-op on re-run and never overwrites a
-- value set manually later. Nothing else about existing services
-- (name / price / duration / slug / description) is modified, and there is no
-- updated_at trigger, so services.updated_at is left untouched.
update public.services s
set sort_order = ranked.rn
from (
    select id,
           100 + (row_number() over (order by price asc, name asc))::int as rn
    from public.services
    where slug not in ('vip-exklusiv', 'vip-koenigsklasse')
) ranked
where s.id = ranked.id
  and s.sort_order = 1000;

-- ----------------------------------------------------------------------------
-- 4. The two exclusive VIP packages (shown before all individual services)
-- ----------------------------------------------------------------------------
-- Both packages are INDEPENDENT products:
--   * their price and duration are FIXED and are NEVER derived by summing the
--     individual services they conceptually contain;
--   * is_exclusive = true — the booking API rejects a booking that combines an
--     exclusive service with any other service (including the other package);
--   * a customer who manually picks every individual service is NOT converted
--     into a package and keeps the summed individual prices/durations.
--
-- STAGED ROLLOUT: both rows are seeded with is_active = false so the currently
-- deployed application (which cannot handle VIP packages) never exposes them in
-- /api/catalog. They are switched on as the LAST rollout step, after the new
-- application is deployed and verified:
--
--   update public.services set is_active = true
--    where slug in ('vip-koenigsklasse','vip-exklusiv');
--
-- Sort order: VIP KÖNIGSKLASSE (10) -> VIP EXKLUSIV (20) -> individuals (101+).
-- All customer-facing text is German only.
-- id, created_at, updated_at use the table defaults (gen_random_uuid / now()).
--
-- These values must stay identical to VIP_PACKAGE_DEFINITIONS in
-- lib/booking/vipPackages.ts, which the availability/validation layer treats as
-- authoritative until the packages are database-backed.
insert into public.services
    (name, slug, price, duration_minutes, description, is_active,
     sort_order, original_price, is_exclusive)
values
    -- Highest tier: everything, including Gesichtsreinigung. Fixed 65 EUR / 60 min.
    -- No approved strike-through price exists for this package -> original_price NULL.
    ('VIP KÖNIGSKLASSE',
     'vip-koenigsklasse',
     65,
     60,
     'Das komplette VIP FADES Erlebnis mit allen Leistungen inklusive Gesichtsreinigung.',
     false,       -- STAGED ROLLOUT: activated only after the new app is deployed
     10,          -- first in the booking menu
     null,
     true),

    -- Smaller VIP package: all VIP services EXCEPT Gesichtsreinigung.
    -- Fixed 45 EUR / 40 min. original_price 53 backs the "15% RABATT" label
    -- shown in the UI (1 - 45/53 = 15.09 %); no discount column is required.
    ('VIP EXKLUSIV',
     'vip-exklusiv',
     45,
     40,
     'Alle VIP-Leistungen ohne Gesichtsreinigung.',
     false,       -- STAGED ROLLOUT: activated only after the new app is deployed
     20,          -- directly after VIP KÖNIGSKLASSE, before every individual service
     53,
     true)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 5. bookings: booking-level totals + relax the single-service column
-- ----------------------------------------------------------------------------
-- Nullable, no default => metadata-only change (fast, Postgres 11+), and keeps
-- the backfill below re-runnable.
alter table public.bookings
    add column if not exists total_price            numeric(10,2),
    add column if not exists total_duration_minutes integer;

do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'bookings_total_price_check') then
        alter table public.bookings
            add constraint bookings_total_price_check
            check (total_price is null or total_price >= 0);
    end if;
    if not exists (select 1 from pg_constraint where conname = 'bookings_total_duration_minutes_check') then
        alter table public.bookings
            add constraint bookings_total_duration_minutes_check
            check (total_duration_minutes is null or total_duration_minutes >= 0);
    end if;
end $$;

comment on column public.bookings.total_price            is 'Sum of booking_services.price_each for this booking (historical total).';
comment on column public.bookings.total_duration_minutes is 'Sum of booking_services.duration_each for this booking (historical total).';

-- Keep service_id (do NOT drop it) but allow NULL, so a future multi-service
-- booking does not have to designate one "primary" service. Every existing row
-- keeps its value; current app code, dashboard and cancellation keep working.
alter table public.bookings
    alter column service_id drop not null;

comment on column public.bookings.service_id is
    'DEPRECATED for multi-service bookings. Kept for backward compatibility and '
    'history. Single-service bookings still populate it. Source of truth for a '
    'booking''s services is public.booking_services.';

-- ----------------------------------------------------------------------------
-- 6. Backfill — preserve every existing booking
-- ----------------------------------------------------------------------------
-- 6a. One booking_services row per existing (single-service) booking.
--     JOIN (not LEFT JOIN) skips any booking whose service_id does not resolve
--     to a real service (production check: 0 such rows). NOT EXISTS makes the
--     insert idempotent.
insert into public.booking_services
    (booking_id, service_id, price_each, duration_each, position)
select b.id,
       b.service_id,
       s.price,
       s.duration_minutes,
       1
from public.bookings b
join public.services s on s.id = b.service_id
where b.service_id is not null
  and not exists (
        select 1 from public.booking_services bs where bs.booking_id = b.id
      );

-- 6b. Booking totals, derived from the rows just inserted so the junction
--     table and the totals are always consistent. Idempotent: only rows whose
--     stored totals differ from the recomputed aggregate are updated.
update public.bookings b
set total_price            = agg.total_price,
    total_duration_minutes = agg.total_duration_minutes
from (
    select booking_id,
           sum(price_each)::numeric(10,2) as total_price,
           sum(duration_each)::int        as total_duration_minutes
    from public.booking_services
    group by booking_id
) agg
where agg.booking_id = b.id
  and (b.total_price            is distinct from agg.total_price
    or b.total_duration_minutes is distinct from agg.total_duration_minutes);

-- ----------------------------------------------------------------------------
-- 7. OPTIONAL — DB-level VIP exclusivity guard (NOT enabled by this migration)
-- ----------------------------------------------------------------------------
-- The rule "an is_exclusive service may not share a booking with any other
-- service" will be enforced server-side in Milestone 4, inside the single
-- booking-creation transaction. Because every write already goes through the
-- service role from trusted server code, that is sufficient on its own.
--
-- If you also want the database to reject such combinations as a last line of
-- defence, uncomment the block below. It is a DEFERRABLE INITIALLY DEFERRED
-- constraint trigger, so a valid multi-row INSERT for one booking is checked
-- once at COMMIT, not row-by-row.
--
-- create or replace function public.booking_services_check_exclusivity()
-- returns trigger language plpgsql as $$
-- declare
--     affected uuid := coalesce(new.booking_id, old.booking_id);
--     n_total     int;
--     n_exclusive int;
-- begin
--     select count(*), count(*) filter (where s.is_exclusive)
--       into n_total, n_exclusive
--     from public.booking_services bs
--     join public.services s on s.id = bs.service_id
--     where bs.booking_id = affected;
--
--     if n_exclusive > 0 and n_total > 1 then
--         raise exception using
--             errcode = 'check_violation',
--             message = format('Booking %s may not combine an exclusive service with other services', affected);
--     end if;
--     return null;
-- end $$;
--
-- create constraint trigger booking_services_exclusivity_guard
--     after insert or update or delete on public.booking_services
--     deferrable initially deferred
--     for each row execute function public.booking_services_check_exclusivity();

-- ----------------------------------------------------------------------------
-- 8. Atomic booking creation (booking + its service lines in ONE statement)
-- ----------------------------------------------------------------------------
-- A Supabase RPC call is executed by PostgREST as a SINGLE top-level statement,
-- so everything this function does runs inside one implicit transaction: the
-- bookings row and all booking_services rows either all commit or all roll back.
-- That removes the "booking saved, line items missing" partial-write class of
-- bug without needing an application-level transaction.
--
-- The existing exclusion constraint bookings_prevent_overlapping_appointments
-- fires on the INSERT below using the CORRECT combined end_time, so it remains
-- the final database-level double-booking protection. Its error (SQLSTATE
-- 23P01) propagates out of this function and is mapped to a friendly German
-- "slot no longer available" response by the API layer.
create or replace function public.create_booking_with_services(
    p_barber_id              uuid,
    p_service_id             uuid,
    p_customer_name          text,
    p_customer_phone         text,
    p_booking_date           date,
    p_start_time             time,
    p_end_time               time,
    p_total_price            numeric,
    p_total_duration_minutes integer,
    p_lines                  jsonb
)
returns public.bookings
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
    v_booking    public.bookings;
    v_line_count integer;
begin
    if p_lines is null
       or jsonb_typeof(p_lines) <> 'array'
       or jsonb_array_length(p_lines) = 0 then
        raise exception 'create_booking_with_services requires at least one service line'
            using errcode = 'check_violation';
    end if;

    insert into public.bookings (
        barber_id, service_id, customer_name, customer_phone,
        booking_date, start_time, end_time, status,
        total_price, total_duration_minutes
    )
    values (
        p_barber_id, p_service_id, p_customer_name, p_customer_phone,
        p_booking_date, p_start_time, p_end_time, 'booked',
        p_total_price, p_total_duration_minutes
    )
    returning * into v_booking;

    insert into public.booking_services
        (booking_id, service_id, price_each, duration_each, position)
    select v_booking.id,
           (line ->> 'service_id')::uuid,
           (line ->> 'price_each')::numeric,
           (line ->> 'duration_each')::integer,
           (line ->> 'position')::integer
    from jsonb_array_elements(p_lines) as line;

    get diagnostics v_line_count = row_count;

    if v_line_count <> jsonb_array_length(p_lines) then
        raise exception 'booking_services line count mismatch (% of %)',
            v_line_count, jsonb_array_length(p_lines)
            using errcode = 'check_violation';
    end if;

    -- The stored totals must agree with the persisted line items, so a booking
    -- can never be committed with totals that disagree with what was booked.
    if exists (
        select 1
        from public.booking_services bs
        where bs.booking_id = v_booking.id
        group by bs.booking_id
        having sum(bs.price_each)    is distinct from v_booking.total_price
            or sum(bs.duration_each) is distinct from v_booking.total_duration_minutes
    ) then
        raise exception 'booking totals do not match the persisted service lines'
            using errcode = 'check_violation';
    end if;

    return v_booking;
end;
$$;

comment on function public.create_booking_with_services is
    'Atomically creates one booking plus its booking_services line items and '
    'returns the booking. Called by the server with the service-role key only.';

-- Server-only, exactly like the tables it writes.
revoke all on function public.create_booking_with_services(
    uuid, uuid, text, text, date, time, time, numeric, integer, jsonb
) from public, anon, authenticated;

grant execute on function public.create_booking_with_services(
    uuid, uuid, text, text, date, time, time, numeric, integer, jsonb
) to service_role;

-- ----------------------------------------------------------------------------
-- 9. Tidy up session setting
-- ----------------------------------------------------------------------------
set lock_timeout = default;

-- ============================================================================
-- POST-APPLY VERIFICATION — run these READ-ONLY afterwards, expect every
-- boolean = true / every count as noted.
-- ============================================================================
-- NOTE: the live site keeps taking bookings, so never assert an absolute row
-- count here — assert the RELATIONSHIPS instead. (Record the booking count
-- immediately before applying if you want a strict before/after comparison.)
-- select (select count(*) from public.booking_services)
--        = (select count(*) from public.bookings where service_id is not null)
--        as one_line_per_existing_booking;
-- select bool_and(position = 1) as all_first_position     from public.booking_services;
-- select not exists (
--     select 1 from public.bookings b
--     left join public.booking_services bs on bs.booking_id = b.id
--     where b.service_id is not null and bs.booking_id is null
-- ) as every_existing_booking_backfilled;
-- select not exists (
--     select 1 from public.bookings
--     where total_price is null or total_duration_minutes is null
-- ) as all_totals_populated;
-- select not exists (
--     select 1
--     from public.bookings b
--     join (select booking_id, sum(price_each) p, sum(duration_each) d
--             from public.booking_services group by booking_id) a
--       on a.booking_id = b.id
--     where b.total_price <> a.p or b.total_duration_minutes <> a.d
-- ) as totals_match_line_items;
-- select not exists (                          -- snapshots match current price now
--     select 1 from public.booking_services bs
--     join public.services s on s.id = bs.service_id
--     where bs.price_each <> s.price or bs.duration_each <> s.duration_minutes
-- ) as snapshots_consistent_at_apply_time;
--
-- --- VIP packages -----------------------------------------------------------
-- select count(*) = 9 as services_now_nine from public.services;   -- 7 existing + 2 packages
--
-- -- the old single-package concept must NOT exist
-- select not exists (
--     select 1 from public.services where slug = 'vip-paket'
-- ) as old_vip_paket_absent;
--
-- -- both package rows exist with exactly the approved values
-- select count(*) = 1 as koenigsklasse_row_correct
--   from public.services
--   where slug = 'vip-koenigsklasse'
--     and name = 'VIP KÖNIGSKLASSE'
--     and price = 65 and duration_minutes = 60
--     and original_price is null
--     and is_exclusive is true
--     and sort_order = 10;   -- is_active starts FALSE (staged rollout)
--
-- select count(*) = 1 as exklusiv_row_correct
--   from public.services
--   where slug = 'vip-exklusiv'
--     and name = 'VIP EXKLUSIV'
--     and price = 45 and duration_minutes = 40
--     and original_price = 53
--     and is_exclusive is true
--     and sort_order = 20;   -- is_active starts FALSE (staged rollout)
--
-- -- exactly the two packages are exclusive, and both are active
-- select count(*) = 2 as exactly_two_exclusive from public.services
--   where is_exclusive is true;
-- -- immediately after the migration both packages must still be HIDDEN:
-- select count(*) = 0 as vip_packages_not_yet_public from public.services
--   where is_exclusive is true and is_active is true;
--
-- -- ordering: KÖNIGSKLASSE first, EXKLUSIV second, individuals after both
-- select array_agg(slug order by sort_order, price, name)
--          = array['vip-koenigsklasse','vip-exklusiv','ears-nose','eyebrows',
--                  'hot-wax','beard-trim','facial-cleansing','mens-haircut',
--                  'haircut-beard']::text[]
--        as catalogue_order_correct
--   from public.services;   -- run AFTER the VIP packages are activated
--
-- select bool_and(sort_order between 101 and 107) as individual_services_sort_after
--   from public.services
--   where slug not in ('vip-exklusiv','vip-koenigsklasse');
--
-- -- Gesichtsreinigung stays individually bookable alongside the packages
-- select exists (
--     select 1 from public.services
--     where slug = 'facial-cleansing' and is_active and is_exclusive is false
-- ) as gesichtsreinigung_still_individual;
-- select relrowsecurity as rls_on from pg_class where relname = 'booking_services';        -- true
-- select count(*) = 0 as no_policies from pg_policies where tablename = 'booking_services';
-- select count(*) filter (where privilege_type in ('SELECT','INSERT','UPDATE','DELETE')) = 0
--     as anon_has_no_data_access
--   from information_schema.role_table_grants
--   where table_name = 'booking_services' and grantee = 'anon';
-- select is_nullable = 'YES' as service_id_now_nullable
--   from information_schema.columns
--   where table_name = 'bookings' and column_name = 'service_id';
--
-- --- atomic booking RPC ------------------------------------------------------
-- select exists (
--     select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--     where n.nspname = 'public' and p.proname = 'create_booking_with_services'
-- ) as booking_rpc_exists;
-- select has_function_privilege('service_role',
--          'public.create_booking_with_services(uuid,uuid,text,text,date,time,time,numeric,integer,jsonb)',
--          'EXECUTE') as service_role_may_execute;                       -- true
-- select has_function_privilege('anon',
--          'public.create_booking_with_services(uuid,uuid,text,text,date,time,time,numeric,integer,jsonb)',
--          'EXECUTE') as anon_may_execute;                               -- false
-- ============================================================================

-- ============================================================================
-- MANUAL ROLLBACK (only if ever needed; every step is non-destructive to
-- pre-existing data — all new data is fully regenerable by re-running this
-- migration):
--
--   drop function if exists public.create_booking_with_services(
--       uuid, uuid, text, text, date, time, time, numeric, integer, jsonb);
--   drop table if exists public.booking_services;               -- also drops its indexes/constraints
--   alter table public.bookings  drop column if exists total_price;
--   alter table public.bookings  drop column if exists total_duration_minutes;
--   alter table public.services  drop column if exists sort_order;
--   alter table public.services  drop column if exists original_price;
--   alter table public.services  drop column if exists is_exclusive;
--   delete from public.services
--     where slug in ('vip-koenigsklasse','vip-exklusiv');         -- safe only while nothing references them
--   -- Optional, ONLY if you are sure no NULLs were introduced:
--   -- alter table public.bookings alter column service_id set not null;
--
-- Note: dropping the columns discards the *new* totals/snapshots but no
-- pre-existing booking or service data. bookings.service_id and its values are
-- never altered by this migration beyond DROP NOT NULL.
-- ============================================================================
