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

                setBarbers(data.barbers.map(mapBarber));
                setServices(data.services.map(mapService));
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