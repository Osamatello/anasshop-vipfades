// Optional local-only database validation; no Supabase project or production data is used.
// GOOGLE_REVIEWS_TEST_PGLITE must point to an independently installed test-tool module.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('additive review migration: atomic upserts, RLS, expiry, and booking isolation', {
  skip: !process.env.GOOGLE_REVIEWS_TEST_PGLITE,
}, async () => {
  const { PGlite } = require(process.env.GOOGLE_REVIEWS_TEST_PGLITE);
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create table public.bookings (id integer primary key, sentinel text); insert into public.bookings values (1, 'UNCHANGED');");
    const migration = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20260916090329_google_reviews_cache.sql'), 'utf8');
    await db.exec(migration);
    const now = new Date().toISOString();
    const rows = Array.from({ length: 7 }, (_, index) => ({
      google_review_id: String(index), reviewer_name: `Kunde ${index}`, rating: 5, review_text: `Text ${index}`,
      published_at: '2026-09-10T10:00:00Z', updated_at: '2026-09-15T10:00:00Z',
    }));
    await db.exec('set role service_role');
    const call = (reviews, timestamp, rating = 4.7) => db.query(
      'select public.sync_google_reviews($1, $2, $3, $4::jsonb, $5::timestamptz) as applied',
      ['accounts/123/locations/456', rating, 167, JSON.stringify(reviews), timestamp],
    );
    assert.equal((await call(rows, now)).rows[0].applied, true);
    assert.equal((await call(rows, now)).rows[0].applied, false);
    assert.equal((await db.query('select count(*)::int as count from public.google_reviews')).rows[0].count, 7);
    const newer = new Date(Date.parse(now) + 1000).toISOString();
    const updated = [{ ...rows[0], review_text: 'Aktualisierter Originaltext' }, { ...rows[1], google_review_id: 'new-review' }];
    await call(updated, newer);
    assert.equal((await db.query('select count(*)::int as count from public.google_reviews')).rows[0].count, 2);
    // An invalid review must roll back the aggregate change too.
    await assert.rejects(call([{ ...rows[0], review_text: '' }], new Date(Date.parse(now) + 2000).toISOString(), 1));
    assert.equal(Number((await db.query('select rating from public.google_business_stats')).rows[0].rating), 4.7);

    await db.exec('reset role; set role anon');
    const data = (await db.query('select public.get_google_reviews() as data')).rows[0].data;
    assert.equal(data.status, 'ready'); assert.equal(data.stats.totalReviewCount, 167);
    assert.equal(data.stats.rating, 4.7); assert.equal(data.reviews.length, 2);
    await assert.rejects(db.query("delete from public.google_reviews"));
    await assert.rejects(call(rows, newer));
    await assert.rejects(db.query('select public.purge_expired_google_reviews()'));

    await db.exec("reset role; set role service_role; update public.google_reviews set expires_at = now() - interval '1 second'; update public.google_business_stats set expires_at = now() - interval '1 second'; reset role; set role anon;");
    const expired = (await db.query('select public.get_google_reviews() as data')).rows[0].data;
    assert.equal(expired.status, 'pending'); assert.equal(expired.stats, null); assert.equal(expired.reviews.length, 0);
    await db.exec('reset role; set role service_role; select public.purge_expired_google_reviews(); reset role');
    assert.equal((await db.query('select count(*)::int as count from public.google_reviews')).rows[0].count, 0);
    assert.equal((await db.query('select sentinel from public.bookings where id = 1')).rows[0].sentinel, 'UNCHANGED');
    assert.equal((await db.query("select count(*)::int as count from information_schema.columns where table_schema = 'public' and table_name = 'bookings'")).rows[0].count, 2);
  } finally { await db.close(); }
});
