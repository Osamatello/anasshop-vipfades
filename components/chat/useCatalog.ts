'use client';

import { useEffect, useState } from 'react';

import type { Barber, Service } from '@/lib/data';

type CatalogBarberRow = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    is_active: boolean;
};

type CatalogServiceRow = {
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
    barbers?: CatalogBarberRow[];
    services?: CatalogServiceRow[];
    error?: string;
};

function mapBarber(barber: CatalogBarberRow): Barber {
    if (barber.slug === 'anas') {
        return {
            id: barber.id,
            name: barber.name,
            title: 'Head Barber & Founder',
            specialty: 'Fades, sharp lines & precision cuts',
        };
    }

    return {
        id: barber.id,
        name: barber.name,
        title: 'Senior Barber',
        specialty: 'Classic cuts, beard sculpting & styling',
    };
}

function mapService(service: CatalogServiceRow): Service {
    return {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration_minutes,
        description: service.description ?? '',
    };
}

export function useCatalog() {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const wait = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        async function fetchCatalog() {
            const response = await fetch(
                `/api/catalog?_=${Date.now()}`,
                {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                },
            );

            const data = (await response.json()) as CatalogResponse;

            if (
                !response.ok ||
                !data.success ||
                !data.barbers ||
                !data.services
            ) {
                throw new Error(
                    data.error || 'Failed to load booking catalog.',
                );
            }

            return data;
        }

        async function loadCatalog() {
            try {
                setLoading(true);
                setError(null);

                let lastError: unknown;

                for (let attempt = 0; attempt < 3; attempt += 1) {
                    try {
                        const data = await fetchCatalog();

                        if (cancelled) {
                            return;
                        }

                        setBarbers(data.barbers!.map(mapBarber));
                        setServices(data.services!.map(mapService));
                        return;
                    } catch (catalogError) {
                        lastError = catalogError;

                        if (attempt < 2) {
                            await wait(750 * (attempt + 1));
                        }
                    }
                }

                throw lastError;
            } catch (catalogError) {
                if (cancelled) {
                    return;
                }

                const message =
                    catalogError instanceof Error
                        ? catalogError.message
                        : 'Failed to load booking catalog.';

                setError(message);
                setBarbers([]);
                setServices([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCatalog();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        barbers,
        services,
        loading,
        error,
    };
}