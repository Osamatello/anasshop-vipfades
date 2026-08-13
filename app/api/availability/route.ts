import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/services/availability";
import { getBarberDayOff } from "@/lib/booking/barberSchedule";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const barberId = searchParams.get("barberId");
        const serviceId = searchParams.get("serviceId");
        const date = searchParams.get("date");

        if (!barberId || !serviceId || !date) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Erforderliche Buchungsdaten fehlen.",
                },
                { status: 400 }
            );
        }

        const barberDayOff =
            getBarberDayOff(
                barberId,
                date
            );

        if (barberDayOff) {
            return NextResponse.json({
                success: true,
                slots: [],
                unavailableReason: "barber_off",
                message:
                    `${barberDayOff.barberName} is off every ${barberDayOff.weekdayName}.`,
            });
        }

        const slots = await getAvailableSlots(
            barberId,
            serviceId,
            date
        );

        return NextResponse.json({
            success: true,
            slots,
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