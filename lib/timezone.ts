export const BUSINESS_TIME_ZONE = "Europe/Berlin";

function getTimeZoneOffsetMilliseconds(
    date: Date,
    timeZone: string
): number {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    });

    const parts = formatter.formatToParts(date);

    const values: Record<string, string> = {};

    for (const part of parts) {
        if (part.type !== "literal") {
            values[part.type] = part.value;
        }
    }

    const asUTC = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
    );

    return asUTC - date.getTime();
}

export function koblenzLocalDateTimeToUtc(
    date: string,
    time: string
): Date {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute, second = 0] = time.split(":").map(Number);

    const localAsUTC = Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        second
    );

    let candidate = new Date(localAsUTC);

    // Run twice so DST offsets are resolved correctly around transitions.
    for (let index = 0; index < 2; index += 1) {
        const offset = getTimeZoneOffsetMilliseconds(
            candidate,
            BUSINESS_TIME_ZONE
        );

        candidate = new Date(localAsUTC - offset);
    }

    return candidate;
}

export function getKoblenzDate(date = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: BUSINESS_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}

export function getKoblenzTimeParts(date: Date): {
    hours: number;
    minutes: number;
} {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    const parts = formatter.formatToParts(date);

    const hours = Number(
        parts.find((part) => part.type === "hour")?.value ?? "0"
    );

    const minutes = Number(
        parts.find((part) => part.type === "minute")?.value ?? "0"
    );

    return {
        hours,
        minutes,
    };
}