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
            title: 'Head Barber & Gründer',
            specialty: 'Fades, scharfe Konturen & Präzisions-Cuts',
        };
    }

    return {
        id: barber.id,
        name: barber.name,
        title: 'Senior Barber',
        specialty: 'Klassische Cuts, Bartstyling & Styling',
    };
}

function mapService(service: CatalogServiceRow): Service {
    const normalizedSlug =
        service.slug
            .trim()
            .toLowerCase();

    const normalizedName =
        service.name
            .trim()
            .toLowerCase();

    const matches = (
        ...values: string[]
    ) =>
        values.some(
            (value) =>
                normalizedSlug === value ||
                normalizedName === value
        );

    let localized:
        | {
            name: string;
            description: string;
        }
        | undefined;

    if (
        matches(
            'haircut',
            'mens-haircut',
            "men's haircut",
            'mens haircut'
        )
    ) {
        localized = {
            name: 'Herrenhaarschnitt',
            description:
                'Präziser Haarschnitt, abgestimmt auf deinen Style.',
        };
    } else if (
        matches(
            'beard',
            'beard-trim',
            'beard trim'
        )
    ) {
        localized = {
            name: 'Bart trimmen',
            description:
                'Formen, Konturen und ein sauberes Bart-Finish.',
        };
    } else if (
        matches(
            'haircut-beard',
            'haircut-and-beard',
            'haircut + beard'
        )
    ) {
        localized = {
            name: 'Haarschnitt + Bart',
            description:
                'Das komplette Grooming-Erlebnis.',
        };
    } else if (
        matches(
            'eyebrows',
            'eyebrow'
        )
    ) {
        localized = {
            name: 'Augenbrauen',
            description:
                'Saubere Form und präzise Konturen.',
        };
    } else if (
        matches(
            'facial',
            'facial-cleansing',
            'facial cleansing'
        )
    ) {
        localized = {
            name: 'Gesichtsreinigung',
            description:
                'Tiefenreinigung für ein frisches Hautgefühl.',
        };
    } else if (
        matches(
            'hotwax',
            'hot-wax',
            'hot wax'
        )
    ) {
        localized = {
            name: 'Heißwachs',
            description:
                'Glattes Finish mit warmer Wachsbehandlung.',
        };
    } else if (
        matches(
            'ears-nose',
            'ears-and-nose',
            'ears & nose'
        )
    ) {
        localized = {
            name: 'Ohren & Nase',
            description:
                'Schnelle und saubere Detailpflege.',
        };
    }

    return {
        id: service.id,
        name:
            localized?.name ??
            service.name,
        price: service.price,
        duration:
            service.duration_minutes,
        description:
            localized?.description ??
            service.description ??
            '',
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
                    data.error || 'Buchungsdaten konnten nicht geladen werden.',
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
                        : 'Buchungsdaten konnten nicht geladen werden.';

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