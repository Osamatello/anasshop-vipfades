import { addMinutesToTime } from "./time";

/**
 * Turns an already-resolved, already-validated appointment selection into the
 * exact rows that will be written for ONE booking.
 *
 * Pure: no database, no network, no `server-only` — every value comes from the
 * caller, which must have obtained it from resolveAppointmentSelection() (and,
 * for VIP, from resolveVipServiceRow()). That keeps this fully unit-testable
 * and guarantees there is no second price/duration calculation path.
 */

export type BookingServiceLine = {
    service_id: string;
    price_each: number;
    duration_each: number;
    position: number;
};

/** Minimal structural shape of a resolved selection (see appointmentSelection.ts). */
export type PlannableSelection =
    | {
          kind: "services";
          services: {
              id: string;
              name: string;
              price: number;
              durationMinutes: number;
          }[];
          requiredDurationMinutes: number;
          totalPrice: number;
      }
    | {
          kind: "vip";
          vipPackage: {
              slug: string;
              name: string;
              price: number;
              durationMinutes: number;
          };
          requiredDurationMinutes: number;
          totalPrice: number;
      };

export type BookingPlan = {
    /**
     * bookings.service_id — kept for backward compatibility.
     * Individual services: the FIRST selected service.
     * VIP: the real database id of the VIP package's own services row.
     */
    primaryServiceId: string;
    lines: BookingServiceLine[];
    totalPrice: number;
    totalDurationMinutes: number;
    startTime: string;
    endTime: string;
    /** German, customer-facing; used to build the calendar event. */
    serviceNames: string[];
};

export function buildBookingPlan(input: {
    selection: PlannableSelection;
    startTime: string;
    /** Required for kind === "vip": the resolved services.id of the package row. */
    vipServiceId?: string;
}): BookingPlan {
    const { selection, startTime, vipServiceId } = input;

    const totalDurationMinutes = selection.requiredDurationMinutes;
    const totalPrice = selection.totalPrice;
    const endTime = addMinutesToTime(startTime, totalDurationMinutes);

    if (selection.kind === "vip") {
        if (!vipServiceId) {
            // Never fabricate a UUID — the caller must resolve the real row first.
            throw new Error(
                "buildBookingPlan: a VIP booking requires the resolved database service id",
            );
        }

        // ONE line representing the package itself — never its included services.
        return {
            primaryServiceId: vipServiceId,
            lines: [
                {
                    service_id: vipServiceId,
                    price_each: selection.vipPackage.price,
                    duration_each: selection.vipPackage.durationMinutes,
                    position: 1,
                },
            ],
            totalPrice,
            totalDurationMinutes,
            startTime,
            endTime,
            serviceNames: [selection.vipPackage.name],
        };
    }

    if (selection.services.length === 0) {
        throw new Error("buildBookingPlan: selection contains no services");
    }

    return {
        primaryServiceId: selection.services[0].id,
        lines: selection.services.map((service, index) => ({
            service_id: service.id,
            price_each: service.price,
            duration_each: service.durationMinutes,
            position: index + 1,
        })),
        totalPrice,
        totalDurationMinutes,
        startTime,
        endTime,
        serviceNames: selection.services.map((service) => service.name),
    };
}
