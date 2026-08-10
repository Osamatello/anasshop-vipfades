import "server-only";

import { google } from "googleapis";

const GOOGLE_CALENDAR_SCOPE =
    "https://www.googleapis.com/auth/calendar.events";

const ANAS_BARBER_ID =
    "9d36a15c-f26f-4e9f-926f-7c5763c1423b";

const ABD_BARBER_ID =
    "d115a860-db00-4904-a906-5c67478cf6d2";

const TIME_ZONE = "Europe/Berlin";

type CreateCalendarEventInput = {
    barberId: string;
    serviceName: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
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

    const response =
        await calendar.events.insert({
            calendarId,

            requestBody: {
                summary: `${input.serviceName} — ${input.customerName}`,

                description: [
                    `Customer: ${input.customerName}`,
                    `Phone: ${input.customerPhone}`,
                    `Service: ${input.serviceName}`,
                    "Booked through VIP FADES website",
                ].join("\n"),

                start: {
                    dateTime:
                        `${input.bookingDate}T${input.startTime}:00`,
                    timeZone: TIME_ZONE,
                },

                end: {
                    dateTime:
                        `${input.bookingDate}T${input.endTime}:00`,
                    timeZone: TIME_ZONE,
                },
            },
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