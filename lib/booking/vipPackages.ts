/**
 * VIP package definitions — the single source of truth for the two VIP
 * packages while the prepared Supabase migration is NOT yet applied.
 *
 * Duration and price are FIXED per package and must never be derived by summing
 * the individual services a package conceptually contains. The availability /
 * validation layer treats these values as authoritative so the browser can
 * never tell the backend a package lasts a different length of time.
 *
 * This module is intentionally dependency-free (no `server-only`, no Supabase)
 * so both the server routes and the client booking UI can share the same
 * numbers. When the packages become database-backed, replace
 * `getVipPackageBySlug` with a Supabase lookup by `slug` and keep this shape.
 */

export type VipPackageSlug = 'vip-exklusiv' | 'vip-koenigsklasse';

export type VipPackageDefinition = {
    slug: VipPackageSlug;
    /** Customer-facing name — German only. */
    name: string;
    /** FIXED appointment length in minutes. Never summed from included services. */
    durationMinutes: number;
    /** FIXED price in EUR. */
    price: number;
};

export const VIP_PACKAGE_DEFINITIONS: Record<
    VipPackageSlug,
    VipPackageDefinition
> = {
    'vip-koenigsklasse': {
        slug: 'vip-koenigsklasse',
        name: 'VIP KÖNIGSKLASSE',
        durationMinutes: 60,
        price: 65,
    },
    'vip-exklusiv': {
        slug: 'vip-exklusiv',
        name: 'VIP EXKLUSIV',
        durationMinutes: 40,
        price: 45,
    },
};

export const VIP_PACKAGE_SLUGS = Object.keys(
    VIP_PACKAGE_DEFINITIONS,
) as VipPackageSlug[];

export function isVipPackageSlug(value: unknown): value is VipPackageSlug {
    return (
        typeof value === 'string' &&
        Object.prototype.hasOwnProperty.call(VIP_PACKAGE_DEFINITIONS, value)
    );
}

export function getVipPackageBySlug(
    slug: string,
): VipPackageDefinition | null {
    return isVipPackageSlug(slug) ? VIP_PACKAGE_DEFINITIONS[slug] : null;
}
