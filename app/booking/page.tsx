import type { Metadata } from 'next';
import {
    Clock3,
    MapPin,
    Phone,
} from 'lucide-react';

import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import BookingPanel from '@/components/booking/BookingPanel';
import { BUSINESS } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Termin buchen | VIP FADES BY ANAS – Barbershop Koblenz',
    description:
        'Buche deinen Termin bei VIP FADES BY ANAS in Koblenz online. Wähle deinen Barber und deinen Service für Haarschnitt, Fade oder Bartpflege.',
    alternates: { canonical: '/booking' },
    openGraph: {
        title: 'Termin buchen | VIP FADES BY ANAS',
        description:
            'Buche deinen Barber-Termin bei VIP FADES BY ANAS in Koblenz online.',
        url: '/booking',
        type: 'website',
        images: ['/images/og-image.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Termin buchen | VIP FADES BY ANAS',
        description:
            'Buche deinen Barber-Termin bei VIP FADES BY ANAS in Koblenz online.',
        images: ['/images/og-image.jpg'],
    },
};

export default async function BookingPage({
    searchParams,
}: {
    searchParams?: Promise<{
        barber?: string;
        service?: string;
        stornieren?: string;
    }>;
}) {
    const params =
        await searchParams;

    const initialBarber =
        typeof params?.barber === 'string'
            ? params.barber.trim().toLowerCase()
            : undefined;

    return (
        <main className="relative min-h-screen overflow-clip bg-[#070707] text-brand-textPrimary">
            <Header />

            <PageAtmosphere />

            <div className="booking-font relative z-10 mx-auto min-h-screen w-full max-w-[1600px] px-4 pb-5 pt-28 sm:px-6 sm:pb-6 sm:pt-32 lg:px-8 lg:pb-8">
                <h1 className="sr-only">
                    Termin buchen bei VIP FADES BY ANAS in Koblenz
                </h1>

                <section className="overflow-clip rounded-[28px] border border-brand-border/70 bg-[#090909]/95">
                    <BookingPanel
                        key={`${initialBarber ?? ""}:${typeof params?.service === "string" ? params.service : ""}:${params?.stornieren ?? ""}`}
                        initialView={params?.stornieren ? "cancel" : "book"}
                        initialBarber={initialBarber}
                        initialServiceSlug={typeof params?.service === "string" ? params.service : undefined}
                        info={
                            <div className="space-y-2">
                                <InfoRow
                                    icon={<MapPin className="h-4 w-4" />}
                                    label="Standort"
                                >
                                    <p>{BUSINESS.address}</p>
                                </InfoRow>

                                <InfoRow
                                    icon={<Clock3 className="h-4 w-4" />}
                                    label="Online-Termine"
                                >
                                    <p className="text-brand-textPrimary">
                                        Nur Montag bis Donnerstag, 10:00 – 19:00
                                    </p>

                                    <p className="mt-1 text-brand-cream/75">
                                        Täglich geöffnet, 10:00 – 19:00 · Walk-ins willkommen
                                    </p>
                                </InfoRow>

                                <InfoRow
                                    icon={<Phone className="h-4 w-4" />}
                                    label="Kontakt"
                                >
                                    <a
                                        href={`tel:${BUSINESS.phoneFormatted.replace(/\s+/g, '')}`}
                                        className="transition-colors hover:text-brand-cream"
                                    >
                                        {BUSINESS.phoneFormatted}
                                    </a>
                                </InfoRow>

                                <p className="pt-3 text-xs font-light leading-6 text-brand-textSecondary">
                                    Bitte storniere oder verschiebe deinen Termin mindestens
                                    2 Stunden vorher.
                                </p>
                            </div>
                        }
                    />
                </section>

                {/* Legal */}
                <div className="mt-5 text-center text-[10px] font-light leading-5 text-brand-textSecondary/50">
                    Mit deiner Buchung bestätigst du, dass deine Angaben korrekt sind und du
                    den Stornierungsbedingungen zustimmst.
                </div>
            </div>
        </main>
    );
}

function InfoRow({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-4 py-2">
            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/20 bg-brand-cream/[0.04] text-brand-cream">
                {icon}
            </div>

            <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand-cream/70">
                    {label}
                </p>

                <div className="mt-1 text-sm font-light leading-6 text-brand-textSecondary">
                    {children}
                </div>
            </div>
        </div>
    );
}
