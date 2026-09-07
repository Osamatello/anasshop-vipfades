import { NextRequest, NextResponse } from "next/server";

import {
    getBookingServiceLines,
    getUpcomingBookingsByPhone,
    resolveBookingSelection,
} from "@/lib/supabase/bookings";
import { getKoblenzDate } from "@/lib/timezone";
import { validatePhoneNumber } from "@/lib/validation/booking";
import { getServices } from "@/lib/supabase/services";
import { getBarbers } from "@/lib/supabase/barbers";

import {
    cancellationLookupRateLimit,
    getClientIdentifier,
} from "@/lib/security/rateLimit";

export async function GET(
    request: NextRequest
) {
    try {
        const identifier =
            getClientIdentifier(
                request.headers
            );

        const rateLimit =
            await cancellationLookupRateLimit.limit(
                identifier
            );

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Zu viele Suchversuche. Bitte warte ein paar Minuten und versuche es erneut.",
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

        const [barbers, allServices, linesByBooking] = await Promise.all([
            getBarbers(),
            getServices(),
            getBookingServiceLines(bookings.map((booking) => booking.id)),
        ]);

        const servicesById = new Map(
            allServices.map((service) => [
                service.id,
                {
                    name: service.name,
                    price: Number(service.price),
                    duration: service.duration_minutes,
                },
            ])
        );

        // Show the COMPLETE selection (all services, or the VIP package name),
        // not just the legacy first service.
        const enrichedBookings = bookings.map((booking) => {
            const resolved = resolveBookingSelection({
                lines: linesByBooking.get(booking.id),
                servicesById,
                legacyServiceId: booking.service_id,
                totalPrice: null,
                totalDurationMinutes: null,
                startTime: booking.start_time,
                endTime: booking.end_time,
            });

            return {
                id: booking.id,
                barberId: booking.barber_id,
                barberName:
                    barbers.find((item) => item.id === booking.barber_id)
                        ?.name ?? "Barber",
                serviceId: booking.service_id,
                serviceName: resolved.serviceLabel,
                serviceNames: resolved.serviceNames,
                totalPrice: resolved.totalPrice,
                totalDurationMinutes: resolved.totalDurationMinutes,
                bookingDate: booking.booking_date,
                startTime: booking.start_time.slice(0, 5),
            };
        });

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
                    "Termine konnten nicht gefunden werden.",
            },
            {
                status: 500,
            }
        );
    }
}