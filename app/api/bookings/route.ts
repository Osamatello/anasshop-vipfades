import { NextRequest, NextResponse } from "next/server";

import {
    createBookingWithServices,
    saveGoogleCalendarEventId,
} from "@/lib/supabase/bookings";

import { getAvailableSlotsForDuration } from "@/lib/services/availability";
import { getBarberDayOff } from "@/lib/booking/barberSchedule";
import { resolveAppointmentSelection } from "@/lib/booking/appointmentSelection";
import { resolveVipServiceRow } from "@/lib/booking/vipServices";
import { buildBookingPlan } from "@/lib/booking/bookingPlan";

import {
    isValidDateString,
    normalizeTime,
} from "@/lib/booking/time";

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

import { timeToMinutes } from "@/lib/booking/time";

/**
 * Create ONE booking.
 *
 * Accepted body (new contract):
 *   { barberId, customerName, customerPhone, bookingDate, startTime,
 *     selection: { kind: "services", serviceIds: string[] } }
 *   { barberId, customerName, customerPhone, bookingDate, startTime,
 *     selection: { kind: "vip", vipPackageSlug: "vip-exklusiv" | "vip-koenigsklasse" } }
 *
 * Backward compatible: a top-level `serviceId` (the pre-multi-service contract)
 * is accepted and treated as a one-service selection.
 *
 * Everything price/duration related is resolved SERVER-SIDE from trusted data
 * by resolveAppointmentSelection(); nothing the client sends about prices,
 * durations, names or totals is trusted.
 */

const GENERIC_UNAVAILABLE =
    "Dieser Termin ist nicht mehr verfügbar. Bitte wähle eine andere freie Zeit.";

function badRequest(error: string, code?: string, status = 400) {
    return NextResponse.json(
        { success: false, error, ...(code ? { code } : {}) },
        { status }
    );
}

function isPastDate(date: string): boolean {
    return date < getKoblenzDate();
}

function isPastOrCurrentTimeToday(
    bookingDate: string,
    startTime: string
): boolean {
    if (bookingDate !== getKoblenzDate()) {
        return false;
    }

    const nowInKoblenz = getKoblenzTimeParts(new Date());
    const currentMinutes = nowInKoblenz.hours * 60 + nowInKoblenz.minutes;

    return timeToMinutes(startTime) <= currentMinutes;
}

/** Normalises the new `selection` object and the legacy `serviceId` field. */
function readSelectionInput(body: Record<string, unknown>): {
    serviceIds: string[];
    vipPackageSlugs: string[];
} {
    const selection = body.selection as Record<string, unknown> | undefined;

    if (selection && typeof selection === "object") {
        if (selection.kind === "vip") {
            const slug = selection.vipPackageSlug;

            return {
                serviceIds: [],
                vipPackageSlugs: typeof slug === "string" ? [slug.trim()] : [""],
            };
        }

        if (selection.kind === "services") {
            const ids = Array.isArray(selection.serviceIds)
                ? selection.serviceIds
                : [];

            return {
                serviceIds: ids.map((value) =>
                    typeof value === "string" ? value.trim() : ""
                ),
                vipPackageSlugs: [],
            };
        }
    }

    // Legacy single-service contract.
    const legacyServiceId = body.serviceId;

    return {
        serviceIds:
            typeof legacyServiceId === "string" && legacyServiceId.trim()
                ? [legacyServiceId.trim()]
                : [],
        vipPackageSlugs: [],
    };
}

