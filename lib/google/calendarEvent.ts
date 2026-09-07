/**
 * Pure builder for the Google Calendar event body of ONE booking.
 *
 * Kept free of googleapis / server-only imports so the summary, description and
 * duration can be unit tested without ever touching a real calendar.
 *
 * ONE booking == ONE event. Multi-service bookings produce a single event whose
 * title lists the selected services; VIP bookings show the package name.
 * All customer-facing text is German.
 */

export type BookingCalendarEventInput = {
    /** German service names, in the order the customer selected them. */
    serviceNames: string[];
    customerName: string;
    customerPhone: string;
    /** Total appointment length — must equal bookings.end_time - start_time. */
    totalDurationMinutes: number;
    totalPrice: number;
    /** UTC instant of the appointment start (already converted from Koblenz local). */
    startDate: Date;
};

export type BookingCalendarEventBody = {
    summary: string;
    description: string;
    start: { dateTime: string };
    end: { dateTime: string };
};

const EVENT_TITLE_PREFIX = "VIP FADES";

export function formatServiceNames(serviceNames: string[]): string {
    return serviceNames.filter((name) => name.trim().length > 0).join(" + ");
}

export function buildBookingCalendarEvent(
    input: BookingCalendarEventInput,
): BookingCalendarEventBody {
    if (input.serviceNames.length === 0) {
        throw new Error("buildBookingCalendarEvent: no service names supplied");
    }

    if (
        Number.isNaN(input.startDate.getTime()) ||
        !Number.isFinite(input.totalDurationMinutes) ||
        input.totalDurationMinutes <= 0
    ) {
        throw new Error(
            "buildBookingCalendarEvent: invalid start time or duration",
        );
    }

    const serviceLabel = formatServiceNames(input.serviceNames);

    // Derive the end directly from the validated total duration so the event
    // length always matches bookings.start_time -> bookings.end_time exactly,
    // with no second timezone conversion.
    const endDate = new Date(
        input.startDate.getTime() + input.totalDurationMinutes * 60_000,
    );

    const serviceLines =
        input.serviceNames.length > 1
            ? input.serviceNames.map((name) => `  - ${name}`)
            : [];

    const description = [
        `Kunde: ${input.customerName}`,
        `Telefon: ${input.customerPhone}`,
        `Leistungen: ${serviceLabel}`,
        ...serviceLines,
        `Dauer: ${input.totalDurationMinutes} Min.`,
        `Gesamtpreis: ${input.totalPrice} EUR`,
        "Gebucht über die VIP FADES Website",
    ].join("\n");

    return {
        summary: `${EVENT_TITLE_PREFIX} – ${serviceLabel} – ${input.customerName}`,
        description,
        start: { dateTime: input.startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
    };
}
