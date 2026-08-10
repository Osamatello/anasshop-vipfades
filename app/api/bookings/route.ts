import { NextRequest, NextResponse } from "next/server";

import {
    createBooking,
    getBookingsByBarberAndDate,
} from "@/lib/supabase/bookings";

import { getServiceById } from "@/lib/supabase/services";

import { createGoogleCalendarEvent } from "@/lib/google/calendar";

import {
    validateCustomerName,
    validatePhoneNumber,
} from "@/lib/validation/booking";


function timeToMinutes(time: string): number {
    const [hours, minutes] = time
        .slice(0, 5)
        .split(":")
        .map(Number);

    return hours * 60 + minutes;
}


function addMinutesToTime(
    time: string,
    minutesToAdd: number
): string {
    const totalMinutes =
        timeToMinutes(time) + minutesToAdd;

    const hoursResult = Math.floor(totalMinutes / 60);
    const minutesResult = totalMinutes % 60;

    return `${hoursResult
        .toString()
        .padStart(2, "0")}:${minutesResult
            .toString()
            .padStart(2, "0")}`;
}


function periodsOverlap(
    startOne: number,
    endOne: number,
    startTwo: number,
    endTwo: number
): boolean {
    return startOne < endTwo && endOne > startTwo;
}


function isTodayOrPast(date: string): boolean {
    const today = new Date();
    const selectedDate = new Date(`${date}T12:00:00`);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate <= today;
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            barberId,
            serviceId,
            customerName,
            customerPhone,
            bookingDate,
            startTime,
        } = body;


        if (
            typeof barberId !== "string" ||
            typeof serviceId !== "string" ||
            typeof bookingDate !== "string" ||
            typeof startTime !== "string" ||
            !barberId.trim() ||
            !serviceId.trim() ||
            !bookingDate.trim() ||
            !startTime.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing booking information.",
                },
                {
                    status: 400,
                }
            );
        }


        // No same-day or past bookings.
        // The earliest possible booking date is tomorrow.
        if (isTodayOrPast(bookingDate)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Same-day bookings are not available. Please choose a future date.",
                },
                {
                    status: 400,
                }
            );
        }


        const nameValidation =
            validateCustomerName(customerName);

        if (!nameValidation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: nameValidation.error,
                },
                {
                    status: 400,
                }
            );
        }


        const phoneValidation =
            validatePhoneNumber(customerPhone);

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


        const service = await getServiceById(serviceId);


        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Service not found.",
                },
                {
                    status: 404,
                }
            );
        }


        const endTime = addMinutesToTime(
            startTime,
            service.duration_minutes
        );


        // Double booking protection
        const existingBookings =
            await getBookingsByBarberAndDate(
                barberId,
                bookingDate
            );


        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);


        const hasConflict = existingBookings.some((booking) => {
            const existingStart = timeToMinutes(
                booking.start_time
            );

            const existingEnd = timeToMinutes(
                booking.end_time
            );

            return periodsOverlap(
                newStart,
                newEnd,
                existingStart,
                existingEnd
            );
        });


        if (hasConflict) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "This time slot is no longer available. Please choose another time.",
                },
                {
                    status: 409,
                }
            );
        }


        // Supabase remains the source of truth.
        const booking = await createBooking({
            barberId,
            serviceId,
            customerName: nameValidation.value,
            customerPhone: phoneValidation.value,
            bookingDate,
            startTime,
            endTime,
        });


        // Google Calendar synchronization.
        // A Calendar failure must not remove or invalidate
        // a booking that was successfully stored in Supabase.
        let calendarSynced = false;
        let calendarEventId: string | null = null;

        try {
            const calendarEvent =
                await createGoogleCalendarEvent({
                    barberId,
                    serviceName: service.name,
                    customerName: nameValidation.value,
                    customerPhone: phoneValidation.value,
                    bookingDate,
                    startTime,
                    endTime,
                });

            calendarSynced = true;
            calendarEventId = calendarEvent.eventId;
        } catch (calendarError) {
            console.error(
                "Google Calendar sync error:",
                calendarError
            );
        }


        return NextResponse.json({
            success: true,
            booking,
            calendar: {
                synced: calendarSynced,
                eventId: calendarEventId,
            },
        });


    } catch (error) {

        console.error(
            "Create booking error:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    "Failed to create booking.",
            },
            {
                status: 500,
            }
        );
    }
}