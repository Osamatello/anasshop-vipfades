import {
    Calendar,
    Clock,
    Tag,
    UserRound,
    CalendarX,
} from 'lucide-react';

import {
    VIP_PACKAGE_DEFINITIONS,
    type VipPackageSlug,
} from '@/lib/booking/vipPackages';
import type { VipPackageCardDetails } from '@/components/VipPackageCard';

export const QUICK_ACTIONS = [
    {
        label: 'Termin buchen',
        value: 'book',
        icon: Calendar,
    },
    {
        label: 'Preise ansehen',
        value: 'prices',
        icon: Tag,
    },
    {
        label: 'Verfügbarkeit prüfen',
        value: 'availability',
        icon: Clock,
    },
    {
        label: 'Barber wählen',
        value: 'barber',
        icon: UserRound,
    },
    {
        label: 'Termin stornieren',
        value: 'cancel',
        icon: CalendarX,
    },
];

/**
 * VIP-Pakete — presentation metadata for the two package cards.
 *
 * The authoritative name / price / duration / slug come from the shared
 * definitions in lib/booking/vipPackages.ts (the same values the server uses to
 * validate availability), so there is exactly one source of truth for those
 * numbers. Only the card-specific presentation (badge, copy, tier, discount
 * framing) lives here.
 *
 * Neither package is backed by a real catalog/Supabase service yet. Array order
 * == display order: most premium first (VIP KÖNIGSKLASSE, then VIP EXKLUSIV).
 * All customer-facing wording is German only.
 */
export type VipPackage = VipPackageCardDetails & {
    slug: VipPackageSlug;
};

/**
 * Presentation metadata keyed by slug. The BOOKABLE list of packages comes from
 * the catalogue (public.services), so a package that is not active in the
 * database is never offered to customers. This is what makes the staged
 * rollout safe: the rows are seeded inactive and switched on last.
 */
export const VIP_PACKAGE_PRESENTATION: Record<
    VipPackageSlug,
    Pick<
        VipPackage,
        'id' | 'tier' | 'badge' | 'description' | 'includes' | 'originalPrice' | 'discountLabel'
    >
> = {
    'vip-koenigsklasse': {
        id: '__vip_koenigsklasse__',
        tier: 'koenigsklasse',
        badge: 'HÖCHSTE STUFE',
        description:
            'Das komplette VIP FADES Erlebnis mit allen Leistungen inklusive Gesichtsreinigung.',
        includes: 'Enthält alle Einzelleistungen inkl. Gesichtsreinigung.',
    },
    'vip-exklusiv': {
        id: '__vip_exklusiv__',
        tier: 'exklusiv',
        badge: 'VIP-PAKET',
        description: 'Alle VIP-Leistungen ohne Gesichtsreinigung.',
        includes: 'Enthält alle Einzelleistungen außer Gesichtsreinigung.',
        originalPrice: 53,
        discountLabel: '15% RABATT',
    },
};

/** Display order: most premium first. */
export const VIP_PACKAGE_ORDER: VipPackageSlug[] = [
    'vip-koenigsklasse',
    'vip-exklusiv',
];

/** Static package cards for customer-facing areas outside the live catalogue. */
export const VIP_PACKAGE_CARDS: VipPackage[] = VIP_PACKAGE_ORDER.map((slug) => ({
    ...VIP_PACKAGE_PRESENTATION[slug],
    ...VIP_PACKAGE_DEFINITIONS[slug],
    slug,
}));
