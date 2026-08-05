import { getBusinessHoursByDay } from "@/lib/supabase/business-hours";
import { getBookingsByBarberAndDate } from "@/lib/supabase/bookings";
import { getBlockedTimesByBarberAndDate } from "@/lib/supabase/blocked-times";
import { getServiceById } from "@/lib/supabase/services";

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

function isSameDay(date: string): boolean {
    const today = new Date();
    const selectedDate = new Date(`${date}T12:00:00`);

    return (
        today.getFullYear() === selectedDate.getFullYear() &&
        today.getMonth() === selectedDate.getMonth() &&
        today.getDate() === selectedDate.getDate()
    );
}

function getCurrentMinutes(): number {
    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();
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
    const date = new Date(`${bookingDate}T12:00:00`);
    const javascriptDay = date.getDay();

    const dayOfWeek = javascriptDay === 0 ? 7 : javascriptDay;

    // Booking is only available Monday - Thursday
    if (dayOfWeek < 1 || dayOfWeek > 4) {
        return [];
    }

    const [service, businessHours, bookings, blockedTimes] = await Promise.all([
        getServiceById(serviceId),
        getBusinessHoursByDay(dayOfWeek),
        getBookingsByBarberAndDate(barberId, bookingDate),
        getBlockedTimesByBarberAndDate(barberId, bookingDate),
    ]);

    if (!service || !businessHours || !businessHours.is_open) {
        return [];
    }

    const possibleSlots = generateTimeSlots(
        businessHours.open_time,
        businessHours.close_time,
        service.duration_minutes
    );

    return possibleSlots.filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd = slotStart + service.duration_minutes;

        // Same-day booking rules
        if (isSameDay(bookingDate)) {
            const currentMinutes = getCurrentMinutes();

            // Remove past times
            if (slotStart <= currentMinutes) {
                return false;
            }

            // Make sure service can finish before closing time
            const closingMinutes = timeToMinutes(
                businessHours.close_time
            );

            if (slotEnd > closingMinutes) {
                return false;
            }
        }

        const overlapsBooking = bookings.some((booking) => {
            const bookingStart = timeToMinutes(booking.start_time);
            const bookingEnd = timeToMinutes(booking.end_time);

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

        const overlapsBlockedTime = blockedTimes.some((blockedTime) => {
            const blockedStartDate = new Date(blockedTime.start_at);
            const blockedEndDate = new Date(blockedTime.end_at);

            const blockedStart =
                blockedStartDate.getHours() * 60 +
                blockedStartDate.getMinutes();

            const blockedEnd =
                blockedEndDate.getHours() * 60 +
                blockedEndDate.getMinutes();

            return periodsOverlap(
                slotStart,
                slotEnd,
                blockedStart,
                blockedEnd
            );
        });

        return !overlapsBlockedTime;
    });
}