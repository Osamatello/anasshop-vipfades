import "server-only";

import { getServiceBySlug } from "@/lib/supabase/services";

import type { VipPackageDefinition } from "./vipPackages";

/**
 * Resolves the REAL database services row backing a VIP package.
 *
 * bookings.service_id and booking_services.service_id are uuid FKs, so a VIP
 * booking may only be written once the package exists as an actual services
 * row. We never fabricate a uuid and never store the local slug in a uuid
 * column — the row is looked up by its stable slug.
 *
 * The row is also checked against the approved package definition. If the
 * database says something different (price edited by hand, wrong duration,
 * deactivated), we FAIL SAFELY instead of silently booking inconsistent data.
 *
 * Until the prepared migration is applied these rows do not exist, so VIP
 * bookings cleanly fail with `vip_package_unavailable` — which is the correct
 * behaviour, not a workaround.
 */

export type VipServiceResolutionErrorCode =
    | "vip_package_unavailable"
    | "vip_package_mismatch";

export type VipServiceResolution =
    | { ok: true; serviceId: string }
    | {
          ok: false;
          code: VipServiceResolutionErrorCode;
          /** Customer-facing, German. */
          error: string;
          /** Server-side only — logged, never returned to the client. */
          detail: string;
      };

const UNAVAILABLE_MESSAGE =
    "Dieses VIP-Paket ist aktuell nicht buchbar. Bitte wähle eine andere Leistung oder kontaktiere uns direkt.";

export async function resolveVipServiceRow(
    vipPackage: VipPackageDefinition,
): Promise<VipServiceResolution> {
    const row = await getServiceBySlug(vipPackage.slug);

    if (!row) {
        return {
            ok: false,
            code: "vip_package_unavailable",
            error: UNAVAILABLE_MESSAGE,
            detail: `No services row with slug "${vipPackage.slug}". The multi-service migration has probably not been applied yet.`,
        };
    }

    if (!row.is_active) {
        return {
            ok: false,
            code: "vip_package_unavailable",
            error: UNAVAILABLE_MESSAGE,
            detail: `services row "${vipPackage.slug}" exists but is_active = false.`,
        };
    }

    const databasePrice = Number(row.price);
    const databaseDuration = row.duration_minutes;

    if (
        databasePrice !== vipPackage.price ||
        databaseDuration !== vipPackage.durationMinutes
    ) {
        return {
            ok: false,
            code: "vip_package_mismatch",
            error: UNAVAILABLE_MESSAGE,
            detail:
                `services row "${vipPackage.slug}" disagrees with the approved package definition: ` +
                `database = ${databasePrice} EUR / ${databaseDuration} min, ` +
                `expected = ${vipPackage.price} EUR / ${vipPackage.durationMinutes} min.`,
        };
    }

    return { ok: true, serviceId: row.id };
}
