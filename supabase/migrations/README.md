# Supabase migrations

This directory was created during **Milestone 3 (database migration preparation)**
for the multi-service booking system.

## Status

| Migration | Purpose | Applied to production? |
| --- | --- | --- |
| `20260907120000_multi_service_booking_prep.sql` | `booking_services` junction table, `bookings.total_*`, `bookings.service_id` nullable, `services.sort_order / original_price / is_exclusive`, the two VIP package rows, backfill of the 38 existing bookings | **NO — not applied, awaiting explicit approval** |

> Updated after the client changed the VIP structure: the migration now seeds
> **VIP KÖNIGSKLASSE** (`vip-koenigsklasse`, 65 € / 60 min, `sort_order` 10) and
> **VIP EXKLUSIV** (`vip-exklusiv`, 45 € / 40 min, `original_price` 53,
> `sort_order` 20) instead of the earlier single `vip-paket` row. The file was
> edited in place because it has never been applied.

Production (`vip-fades-booking`, project `ffflhmarvhwpimctjsmx`) had **no migration
history** before this file — the schema was built ad hoc in the dashboard. This
is the first tracked migration.

## Design constraints honoured

- One booking stays one appointment / one Google Calendar event / one
  cancellation flow. `booking_services` only adds *what* is in the booking.
- 100% additive. No `DROP`, no destructive `ALTER`, no data deletion, no rename.
- Every existing booking and service is preserved. `bookings.service_id` is kept
  (made nullable) with all values intact.
- Re-runnable: `IF NOT EXISTS` / `ON CONFLICT DO NOTHING` / `NOT EXISTS` guards.
- Intended to run as **one atomic transaction** (see the header comment in the
  SQL file). No statement in it can break out of a transaction.
- `booking_services` follows the existing server-only security model of
  `public.bookings`: RLS enabled, **no policies**, no `anon`/`authenticated`
  data privileges, `service_role` full DML.

## How it will eventually be applied (do NOT do this yet)

Either:

- Supabase MCP `apply_migration` with the contents of the `.sql` file, **or**
- `supabase link --project-ref ffflhmarvhwpimctjsmx` then `supabase db push`

Both wrap the migration in a transaction. Run the post-apply verification
queries at the bottom of the `.sql` file immediately afterwards.

Nothing in this directory is committed or pushed.
