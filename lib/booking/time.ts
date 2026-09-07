/**
 * Pure appointment-time helpers shared by the booking API and its tests.
 * No imports, no side effects — safe to unit test standalone.
 *
 * All times are Koblenz local wall-clock "HH:MM" strings, matching the
 * `time without time zone` columns on public.bookings.
 */

export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.slice(0, 5).split(":").map(Number);

    return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
    return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

/** "18:30:00" | "18:30" -> "18:30". Returns null when the shape is wrong. */
export function normalizeTime(value: string): string | null {
    const trimmed = value.trim();

    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
        return null;
    }

    const normalized = trimmed.slice(0, 5);
    const [hours, minutes] = normalized.split(":").map(Number);

    if (hours > 23 || minutes > 59) {
        return null;
    }

    return normalized;
}

/** Strict YYYY-MM-DD calendar-date check (rejects 2026-02-31). */
export function isValidDateString(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

export function periodsOverlap(
    startOne: number,
    endOne: number,
    startTwo: number,
    endTwo: number
): boolean {
    return startOne < endTwo && endOne > startTwo;
}
