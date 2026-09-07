type AvailabilityResponse = {
    success: boolean;
    slots?: string[];
    requiredDurationMinutes?: number;
    error?: string;
    code?: string;
};

/**
 * What the customer has selected for one appointment. Either one or more
 * individual services, or exactly one VIP package. The server derives the
 * required appointment duration from this — the client never sends a duration.
 */
export type AvailabilitySelection =
    | { kind: 'services'; serviceIds: string[] }
    | { kind: 'vip'; vipPackageSlug: string };

export async function getAvailability(params: {
    barberId: string;
    date: string;
    selection: AvailabilitySelection;
}): Promise<string[]> {
    const searchParams = new URLSearchParams({
        barberId: params.barberId,
        date: params.date,
    });

    if (params.selection.kind === 'vip') {
        searchParams.set('vipPackage', params.selection.vipPackageSlug);
    } else {
        for (const serviceId of params.selection.serviceIds) {
            searchParams.append('serviceIds', serviceId);
        }
    }

    const response = await fetch(
        `/api/availability?${searchParams.toString()}`,
        {
            method: 'GET',
            cache: 'no-store',
        },
    );

    const data = (await response.json()) as AvailabilityResponse;

    if (!response.ok || !data.success || !data.slots) {
        throw new Error(data.error || 'Failed to load availability.');
    }

    return data.slots;
}
