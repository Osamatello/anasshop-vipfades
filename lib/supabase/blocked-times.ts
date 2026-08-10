import { koblenzLocalDateTimeToUtc } from "@/lib/timezone";

import { supabaseServer } from "./server";

export type BlockedTime = {
    id: string;
    barber_id: string;
    start_at: string;
    end_at: string;
    reason: string | null;
};

export async function getBlockedTimesByBarberAndDate(
    barberId: string,
    bookingDate: string
): Promise<BlockedTime[]> {
    const dayStart = koblenzLocalDateTimeToUtc(
        bookingDate,
        "00:00:00"
    );

    // Use the start of the following calendar day rather than 23:59:59.
    // This also keeps DST transitions correct.
    const [year, month, day] = bookingDate.split("-").map(Number);

    const nextDate = new Date(
        Date.UTC(year, month - 1, day + 1)
    );

    const nextBookingDate = [
        nextDate.getUTCFullYear(),
        String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
        String(nextDate.getUTCDate()).padStart(2, "0"),
    ].join("-");

    const dayEnd = koblenzLocalDateTimeToUtc(
        nextBookingDate,
        "00:00:00"
    );

    const { data, error } = await supabaseServer
        .from("blocked_times")
        .select("id, barber_id, start_at, end_at, reason")
        .eq("barber_id", barberId)
        .lt("start_at", dayEnd.toISOString())
        .gt("end_at", dayStart.toISOString())
        .order("start_at", { ascending: true });

    if (error) {
        throw new Error(
            `Failed to fetch blocked times: ${error.message}`
        );
    }

    return data ?? [];
}