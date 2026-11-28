type BarberDayOff = {
    barberId: string;
    barberName: string;
    weekday: number;
    weekdayName: string;
};

// Weekly days off per barber (JavaScript weekday numbers, 0 = Sunday).
// Empty: Anas takes online bookings every online day (see onlineDays.ts).
const BARBER_DAYS_OFF: BarberDayOff[] = [];

const getUtcWeekday = (
    bookingDate: string
): number | null => {
    const date =
        new Date(
            `${bookingDate}T12:00:00Z`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date.getUTCDay();
};

export function getBarberDayOff(
    barberId: string,
    bookingDate: string
): BarberDayOff | null {
    const weekday =
        getUtcWeekday(
            bookingDate
        );

    if (weekday === null) {
        return null;
    }

    return (
        BARBER_DAYS_OFF.find(
            (dayOff) =>
                dayOff.barberId ===
                barberId &&
                dayOff.weekday ===
                weekday
        ) ?? null
    );
}

export function isBarberOff(
    barberId: string,
    bookingDate: string
): boolean {
    return Boolean(
        getBarberDayOff(
            barberId,
            bookingDate
        )
    );
}