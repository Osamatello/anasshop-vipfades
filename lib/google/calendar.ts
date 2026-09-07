import "server-only";

import { google } from "googleapis";

import {
    koblenzLocalDateTimeToUtc,
} from "@/lib/timezone";

import { buildBookingCalendarEvent } from "./calendarEvent";

const GOOGLE_CALENDAR_SCOPE =
    "https://www.googleapis.com/auth/calendar.events";

const ANAS_BARBER_ID =
    "9d36a15c-f26f-4e9f-926f-7c5763c1423b";

const ABD_BARBER_ID =
    "d115a860-db00-4904-a906-5c67478cf6d2";

type CreateCalendarEventInput = {
    barberId: string;
    /** Every service in this ONE booking, German, in selection order. */
    serviceNames: string[];
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    startTime: string;
    /** Total appointment length — equals bookings.end_time - start_time. */
    durationMinutes: number;
    totalPrice: number;
};

type DeleteCalendarEventInput = {
    barberId: string;
    eventId: string;
};

function getCalendarId(barberId: string): string {
    if (barberId === ANAS_BARBER_ID) {
        const calendarId =
            process.env.GOOGLE_CALENDAR_ANAS_ID;

        if (!calendarId) {
            throw new Error(
                "Missing GOOGLE_CALENDAR_ANAS_ID"
            );
        }

        return calendarId;
    }

    if (barberId === ABD_BARBER_ID) {
        const calendarId =
            process.env.GOOGLE_CALENDAR_ABD_ID;

        if (!calendarId) {
            throw new Error(
                "Missing GOOGLE_CALENDAR_ABD_ID"
            );
        }

        return calendarId;
    }

    throw new Error(
        `No Google Calendar configured for barber: ${barberId}`
    );
}

function getGoogleAuth() {
    const clientEmail =
        process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;

    const privateKey =
        process.env.GOOGLE_CALENDAR_PRIVATE_KEY;

    if (!clientEmail) {
        throw new Error(
            "Missing GOOGLE_CALENDAR_CLIENT_EMAIL"
        );
    }

    if (!privateKey) {
        throw new Error(
            "Missing GOOGLE_CALENDAR_PRIVATE_KEY"
        );
    }

    return new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: [GOOGLE_CALENDAR_SCOPE],
    });
}

export async function createGoogleCalendarEvent(
    input: CreateCalendarEventInput
) {
    const auth = getGoogleAuth();

    const calendar = google.calendar({
        version: "v3",
        auth,
    });

    const calendarId = getCalendarId(
        input.barberId
    );

    // Booking times are entered in Koblenz local time.
    // Convert them explicitly to UTC before sending them
    // to Google Calendar so there is no timezone ambiguity.
    const startDate =
        koblenzLocalDateTimeToUtc(
            input.bookingDate,
            input.startTime
        );

    // ONE booking == ONE event. The body (German summary/description and the
    // end derived from the total duration) is built by a pure, unit-tested
    // helper so it can be validated without touching a real calendar.
    const requestBody = buildBookingCalendarEvent({
        serviceNames: input.serviceNames,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        totalDurationMinutes: input.durationMinutes,
        totalPrice: input.totalPrice,
        startDate,
    });

    const response =
        await calendar.events.insert({
            calendarId,
            requestBody,
        });

    if (!response.data.id) {
        throw new Error(
            "Google Calendar event was created without an event ID."
        );
    }

    return {
        eventId: response.data.id,
        htmlLink:
            response.data.htmlLink ?? null,
    };
}

export async function deleteGoogleCalendarEvent(
    input: DeleteCalendarEventInput
): Promise<void> {
    const auth = getGoogleAuth();

    const calendar = google.calendar({
        version: "v3",
        auth,
    });

    const calendarId = getCalendarId(
        input.barberId
    );

    await calendar.events.delete({
        calendarId,
        eventId: input.eventId,
    });
}