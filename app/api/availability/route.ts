import { NextRequest, NextResponse } from "next/server";

import { getAvailableSlotsForDuration } from "@/lib/services/availability";
import { getBarberDayOff } from "@/lib/booking/barberSchedule";
import { resolveAppointmentSelection } from "@/lib/booking/appointmentSelection";

export const dynamic = "force-dynamic";

/**
 * Availability for a barber + date + the customer's COMPLETE selection.
 *
 * Selection is passed as one of:
 *   - serviceIds=<uuid>&serviceIds=<uuid>...   (repeatable) or serviceIds=<uuid>,<uuid>
 *   - vipPackage=vip-exklusiv | vip-koenigsklasse
 *   - serviceId=<uuid>                          (legacy single-service, still accepted)
 *
 * The required appointment duration is ALWAYS derived server-side from trusted
 * data (see resolveAppointmentSelection). The client never supplies a duration.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const barberId = searchParams.get("barberId");
        const date = searchParams.get("date");

        if (!barberId || !date) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Erforderliche Buchungsdaten fehlen.",
                },
                { status: 400 }
            );
        }

        // --- Collect the selection from the query string
        const serviceIds = [
            ...searchParams.getAll("serviceIds"),
            ...searchParams.getAll("serviceId"),
        ]
            .flatMap((value) => value.split(","))
            .map((value) => value.trim())
            .filter((value) => value.length > 0);

        const vipPackageSlugs = searchParams
            .getAll("vipPackage")
            .flatMap((value) => value.split(","))
            .map((value) => value.trim())
            .filter((value) => value.length > 0);

        if (serviceIds.length === 0 && vipPackageSlugs.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Erforderliche Buchungsdaten fehlen.",
                },
                { status: 400 }
            );
        }

        // --- Authoritative validation + required-duration resolution
        const selection = await resolveAppointmentSelection({
            serviceIds,
            vipPackageSlugs,
        });

        if (!selection.ok) {
            return NextResponse.json(
                {
                    success: false,
                    error: selection.error,
                    code: selection.code,
                },
                { status: 400 }
            );
        }

        // --- Barber day off (unchanged; applies to every selection kind)
        const barberDayOff = getBarberDayOff(barberId, date);

        if (barberDayOff) {
            return NextResponse.json({
                success: true,
                slots: [],
                requiredDurationMinutes: selection.requiredDurationMinutes,
                unavailableReason: "barber_off",
                message: `${barberDayOff.barberName} is off every ${barberDayOff.weekdayName}.`,
            });
        }

        const slots = await getAvailableSlotsForDuration(
            barberId,
            date,
            selection.requiredDurationMinutes
        );

        return NextResponse.json({
            success: true,
            slots,
            requiredDurationMinutes: selection.requiredDurationMinutes,
        });
    } catch (error) {
        console.error("Availability API error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to load available slots.",
            },
            { status: 500 }
        );
    }
}
