import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/services/availability";

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
                        "Missing required parameters: barberId, serviceId and date.",
                },
                { status: 400 }
            );
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