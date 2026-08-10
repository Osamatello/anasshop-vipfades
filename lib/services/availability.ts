import { getBusinessHoursByDay } from "@/lib/supabase/business-hours";
import { getBookingsByBarberAndDate } from "@/lib/supabase/bookings";
import { getBlockedTimesByBarberAndDate } from "@/lib/supabase/blocked-times";
import { getServiceById } from "@/lib/supabase/services";

import {
    getKoblenzDate,
    getKoblenzTimeParts,
} from "@/lib/timezone";

const DEFAULT_SLOT_INTERVAL_MINUTES = 10;

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.slice(0, 5).split(":").map(Number);

    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
}

function isTodayOrPast(date: string): boolean {
    const todayInKoblenz = getKoblenzDate();

    return date <= todayInKoblenz;
}

function periodsOverlap(
    startOne: number,
    endOne: number,
    startTwo: number,
    endTwo: number
): boolean {
    return startOne < endTwo && endOne > startTwo;
}

export function generateTimeSlots(
    openTime: string,
    closeTime: string,
    serviceDurationMinutes: number,
    slotIntervalMinutes = DEFAULT_SLOT_INTERVAL_MINUTES
): string[] {
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    if (
        serviceDurationMinutes <= 0 ||
        slotIntervalMinutes <= 0 ||
        closeMinutes <= openMinutes
    ) {
        return [];
    }

    const slots: string[] = [];

    for (
        let startMinutes = openMinutes;
        startMinutes + serviceDurationMinutes <= closeMinutes;
        startMinutes += slotIntervalMinutes
    ) {
        slots.push(minutesToTime(startMinutes));
    }

    return slots;
}

export async function getAvailableSlots(
    barberId: string,
    serviceId: string,
    bookingDate: string
): Promise<string[]> {
    // Booking dates are evaluated using Koblenz local time.
    // No same-day or past bookings.
    if (isTodayOrPast(bookingDate)) {
        return [];
    }

    // Use UTC only to determine the weekday of the YYYY-MM-DD
    // calendar date. This avoids depending on the Vercel server timezone.
    const [year, month, day] = bookingDate.split("-").map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    const javascriptDay = date.getUTCDay();

    const dayOfWeek =
        javascriptDay === 0 ? 7 : javascriptDay;

    // Booking is only available Monday - Thursday.
    if (dayOfWeek < 1 || dayOfWeek > 4) {
        return [];
    }

    const [service, businessHours, bookings, blockedTimes] =
        await Promise.all([
            getServiceById(serviceId),
            getBusinessHoursByDay(dayOfWeek),
            getBookingsByBarberAndDate(
                barberId,
                bookingDate
            ),
            getBlockedTimesByBarberAndDate(
                barberId,
                bookingDate
            ),
        ]);

    if (
        !service ||
        !businessHours ||
        !businessHours.is_open
    ) {
        return [];
    }

    const possibleSlots = generateTimeSlots(
        businessHours.open_time,
        businessHours.close_time,
        service.duration_minutes
    );

    return possibleSlots.filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd =
            slotStart + service.duration_minutes;

        const overlapsBooking = bookings.some((booking) => {
            const bookingStart = timeToMinutes(
                booking.start_time
            );

            const bookingEnd = timeToMinutes(
                booking.end_time
            );

            return periodsOverlap(
                slotStart,
                slotEnd,
                bookingStart,
                bookingEnd
            );
        });

        if (overlapsBooking) {
            return false;
        }

        const overlapsBlockedTime = blockedTimes.some(
            (blockedTime) => {
                const blockedStartDate = new Date(
                    blockedTime.start_at
                );

                const blockedEndDate = new Date(
                    blockedTime.end_at
                );

                const blockedStartParts =
                    getKoblenzTimeParts(blockedStartDate);

                const blockedEndParts =
                    getKoblenzTimeParts(blockedEndDate);

                const blockedStart =
                    blockedStartParts.hours * 60 +
                    blockedStartParts.minutes;

                const blockedEnd =
                    blockedEndParts.hours * 60 +
                    blockedEndParts.minutes;

                return periodsOverlap(
                    slotStart,
                    slotEnd,
                    blockedStart,
                    blockedEnd
                );
            }
        );

        return !overlapsBlockedTime;
    });
}