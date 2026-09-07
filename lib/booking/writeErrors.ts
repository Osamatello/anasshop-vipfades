/**
 * Classifies the database error returned when creating a booking.
 *
 * Pure and dependency-free so the mapping can be unit tested without a
 * database. Raw PostgreSQL/PostgREST messages are NEVER returned to the
 * customer — the API layer turns these codes into friendly German text.
 */

export type BookingWriteFailure = "slot_taken" | "not_migrated" | "failed";

/** Raised by bookings_prevent_overlapping_appointments when two bookings collide. */
export const EXCLUSION_VIOLATION = "23P01";
export const UNIQUE_VIOLATION = "23505";
/** Emitted when create_booking_with_services does not exist yet. */
export const UNDEFINED_FUNCTION = "42883";
/** PostgREST: could not find the function in the schema cache. */
export const PGRST_NO_FUNCTION = "PGRST202";

export function classifyBookingWriteError(
    code: string | null | undefined,
    message: string | null | undefined,
): BookingWriteFailure {
    const errorCode = code ?? "";
    const errorMessage = message ?? "";

    if (errorCode === EXCLUSION_VIOLATION || errorCode === UNIQUE_VIOLATION) {
        return "slot_taken";
    }

    if (
        errorCode === UNDEFINED_FUNCTION ||
        errorCode === PGRST_NO_FUNCTION ||
        /create_booking_with_services/i.test(errorMessage) ||
        /could not find the function/i.test(errorMessage)
    ) {
        return "not_migrated";
    }

    return "failed";
}
