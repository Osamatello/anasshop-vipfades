import "server-only";

import { getServicesByIds } from "@/lib/supabase/services";

import {
    getVipPackageBySlug,
    type VipPackageDefinition,
} from "./vipPackages";

/**
 * The ONE authoritative place where a customer's service selection is validated
 * and turned into the required appointment duration (and total price).
 *
 * Both the availability endpoint (Milestone 5) and, later, the booking-create
 * endpoint (Milestone 6) call this. The browser never supplies a total
 * duration — it only names services / a VIP package, and this resolver derives
 * the real numbers from trusted data:
 *   - individual services  -> sum of `duration_minutes` from the database
 *   - VIP EXKLUSIV          -> fixed 40 minutes
 *   - VIP KÖNIGSKLASSE      -> fixed 60 minutes
 *
 * Selection rules enforced here (server-side is authoritative):
 *   - a VIP package cannot be combined with another VIP package
 *   - a VIP package cannot be combined with individual services
 *   - multiple individual services ARE allowed (one continuous appointment)
 *   - duplicate service ids are rejected
 *   - unknown / inactive services are rejected
 *   - malformed service ids are rejected
 */

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Guard against absurd payloads; the real catalogue has 7 services. */
const MAX_SERVICES_PER_APPOINTMENT = 12;

export type AppointmentSelectionInput = {
    serviceIds?: string[];
    vipPackageSlugs?: string[];
};

export type AppointmentSelectionErrorCode =
    | "empty_selection"
    | "invalid_service_id"
    | "duplicate_service_id"
    | "too_many_services"
    | "unknown_service"
    | "unknown_vip_package"
    | "multiple_vip_packages"
    | "vip_with_services";

export type ResolvedAppointmentSelection =
    | {
          ok: true;
          kind: "services";
          serviceIds: string[];
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
          ok: true;
          kind: "vip";
          vipPackage: VipPackageDefinition;
          requiredDurationMinutes: number;
          totalPrice: number;
      }
    | {
          ok: false;
          code: AppointmentSelectionErrorCode;
          error: string;
      };

function fail(
    code: AppointmentSelectionErrorCode,
    error: string,
): ResolvedAppointmentSelection {
    return { ok: false, code, error };
}

export async function resolveAppointmentSelection(
    input: AppointmentSelectionInput,
): Promise<ResolvedAppointmentSelection> {
    const rawServiceIds = Array.isArray(input.serviceIds)
        ? input.serviceIds
        : [];

    const vipPackageSlugs = (
        Array.isArray(input.vipPackageSlugs) ? input.vipPackageSlugs : []
    )
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter((value) => value.length > 0);

    // --- Normalise + shape-check the service ids
    const serviceIds: string[] = [];

    for (const value of rawServiceIds) {
        const trimmed = typeof value === "string" ? value.trim() : "";

        if (!trimmed || !UUID_PATTERN.test(trimmed)) {
            return fail(
                "invalid_service_id",
                "Ungültige Leistungsauswahl.",
            );
        }

        serviceIds.push(trimmed);
    }

    // --- VIP package path ------------------------------------------------------
    if (vipPackageSlugs.length > 0) {
        if (vipPackageSlugs.length > 1) {
            return fail(
                "multiple_vip_packages",
                "Es kann nur ein VIP-Paket ausgewählt werden.",
            );
        }

        if (serviceIds.length > 0) {
            return fail(
                "vip_with_services",
                "Ein VIP-Paket kann nicht mit einzelnen Leistungen kombiniert werden.",
            );
        }

        const vipPackage = getVipPackageBySlug(vipPackageSlugs[0]);

        if (!vipPackage) {
            return fail(
                "unknown_vip_package",
                "Dieses VIP-Paket ist nicht verfügbar.",
            );
        }

        return {
            ok: true,
            kind: "vip",
            vipPackage,
            requiredDurationMinutes: vipPackage.durationMinutes,
            totalPrice: vipPackage.price,
        };
    }

    // --- Individual services path -------------------------------------------
    if (serviceIds.length === 0) {
        return fail(
            "empty_selection",
            "Bitte wähle mindestens eine Leistung aus.",
        );
    }

    if (serviceIds.length > MAX_SERVICES_PER_APPOINTMENT) {
        return fail(
            "too_many_services",
            "Es wurden zu viele Leistungen ausgewählt.",
        );
    }

    const uniqueIds = Array.from(new Set(serviceIds));

    if (uniqueIds.length !== serviceIds.length) {
        return fail(
            "duplicate_service_id",
            "Eine Leistung wurde mehrfach ausgewählt.",
        );
    }

    const rows = await getServicesByIds(uniqueIds);
    const rowsById = new Map(rows.map((row) => [row.id, row]));

    for (const id of uniqueIds) {
        if (!rowsById.has(id)) {
            // getServicesByIds only returns active services, so a missing id is
            // either unknown or inactive — reject either way.
            return fail(
                "unknown_service",
                "Eine ausgewählte Leistung ist nicht verfügbar.",
            );
        }
    }

    // Preserve the caller's order; use trusted duration/price from the database.
    const services = serviceIds.map((id) => {
        const row = rowsById.get(id)!;

        return {
            id: row.id,
            name: row.name,
            price: Number(row.price),
            durationMinutes: row.duration_minutes,
        };
    });

    const requiredDurationMinutes = services.reduce(
        (sum, service) => sum + service.durationMinutes,
        0,
    );

    const totalPrice = services.reduce(
        (sum, service) => sum + service.price,
        0,
    );

    if (!Number.isFinite(requiredDurationMinutes) || requiredDurationMinutes <= 0) {
        return fail(
            "unknown_service",
            "Die Dauer der ausgewählten Leistungen ist ungültig.",
        );
    }

    return {
        ok: true,
        kind: "services",
        serviceIds,
        services,
        requiredDurationMinutes,
        totalPrice,
    };
}
