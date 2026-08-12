const ANAS_BARBER_ID =
    "9d36a15c-f26f-4e9f-926f-7c5763c1423b";

const ABD_BARBER_ID =
    "d115a860-db00-4904-a906-5c67478cf6d2";

type BarberDayOff = {
    barberId: string;
    barberName: "Anas" | "Abd";
    weekday: number;
    weekdayName: "Tuesday" | "Wednesday";
};

const BARBER_DAYS_OFF: BarberDayOff[] = [
    {
        barberId: ABD_BARBER_ID,
        barberName: "Abd",
        weekday: 2,
        weekdayName: "Tuesday",
    },
    {
        barberId: ANAS_BARBER_ID,
        barberName: "Anas",
        weekday: 3,
        weekdayName: "Wednesday",
    },
];

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