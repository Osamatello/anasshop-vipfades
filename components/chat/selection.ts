import type { Service } from '@/lib/data';

import type { VipPackage } from './constants';
import type { AvailabilitySelection } from './booking-api';

/**
 * What the customer has chosen for ONE appointment: either one or more
 * individual services, or exactly one VIP package (never both).
 *
 * These helpers are the single client-side place that derives a label, a total
 * price and a total duration from a selection, so the picker summary and the
 * booking confirmation card can never disagree. The server still recomputes
 * everything authoritatively — these values are for display only.
 */
export type BookingSelection =
    | { kind: 'services'; services: Service[] }
    | { kind: 'vip'; vipPackage: VipPackage };

export function selectionLabel(selection: BookingSelection): string {
    if (selection.kind === 'vip') {
        return selection.vipPackage.name;
    }

    return selection.services.map((service) => service.name).join(' + ');
}

export function selectionTotalPrice(selection: BookingSelection): number {
    if (selection.kind === 'vip') {
        return selection.vipPackage.price;
    }

    return selection.services.reduce(
        (sum, service) => sum + service.price,
        0,
    );
}

export function selectionTotalDuration(selection: BookingSelection): number {
    if (selection.kind === 'vip') {
        // Fixed package length — never summed from the included services.
        return selection.vipPackage.durationMinutes;
    }

    return selection.services.reduce(
        (sum, service) => sum + (service.duration ?? 0),
        0,
    );
}

/** Shape sent to /api/availability. */
export function selectionToAvailability(
    selection: BookingSelection,
): AvailabilitySelection {
    if (selection.kind === 'vip') {
        return { kind: 'vip', vipPackageSlug: selection.vipPackage.slug };
    }

    return {
        kind: 'services',
        serviceIds: selection.services.map((service) => service.id),
    };
}

/** Shape sent to POST /api/bookings. */
export function selectionToBookingPayload(
    selection: BookingSelection,
):
    | { kind: 'services'; serviceIds: string[] }
    | { kind: 'vip'; vipPackageSlug: string } {
    if (selection.kind === 'vip') {
        return { kind: 'vip', vipPackageSlug: selection.vipPackage.slug };
    }

    return {
        kind: 'services',
        serviceIds: selection.services.map((service) => service.id),
    };
}

export function servicesSelection(services: Service[]): BookingSelection {
    return { kind: 'services', services };
}

export function vipSelection(vipPackage: VipPackage): BookingSelection {
    return { kind: 'vip', vipPackage };
}
