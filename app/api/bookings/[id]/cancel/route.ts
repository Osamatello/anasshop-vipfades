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


export async function POST(
    _request: NextRequest,
    {
        params,
    }: {
        params: {
            id: string;
        };
    }
) {
    try {
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