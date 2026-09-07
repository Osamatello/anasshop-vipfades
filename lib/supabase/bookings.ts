import { supabaseServer } from "./server";

import { classifyBookingWriteError } from "@/lib/booking/writeErrors";

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

export type DashboardBooking = {
    id: string;
    barber_id: string;
    barber_name: string;
    service_id: string | null;
    /** Every service in the appointment, in booking order. */
    service_names: string[];
    /** "Herrenhaarschnitt + Bart trimmen" or "VIP KÖNIGSKLASSE". */
    service_label: string;
    /** Authoritative booking total (bookings.total_price when available). */
    total_price: number;
    total_duration_minutes: number;
    customer_name: string;
    customer_phone: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
    /** false => the booking exists but has no stored Google Calendar event. */
    calendar_synced: boolean;
};

export type BookingServiceLineRow = {
    booking_id: string;
    service_id: string;
    price_each: number;
    duration_each: number;
    position: number;
};

/**
 * Loads the booking_services line items for the given bookings.
 *
 * Deliberately defensive: if the multi-service migration has not been applied
 * yet (table missing) this resolves to an empty map instead of throwing, so
 * every read path degrades gracefully to the legacy bookings.service_id
 * relationship and historical appointments never disappear.
 */
export async function getBookingServiceLines(
    bookingIds: string[]
): Promise<Map<string, BookingServiceLineRow[]>> {
    const byBooking = new Map<string, BookingServiceLineRow[]>();

    if (bookingIds.length === 0) {
        return byBooking;
    }

    const { data, error } = await supabaseServer
        .from("booking_services")
        .select("booking_id, service_id, price_each, duration_each, position")
        .in("booking_id", bookingIds)
        .order("position", { ascending: true });

    if (error) {
        console.warn(
            "booking_services unavailable, falling back to legacy service_id:",
            error.message
        );
        return byBooking;
    }

    for (const row of data ?? []) {
        const lines = byBooking.get(row.booking_id) ?? [];

        lines.push({
            booking_id: row.booking_id,
            service_id: row.service_id,
            price_each: Number(row.price_each),
            duration_each: row.duration_each,
            position: row.position,
        });

        byBooking.set(row.booking_id, lines);
    }

    return byBooking;
}

/** Minutes between two "HH:MM[:SS]" wall-clock times. */
function durationBetween(startTime: string, endTime: string): number {
    const toMinutes = (value: string) => {
        const [hours, minutes] = value.slice(0, 5).split(":").map(Number);
        return hours * 60 + minutes;
    };

    return Math.max(0, toMinutes(endTime) - toMinutes(startTime));
}

/**
 * Resolves the customer-facing service selection for one booking, preferring
 * booking_services (the source of truth) and falling back to the legacy single
 * service relationship for historical rows.
 */
export function resolveBookingSelection(input: {
    lines: BookingServiceLineRow[] | undefined;
    servicesById: Map<string, { name: string; price: number; duration: number }>;
    legacyServiceId: string | null;
    totalPrice: number | null;
    totalDurationMinutes: number | null;
    startTime: string;
    endTime: string;
}): {
    serviceNames: string[];
    serviceLabel: string;
    totalPrice: number;
    totalDurationMinutes: number;
} {
    const lines = input.lines ?? [];

    const serviceNames =
        lines.length > 0
            ? lines.map(
                  (line) =>
                      input.servicesById.get(line.service_id)?.name ??
                      "Leistung"
              )
            : input.legacyServiceId
              ? [
                    input.servicesById.get(input.legacyServiceId)?.name ??
                        "Leistung",
                ]
              : [];

    const legacyService = input.legacyServiceId
        ? input.servicesById.get(input.legacyServiceId)
        : undefined;

    const totalPrice =
        input.totalPrice ??
        (lines.length > 0
            ? lines.reduce((sum, line) => sum + line.price_each, 0)
            : (legacyService?.price ?? 0));

    const totalDurationMinutes =
        input.totalDurationMinutes ??
        (lines.length > 0
            ? lines.reduce((sum, line) => sum + line.duration_each, 0)
            : durationBetween(input.startTime, input.endTime));

    return {
        serviceNames,
        serviceLabel:
            serviceNames.length > 0 ? serviceNames.join(" + ") : "Leistung",
        totalPrice,
        totalDurationMinutes,
    };
}

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

