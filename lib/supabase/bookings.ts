import { supabaseServer } from "./server";

export type ExistingBooking = {
    id: string;
    barber_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
};

export type CreateBookingInput = {
    barberId: string;
    serviceId: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
};

export type CreatedBooking = {
    id: string;
    barber_id: string;
    service_id: string;
    customer_name: string;
    customer_phone: string;
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


export async function createBooking(
    input: CreateBookingInput
): Promise<CreatedBooking> {
    const { data, error } = await supabaseServer
        .from("bookings")
        .insert({
            barber_id: input.barberId,
            service_id: input.serviceId,
            customer_name: input.customerName,
            customer_phone: input.customerPhone,
            booking_date: input.bookingDate,
            start_time: input.startTime,
            end_time: input.endTime,
            status: "booked",
        })
        .select(
            `
            id,
            barber_id,
            service_id,
            customer_name,
            customer_phone,
            booking_date,
            start_time,
            end_time,
            status
            `
        )
        .single();

    if (error) {
        throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
}