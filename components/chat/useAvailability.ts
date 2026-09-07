'use client';

import { useState } from 'react';

import { getAvailability, type AvailabilitySelection } from './booking-api';

export function useAvailability() {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadAvailability(params: {
        barberId: string;
        date: string;
        selection: AvailabilitySelection;
    }) {
        setLoading(true);
        setError(null);

        try {
            const availableSlots = await getAvailability(params);
            setSlots(availableSlots);

            return availableSlots;
        } catch (availabilityError) {
            const message =
                availabilityError instanceof Error
                    ? availabilityError.message
                    : 'Failed to load availability.';

            setSlots([]);
            setError(message);

            return [];
        } finally {
            setLoading(false);
        }
    }

    function resetAvailability() {
        setSlots([]);
        setError(null);
    }

    return {
        slots,
        loading,
        error,
        loadAvailability,
        resetAvailability,
    };
}
