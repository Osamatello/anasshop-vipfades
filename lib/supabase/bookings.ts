import { supabaseServer } from "./server";

export type ExistingBooking = {
    id: string;
    barber_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
};

export async function getBookingsByBarberAndDate(
    barberId: string,
    bookingDate: string
): Promise<ExistingBooking[]> {
    const { data, error } = await supabaseServer
        .from("bookings")
        .select(
            "id, barber_id, booking_date, start_time, end_time, status"
        )
        .eq("barber_id", barberId)
        .eq("booking_date", bookingDate)
        .eq("status", "booked")
        .order("start_time", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return data ?? [];
}