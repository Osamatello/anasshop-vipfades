import { NextRequest, NextResponse } from "next/server";

import {
    createBooking,
    getBookingsByBarberAndDate,
    saveGoogleCalendarEventId,
} from "@/lib/supabase/bookings";

import { getServiceById } from "@/lib/supabase/services";
import { getAvailableSlots } from "@/lib/services/availability";

import { createGoogleCalendarEvent } from "@/lib/google/calendar";

import {
    getKoblenzDate,
    getKoblenzTimeParts,
} from "@/lib/timezone";

import {
    validateCustomerName,
    validatePhoneNumber,
} from "@/lib/validation/booking";

import {
    bookingRateLimit,
    getClientIdentifier,
} from "@/lib/security/rateLimit";


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

    const hoursResult =
        Math.floor(totalMinutes / 60);

    const minutesResult =
        totalMinutes % 60;

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
    return (
        startOne < endTwo &&
        endOne > startTwo
    );
}


function isPastDate(date: string): boolean {
    return date < getKoblenzDate();
}


function isPastOrCurrentTimeToday(
    bookingDate: string,
    startTime: string
): boolean {
    if (
        bookingDate !==
        getKoblenzDate()
    ) {
        return false;
    }

    const nowInKoblenz =
        getKoblenzTimeParts(
            new Date()
        );

    const currentMinutes =
        nowInKoblenz.hours * 60 +
        nowInKoblenz.minutes;

    const bookingStart =
        timeToMinutes(startTime);

    return (
        bookingStart <=
        currentMinutes
    );
}


export async function POST(
    request: NextRequest
) {
    try {
        const identifier =
            getClientIdentifier(
                request.headers
            );

        const rateLimit =
            await bookingRateLimit.limit(
                identifier
            );


        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Zu viele Buchungsversuche. Bitte warte ein paar Minuten und versuche es erneut.",
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


        const body =
            await request.json();

        const {
            barberId,
            serviceId,
            customerName,
            customerPhone,
            bookingDate,
            startTime,
        } = body;


        if (
            typeof barberId !==
            "string" ||
            typeof serviceId !==
            "string" ||
            typeof bookingDate !==
            "string" ||
            typeof startTime !==
            "string" ||
            !barberId.trim() ||
            !serviceId.trim() ||
            !bookingDate.trim() ||
            !startTime.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Buchungsdaten fehlen.",
                },
                {
                    status: 400,
                }
            );
        }


        if (
            isPastDate(
                bookingDate
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Vergangene Tage können nicht gebucht werden. Bitte wähle ein anderes Datum.",
                },
                {
                    status: 400,
                }
            );
        }


        if (
            isPastOrCurrentTimeToday(
                bookingDate,
                startTime
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Diese Uhrzeit ist bereits vorbei. Bitte wähle eine spätere Zeit.",
                },
                {
                    status: 400,
                }
            );
        }


        const nameValidation =
            validateCustomerName(
                customerName
            );

        if (
            !nameValidation.valid
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        nameValidation.error,
                },
                {
                    status: 400,
                }
            );
        }


        const phoneValidation =
            validatePhoneNumber(
                customerPhone
            );

        if (
            !phoneValidation.valid
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        phoneValidation.error,
                },
                {
                    status: 400,
                }
            );
        }


        const service =
            await getServiceById(
                serviceId
            );


        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Leistung wurde nicht gefunden.",
                },
                {
                    status: 404,
                }
            );
        }


        const normalizedStartTime =
            startTime.slice(0, 5);

        const availableSlots =
            await getAvailableSlots(
                barberId,
                serviceId,
                bookingDate
            );

        if (
            !availableSlots.includes(
                normalizedStartTime
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Dieser Termin ist nicht verfügbar. Bitte wähle eine andere freie Zeit.",
                },
                {
                    status: 409,
                }
            );
        }


        const endTime =
            addMinutesToTime(
                normalizedStartTime,
                service.duration_minutes
            );


        const existingBookings =
            await getBookingsByBarberAndDate(
                barberId,
                bookingDate
            );


        const newStart =
            timeToMinutes(
                normalizedStartTime
            );

        const newEnd =
            timeToMinutes(
                endTime
            );


        const hasConflict =
            existingBookings.some(
                (booking) => {
                    const existingStart =
                        timeToMinutes(
                            booking.start_time
                        );

                    const existingEnd =
                        timeToMinutes(
                            booking.end_time
                        );

                    return periodsOverlap(
                        newStart,
                        newEnd,
                        existingStart,
                        existingEnd
                    );
                }
            );


        if (hasConflict) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Diese Zeit ist nicht mehr verfügbar. Bitte wähle eine andere Uhrzeit.",
                },
                {
                    status: 409,
                }
            );
        }


        const booking =
            await createBooking({
                barberId,
                serviceId,
                customerName:
                    nameValidation.value,
                customerPhone:
                    phoneValidation.value,
                bookingDate,
                startTime:
                    normalizedStartTime,
                endTime,
            });


        let calendarSynced =
            false;

        let calendarEventId:
            string | null =
            null;


        try {
            const calendarEvent =
                await createGoogleCalendarEvent(
                    {
                        barberId,
                        serviceName:
                            service.name,
                        customerName:
                            nameValidation.value,
                        customerPhone:
                            phoneValidation.value,
                        bookingDate,
                        startTime:
                            normalizedStartTime,
                        durationMinutes:
                            service.duration_minutes,
                    }
                );


            calendarEventId =
                calendarEvent.eventId;


            await saveGoogleCalendarEventId(
                booking.id,
                calendarEvent.eventId
            );


            calendarSynced =
                true;


        } catch (
        calendarError
        ) {
            console.error(
                "Google Calendar sync error:",
                calendarError
            );
        }


        return NextResponse.json({
            success: true,

            booking: {
                ...booking,
                google_calendar_event_id:
                    calendarEventId,
            },

            calendar: {
                synced:
                    calendarSynced,
                eventId:
                    calendarEventId,
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
                    "Buchung konnte nicht erstellt werden.",
            },
            {
                status: 500,
            }
        );
    }
}