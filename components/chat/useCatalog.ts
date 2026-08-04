'use client';

import { useEffect, useState } from 'react';

export type CatalogBarber = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
};

export type CatalogService = {
    id: string;
    name: string;
    slug: string;
    price: number;
    duration_minutes: number;
    description: string | null;
    is_active: boolean;
};

type CatalogResponse = {
    success: boolean;
    barbers?: CatalogBarber[];
    services?: CatalogService[];
    error?: string;
};

export function useCatalog() {
    const [barbers, setBarbers] = useState<CatalogBarber[]>([]);
    const [services, setServices] = useState<CatalogService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCatalog() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/catalog', {
                    method: 'GET',
                    cache: 'no-store',
                });

                const data = (await response.json()) as CatalogResponse;

                if (
                    !response.ok ||
                    !data.success ||
                    !data.barbers ||
                    !data.services
                ) {
                    throw new Error(data.error || 'Failed to load booking catalog.');
                }

                setBarbers(data.barbers);
                setServices(data.services);
            } catch (catalogError) {
                const message =
                    catalogError instanceof Error
                        ? catalogError.message
                        : 'Failed to load booking catalog.';

                setError(message);
                setBarbers([]);
                setServices([]);
            } finally {
                setLoading(false);
            }
        }

        loadCatalog();
    }, []);

    return {
        barbers,
        services,
        loading,
        error,
    };
}