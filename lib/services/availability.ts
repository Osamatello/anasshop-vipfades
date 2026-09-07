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

function isPastDate(date: string): boolean {
    return date < getKoblenzDate();
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

/**
 * Core availability calculation. Given the FULL required appointment length
 * (already resolved server-side from the customer's complete selection — one
 * individual service, several individual services summed, or a fixed-length VIP
 * package), return every start time on `bookingDate` where the whole
 * appointment fits.
 *
 * All existing scheduling protections are applied unchanged:
 *   - online booking Monday–Thursday only
 *   - business hours + is_open
 *   - past dates rejected; same-day only future start times
 *   - no overlap with existing bookings for that barber/date
 *   - no overlap with blocked periods for that barber/date
 *   - Koblenz timezone handling
 *
 * Barber days off are handled by the caller (route) via getBarberDayOff, as
 * before.
 */
export async function getAvailableSlotsForDuration(
    barberId: string,
    bookingDate: string,
    requiredDurationMinutes: number
): Promise<string[]> {
    if (
        !Number.isFinite(requiredDurationMinutes) ||
        requiredDurationMinutes <= 0
    ) {
        return [];
    }

    // Past dates cannot be booked.
    // Same-day bookings are allowed if the appointment time
    // has not already passed in Koblenz.
    if (isPastDate(bookingDate)) {
        return [];
    }

    const [year, month, day] = bookingDate.split("-").map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    const javascriptDay = date.getUTCDay();

    const dayOfWeek =
        javascriptDay === 0 ? 7 : javascriptDay;

    // Online booking is available Monday - Thursday.
    if (dayOfWeek < 1 || dayOfWeek > 4) {
        return [];
    }

    const [businessHours, bookings, blockedTimes] =
        await Promise.all([
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
        !businessHours ||
        !businessHours.is_open
    ) {
        return [];
    }

    const possibleSlots = generateTimeSlots(
        businessHours.open_time,
        businessHours.close_time,
        requiredDurationMinutes
    );

    const todayInKoblenz = getKoblenzDate();
    const isSameDay =
        bookingDate === todayInKoblenz;

    const nowInKoblenz =
        getKoblenzTimeParts(new Date());

    const currentMinutes =
        nowInKoblenz.hours * 60 +
        nowInKoblenz.minutes;

    return possibleSlots.filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd =
            slotStart + requiredDurationMinutes;

        // For same-day bookings, only future appointment
        // start times are available.
        if (
            isSameDay &&
            slotStart <= currentMinutes
        ) {
            return false;
        }

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

/**
 * Backward-compatible single-service wrapper. Kept so the existing
 * single-service booking-create path (app/api/bookings/route.ts) keeps working
 * unchanged in this milestone. Resolves the service, then delegates to
 * getAvailableSlotsForDuration with its duration.
 */
export async function getAvailableSlots(
    barberId: string,
    serviceId: string,
    bookingDate: string
): Promise<string[]> {
    const service = await getServiceById(serviceId);

    if (!service) {
        return [];
    }

    return getAvailableSlotsForDuration(
        barberId,
        bookingDate,
        service.duration_minutes
    );
}