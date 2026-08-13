import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    cancelBooking,
    getBookingById,
} from "@/lib/supabase/bookings";

import {
    deleteGoogleCalendarEvent,
} from "@/lib/google/calendar";

import {
    validatePhoneNumber,
} from "@/lib/validation/booking";

import {
    cancellationRateLimit,
    getClientIdentifier,
} from "@/lib/security/rateLimit";


export async function POST(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        const identifier =
            getClientIdentifier(
                request.headers
            );

        const rateLimit =
            await cancellationRateLimit.limit(
                identifier
            );

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Zu viele Stornierungsversuche. Bitte warte ein paar Minuten und versuche es erneut.",
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": Math.max(
                            1,
                            Math.ceil(
                                (
                                    rateLimit.reset -
                                    Date.now()
                                ) / 1000
                            )
                        ).toString(),
                    },
                }
            );
        }


        const {
            id: bookingId,
        } =
            await params;


        if (
            !bookingId ||
            !bookingId.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Buchungs-ID fehlt.",
                },
                {
                    status: 400,
                }
            );
        }


        const body =
            await request.json().catch(
                () => null
            );

        const phoneResult =
            validatePhoneNumber(
                body?.phone ?? ""
            );


        if (!phoneResult.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Eine gültige Telefonnummer der Buchung ist erforderlich.",
                },
                {
                    status: 400,
                }
            );
        }


        const booking =
            await getBookingById(
                bookingId
            );


        if (!booking) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Termin wurde nicht gefunden.",
                },
                {
                    status: 404,
                }
            );
        }


        if (
            booking.customer_phone !==
            phoneResult.value
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Die Überprüfung des Termins ist fehlgeschlagen.",
                },
                {
                    status: 403,
                }
            );
        }


        if (
            booking.status ===
            "cancelled"
        ) {
            return NextResponse.json({
                success: true,
                alreadyCancelled: true,
            });
        }


        if (
            booking.status !==
            "booked"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Dieser Termin kann nicht storniert werden.",
                },
                {
                    status: 409,
                }
            );
        }


        if (
            booking.google_calendar_event_id
        ) {
            await deleteGoogleCalendarEvent({
                barberId:
                    booking.barber_id,

                eventId:
                    booking.google_calendar_event_id,
            });
        }


        await cancelBooking(
            booking.id
        );


        return NextResponse.json({
            success: true,

            booking: {
                id:
                    booking.id,

                status:
                    "cancelled",
            },

            calendar: {
                deleted:
                    Boolean(
                        booking.google_calendar_event_id
                    ),
            },
        });


    } catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    "Termin konnte nicht storniert werden.",
            },
            {
                status: 500,
            }
        );
    }
}