export async function getDashboardBookings(
    fromDate: string
): Promise<DashboardBooking[]> {
    // Select the multi-service columns when they exist; fall back to the
    // legacy shape if the migration has not been applied yet.
    const MULTI_COLUMNS = `
        id, barber_id, service_id, customer_name, customer_phone,
        booking_date, start_time, end_time, status,
        total_price, total_duration_minutes, google_calendar_event_id
    `;
    const LEGACY_COLUMNS = `
        id, barber_id, service_id, customer_name, customer_phone,
        booking_date, start_time, end_time, status, google_calendar_event_id
    `;

    const fetchBookings = async (columns: string) =>
        supabaseServer
            .from("bookings")
            .select(columns)
            .eq("status", "booked")
            .gte("booking_date", fromDate)
            .order("booking_date", { ascending: true })
            .order("start_time", { ascending: true });

    let bookingsResult = await fetchBookings(MULTI_COLUMNS);

    if (bookingsResult.error) {
        console.warn(
            "Dashboard falling back to legacy booking columns:",
            bookingsResult.error.message
        );
        bookingsResult = await fetchBookings(LEGACY_COLUMNS);
    }

    const [barbersResult, servicesResult] = await Promise.all([
        supabaseServer.from("barbers").select("id, name"),
        supabaseServer.from("services").select("id, name, price, duration_minutes"),
    ]);

    if (bookingsResult.error) {
        throw new Error(
            `Failed to fetch dashboard bookings: ${bookingsResult.error.message}`
        );
    }

    if (barbersResult.error) {
        throw new Error(
            `Failed to fetch dashboard barbers: ${barbersResult.error.message}`
        );
    }

    if (servicesResult.error) {
        throw new Error(
            `Failed to fetch dashboard services: ${servicesResult.error.message}`
        );
    }

    const rows = (bookingsResult.data ?? []) as unknown as {
        id: string;
        barber_id: string;
        service_id: string | null;
        customer_name: string;
        customer_phone: string;
        booking_date: string;
        start_time: string;
        end_time: string;
        status: string;
        total_price?: number | string | null;
        total_duration_minutes?: number | null;
        google_calendar_event_id: string | null;
    }[];

    const barbersById = new Map(
        (barbersResult.data ?? []).map((barber) => [barber.id, barber.name])
    );

    const servicesById = new Map(
        (servicesResult.data ?? []).map((service) => [
            service.id,
            {
                name: service.name,
                price: Number(service.price),
                duration: service.duration_minutes,
            },
        ])
    );

    const linesByBooking = await getBookingServiceLines(
        rows.map((row) => row.id)
    );

    return rows.map((booking) => {
        const resolved = resolveBookingSelection({
            lines: linesByBooking.get(booking.id),
            servicesById,
            legacyServiceId: booking.service_id,
            totalPrice:
                booking.total_price === null ||
                booking.total_price === undefined
                    ? null
                    : Number(booking.total_price),
            totalDurationMinutes: booking.total_duration_minutes ?? null,
            startTime: booking.start_time,
            endTime: booking.end_time,
        });

        return {
            id: booking.id,
            barber_id: booking.barber_id,
            barber_name:
                barbersById.get(booking.barber_id) ?? "Unknown barber",
            service_id: booking.service_id,
            service_names: resolved.serviceNames,
            service_label: resolved.serviceLabel,
            total_price: resolved.totalPrice,
            total_duration_minutes: resolved.totalDurationMinutes,
            customer_name: booking.customer_name,
            customer_phone: booking.customer_phone,
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            status: booking.status,
            calendar_synced: Boolean(booking.google_calendar_event_id),
        };
    });
}

export type BookingServiceLineInput = {
    service_id: string;
    price_each: number;
    duration_each: number;
    position: number;
};

export type CreateBookingWithServicesInput = {
    barberId: string;
    /** bookings.service_id — first selected service, or the VIP package row. */
    primaryServiceId: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    totalDurationMinutes: number;
    lines: BookingServiceLineInput[];
};

export type CreateBookingResult =
    | { ok: true; booking: CreatedBooking }
    | { ok: false; reason: "slot_taken" | "not_migrated" | "failed"; detail: string };

/**
 * Creates ONE booking together with ALL of its booking_services line items
 * ATOMICALLY, via the create_booking_with_services RPC installed by the
 * multi-service migration. PostgREST runs the call as a single statement, so
 * the booking row and its line items commit or roll back together — there is no
 * partial-write window.
 *
 * Database errors are classified here and never leaked to the customer:
 *   - exclusion/unique violation -> the slot was taken in a race
 *   - undefined function         -> the migration has not been applied yet
 */
export async function createBookingWithServices(
    input: CreateBookingWithServicesInput
): Promise<CreateBookingResult> {
    const { data, error } = await supabaseServer.rpc(
        "create_booking_with_services",
        {
            p_barber_id: input.barberId,
            p_service_id: input.primaryServiceId,
            p_customer_name: input.customerName,
            p_customer_phone: input.customerPhone,
            p_booking_date: input.bookingDate,
            p_start_time: input.startTime,
            p_end_time: input.endTime,
            p_total_price: input.totalPrice,
            p_total_duration_minutes: input.totalDurationMinutes,
            p_lines: input.lines,
        }
    );

    if (error) {
        const detail = `${error.code ?? ""}: ${error.message ?? ""}`;

        return {
            ok: false,
            reason: classifyBookingWriteError(error.code, error.message),
            detail,
        };
    }

    // returns public.bookings — PostgREST may deliver it as a row or a 1-row array.
    const booking = (Array.isArray(data) ? data[0] : data) as
        | CreatedBooking
        | null
        | undefined;

    if (!booking?.id) {
        return {
            ok: false,
            reason: "failed",
            detail: "RPC returned no booking row",
        };
    }

    return { ok: true, booking };
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