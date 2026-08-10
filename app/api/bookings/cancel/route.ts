import { NextRequest, NextResponse } from "next/server";

import { getUpcomingBookingsByPhone } from "@/lib/supabase/bookings";
import { getKoblenzDate } from "@/lib/timezone";
import { validatePhoneNumber } from "@/lib/validation/booking";
import { getServiceById } from "@/lib/supabase/services";
import { getBarbers } from "@/lib/supabase/barbers";

export async function GET(
    request: NextRequest
) {
    try {
        const phone =
            request.nextUrl.searchParams.get("phone");

        const phoneValidation =
            validatePhoneNumber(phone);

        if (!phoneValidation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: phoneValidation.error,
                },
                {
                    status: 400,
                }
            );
        }

        const bookings =
            await getUpcomingBookingsByPhone(
                phoneValidation.value,
                getKoblenzDate()
            );

        const barbers =
            await getBarbers();

        const enrichedBookings =
            await Promise.all(
                bookings.map(
                    async (booking) => {
                        const service =
                            await getServiceById(
                                booking.service_id
                            );

                        const barber =
                            barbers.find(
                                (item) =>
                                    item.id ===
                                    booking.barber_id
                            );

                        return {
                            id: booking.id,

                            barberId:
                                booking.barber_id,

                            barberName:
                                barber?.name ??
                                "Barber",

                            serviceId:
                                booking.service_id,

                            serviceName:
                                service?.name ??
                                "Appointment",

                            bookingDate:
                                booking.booking_date,

                            startTime:
                                booking.start_time.slice(
                                    0,
                                    5
                                ),
                        };
                    }
                )
            );

        return NextResponse.json({
            success: true,
            bookings: enrichedBookings,
        });
    } catch (error) {
        console.error(
            "Find cancellation bookings error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "Failed to find bookings.",
            },
            {
                status: 500,
            }
        );
    }
}