export async function POST(request: NextRequest) {
    try {
        const identifier = getClientIdentifier(request.headers);
        const rateLimit = await bookingRateLimit.limit(identifier);

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
                            Math.ceil((rateLimit.reset - Date.now()) / 1000)
                        ).toString(),
                    },
                }
            );
        }

        const body = (await request.json().catch(() => null)) as Record<
            string,
            unknown
        > | null;

        if (!body) {
            return badRequest("Buchungsdaten fehlen.");
        }

        const barberId = body.barberId;
        const bookingDate = body.bookingDate;
        const startTimeRaw = body.startTime;

        if (
            typeof barberId !== "string" ||
            !barberId.trim() ||
            typeof bookingDate !== "string" ||
            typeof startTimeRaw !== "string"
        ) {
            return badRequest("Buchungsdaten fehlen.");
        }

        // --- date / time shape -------------------------------------------------
        if (!isValidDateString(bookingDate)) {
            return badRequest("Ungültiges Datum.");
        }

        const startTime = normalizeTime(startTimeRaw);

        if (!startTime) {
            return badRequest("Ungültige Uhrzeit.");
        }

        if (isPastDate(bookingDate)) {
            return badRequest(
                "Vergangene Tage können nicht gebucht werden. Bitte wähle ein anderes Datum."
            );
        }

        if (isPastOrCurrentTimeToday(bookingDate, startTime)) {
            return badRequest(
                "Diese Uhrzeit ist bereits vorbei. Bitte wähle eine spätere Zeit."
            );
        }

        // --- customer details --------------------------------------------------
        const nameValidation = validateCustomerName(body.customerName);

        if (!nameValidation.valid) {
            return badRequest(nameValidation.error);
        }

        const phoneValidation = validatePhoneNumber(body.customerPhone);

        if (!phoneValidation.valid) {
            return badRequest(phoneValidation.error);
        }

        // --- barber availability for that weekday ------------------------------
        const barberDayOff = getBarberDayOff(barberId, bookingDate);

        if (barberDayOff) {
            return badRequest(
                `${barberDayOff.barberName} hat an diesem Wochentag frei. Bitte wähle einen anderen Tag.`,
                "barber_off",
                409
            );
        }

        // --- authoritative selection: services / VIP, totals, duration ---------
        const { serviceIds, vipPackageSlugs } = readSelectionInput(body);

        const selection = await resolveAppointmentSelection({
            serviceIds,
            vipPackageSlugs,
        });

        if (!selection.ok) {
            return badRequest(selection.error, selection.code);
        }

        // --- VIP packages must resolve to a real, consistent services row ------
        let vipServiceId: string | undefined;

        if (selection.kind === "vip") {
            const vipResolution = await resolveVipServiceRow(
                selection.vipPackage
            );

            if (!vipResolution.ok) {
                // Detail stays server-side; the customer sees a safe message.
                console.error(
                    "VIP package resolution failed:",
                    vipResolution.code,
                    vipResolution.detail
                );

                return badRequest(vipResolution.error, vipResolution.code, 409);
            }

            vipServiceId = vipResolution.serviceId;
        }

        // --- exact rows to write (pure) ----------------------------------------
        const plan = buildBookingPlan({
            selection,
            startTime,
            vipServiceId,
        });

        // --- re-validate availability immediately before writing ---------------
        // The customer may have seen this slot minutes ago; someone else may have
        // taken it since. This uses the SAME authoritative availability logic,
        // now with the full combined duration.
        const availableSlots = await getAvailableSlotsForDuration(
            barberId,
            bookingDate,
            plan.totalDurationMinutes
        );

        if (!availableSlots.includes(startTime)) {
            return badRequest(GENERIC_UNAVAILABLE, "slot_unavailable", 409);
        }

        // --- atomic write: booking + all booking_services lines ----------------
        const created = await createBookingWithServices({
            barberId,
            primaryServiceId: plan.primaryServiceId,
            customerName: nameValidation.value,
            customerPhone: phoneValidation.value,
            bookingDate,
            startTime: plan.startTime,
            endTime: plan.endTime,
            totalPrice: plan.totalPrice,
            totalDurationMinutes: plan.totalDurationMinutes,
            lines: plan.lines,
        });

        if (!created.ok) {
            if (created.reason === "slot_taken") {
                // Lost the race against the database exclusion constraint.
                console.warn("Booking slot race lost:", created.detail);
                return badRequest(GENERIC_UNAVAILABLE, "slot_unavailable", 409);
            }

            if (created.reason === "not_migrated") {
                console.error(
                    "Booking write blocked — multi-service migration not applied:",
                    created.detail
                );
            } else {
                console.error("Booking write failed:", created.detail);
            }

            return NextResponse.json(
                {
                    success: false,
                    error: "Buchung konnte nicht erstellt werden.",
                },
                { status: 500 }
            );
        }

        const booking = created.booking;

        // --- ONE Google Calendar event for the whole appointment ---------------
        // The booking is already committed and is authoritative. A calendar
        // failure must never lose or duplicate it, so it is logged and reported
        // via calendar.synced instead of failing the request.
        let calendarSynced = false;
        let calendarEventId: string | null = null;

        try {
            const calendarEvent = await createGoogleCalendarEvent({
                barberId,
                serviceNames: plan.serviceNames,
                customerName: nameValidation.value,
                customerPhone: phoneValidation.value,
                bookingDate,
                startTime: plan.startTime,
                durationMinutes: plan.totalDurationMinutes,
                totalPrice: plan.totalPrice,
            });

            calendarEventId = calendarEvent.eventId;

            await saveGoogleCalendarEventId(booking.id, calendarEvent.eventId);

            calendarSynced = true;
        } catch (calendarError) {
            console.error(
                "Google Calendar sync error for booking",
                booking.id,
                calendarError
            );
        }

        return NextResponse.json({
            success: true,

            booking: {
                ...booking,
                google_calendar_event_id: calendarEventId,
            },

            calendar: {
                synced: calendarSynced,
                eventId: calendarEventId,
            },
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Buchung konnte nicht erstellt werden.",
            },
            { status: 500 }
        );
    }
}
