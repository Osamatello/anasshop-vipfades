type AvailabilityResponse = {
    success: boolean;
    slots?: string[];
    error?: string;
};

export async function getAvailability(params: {
    barberId: string;
    serviceId: string;
    date: string;
}): Promise<string[]> {
    const searchParams = new URLSearchParams({
        barberId: params.barberId,
        serviceId: params.serviceId,
        date: params.date,
    });

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