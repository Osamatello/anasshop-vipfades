import { supabaseServer } from "./server";

export type ExistingBooking = {
    id: string;
    barber_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
};

export type BookingForCancellation = {
    id: string;
    barber_id: string;
    service_id: string;
    customer_phone: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
    google_calendar_event_id: string | null;
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
    google_calendar_event_id: string | null;
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
        throw new Error(
            `Failed to fetch bookings: ${error.message}`
        );
    }

    return data ?? [];
}

export async function getBookingById(
    bookingId: string
): Promise<BookingForCancellation | null> {
    const { data, error } = await supabaseServer
        .from("bookings")
        .select(
            `
            id,
            barber_id,
            service_id,
            customer_phone,
            booking_date,
            start_time,
            end_time,
            status,
            google_calendar_event_id
            `
        )
        .eq("id", bookingId)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Failed to fetch booking: ${error.message}`
        );
    }

    return data;
}

export async function getUpcomingBookingsByPhone(
    customerPhone: string,
    fromDate: string
): Promise<BookingForCancellation[]> {
    const { data, error } = await supabaseServer
        .from("bookings")
        .select(
            `
            id,
            barber_id,
            service_id,
            customer_phone,
            booking_date,
            start_time,
            end_time,
            status,
            google_calendar_event_id
            `
        )
        .eq("customer_phone", customerPhone)
        .eq("status", "booked")
        .gte("booking_date", fromDate)
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) {
        throw new Error(
            `Failed to fetch customer bookings: ${error.message}`
        );
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
            status,
            google_calendar_event_id
            `
        )
        .single();

    if (error) {
        throw new Error(
            `Failed to create booking: ${error.message}`
        );
    }

    return data;
}

export async function saveGoogleCalendarEventId(
    bookingId: string,
    eventId: string
): Promise<void> {
    const { error } = await supabaseServer
        .from("bookings")
        .update({
            google_calendar_event_id: eventId,
        })
        .eq("id", bookingId);

    if (error) {
        throw new Error(
            `Failed to save Google Calendar event ID: ${error.message}`
        );
    }
}

export async function cancelBooking(
    bookingId: string
): Promise<void> {
    const { error } = await supabaseServer
        .from("bookings")
        .update({
            status: "cancelled",
        })
        .eq("id", bookingId)
        .eq("status", "booked");

    if (error) {
        throw new Error(
            `Failed to cancel booking: ${error.message}`
        );
    }
}