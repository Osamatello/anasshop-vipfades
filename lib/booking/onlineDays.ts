/**
 * Online booking days. The shop itself is open every day for walk-ins;
 * online appointments are possible every day except Monday.
 * Weekdays use JavaScript numbering: 0 = Sunday, 1 = Monday ... 6 = Saturday.
 */
export const ONLINE_BOOKING_CLOSED_WEEKDAYS: readonly number[] = [1];

/** True when `date` (YYYY-MM-DD) can be booked online. */
export function isOnlineBookingDay(date: string): boolean {
  const value = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(value.getTime())) return false;
  return !ONLINE_BOOKING_CLOSED_WEEKDAYS.includes(value.getUTCDay());
}
