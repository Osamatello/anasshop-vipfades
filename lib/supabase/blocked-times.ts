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
    const dayStart = `${bookingDate}T00:00:00+00:00`;
    const dayEnd = `${bookingDate}T23:59:59+00:00`;

    const { data, error } = await supabaseServer
        .from("blocked_times")
        .select("id, barber_id, start_at, end_at, reason")
        .eq("barber_id", barberId)
        .lt("start_at", dayEnd)
        .gt("end_at", dayStart)
        .order("start_at", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch blocked times: ${error.message}`);
    }

    return data ?? [];
}