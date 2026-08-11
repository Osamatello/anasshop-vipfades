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
        params: {
            id: string;
        };
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
                        "Too many cancellation attempts. Please wait a few minutes and try again.",
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


        const bookingId =
            params.id;


        if (
            !bookingId ||
            !bookingId.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Missing booking ID.",
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
                        "A valid booking phone number is required.",
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
                        "Booking not found.",
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
                        "Booking verification failed.",
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
                        "This booking cannot be cancelled.",
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
                    "Failed to cancel booking.",
            },
            {
                status: 500,
            }
        );
    }
}