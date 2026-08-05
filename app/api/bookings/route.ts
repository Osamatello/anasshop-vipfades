import { NextRequest, NextResponse } from "next/server";

import {
    createBooking,
    getBookingsByBarberAndDate,
} from "@/lib/supabase/bookings";

import { getServiceById } from "@/lib/supabase/services";


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
            !barberId ||
            !serviceId ||
            !customerName ||
            !customerPhone ||
            !bookingDate ||
            !startTime
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


        const booking = await createBooking({
            barberId,
            serviceId,
            customerName,
            customerPhone,
            bookingDate,
            startTime,
            endTime,
        });


        return NextResponse.json({
            success: true,
            booking,
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