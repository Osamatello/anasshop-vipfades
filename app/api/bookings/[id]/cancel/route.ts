import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    cancelBooking,
    clearGoogleCalendarEventId,
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


        const alreadyCancelled =
            booking.status === "cancelled";

        if (
            booking.status !== "booked" &&
            !alreadyCancelled
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

        let confirmedBooking = booking;

        if (!alreadyCancelled) {
            const cancellationConfirmed =
                await cancelBooking(
                    booking.id
                );

            if (!cancellationConfirmed) {
                const latestBooking =
                    await getBookingById(
                        booking.id
                    );

                if (
                    !latestBooking ||
                    latestBooking.customer_phone !==
                        phoneResult.value ||
                    latestBooking.status !==
                        "cancelled"
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            error:
                                "Der Termin konnte nicht storniert werden. Bitte versuche es erneut.",
                        },
                        {
                            status: 409,
                        }
                    );
                }

                confirmedBooking =
                    latestBooking;
            } else {
                confirmedBooking = {
                    ...booking,
                    status: "cancelled",
                };
            }
        }

        let calendarDeleted = false;
        let calendarAlreadyMissing = false;
        let calendarCleanupPending = false;

        const calendarEventId =
            confirmedBooking.google_calendar_event_id;

        if (calendarEventId) {
            try {
                const deletionResult =
                    await deleteGoogleCalendarEvent({
                        barberId:
                            confirmedBooking.barber_id,

                        eventId:
                            calendarEventId,
                    });

                calendarDeleted =
                    deletionResult === "deleted";

                calendarAlreadyMissing =
                    deletionResult ===
                    "already_missing";

                await clearGoogleCalendarEventId(
                    confirmedBooking.id,
                    calendarEventId
                );
            } catch (calendarError) {
                calendarCleanupPending = true;

                console.error(
                    "Cancelled booking, but Google Calendar cleanup is pending:",
                    calendarError
                );
            }
        }

        return NextResponse.json({
            success: true,
            alreadyCancelled,

            booking: {
                id:
                    confirmedBooking.id,

                status:
                    "cancelled",
            },

            calendar: {
                deleted:
                    calendarDeleted,

                alreadyMissing:
                    calendarAlreadyMissing,

                cleanupPending:
                    calendarCleanupPending,
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