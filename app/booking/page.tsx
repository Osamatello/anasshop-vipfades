import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    MapPin,
    Phone,
    ShieldCheck,
} from 'lucide-react';

import ChatInterface from '@/components/chat/ChatInterface';
import { BUSINESS } from '@/lib/data';

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-[#070707] text-brand-textPrimary">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-brand-textSecondary transition-colors hover:text-brand-cream"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to VIP FADES
                    </Link>

                    <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-brand-cream/80 sm:inline">
                        Online Booking
                    </span>
                </div>

                <section className="mb-8 max-w-3xl sm:mb-10">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-cream">
                        VIP FADES BY ANAS
                    </p>

                    <h1 className="font-serif text-4xl leading-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
                        Book your appointment.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-textSecondary sm:text-base">
                        Your next VIP FADES experience starts here. Choose your service,
                        barber and preferred time in just a few steps.
                    </p>
                </section>

                <section className="mb-8 grid gap-3 sm:grid-cols-3">
                    <TrustItem
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        text="Instant confirmation"
                    />

                    <TrustItem
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        text="Choose your barber"
                    />

                    <TrustItem
                        icon={<ShieldCheck className="h-4 w-4" />}
                        text="Secure online booking"
                    />
                </section>

                <section className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">
                    <aside className="order-2 space-y-4 lg:order-1">
                        <InfoCard
                            icon={<MapPin className="h-5 w-5" />}
                            label="Location"
                        >
                            <p>{BUSINESS.address}</p>
                        </InfoCard>

                        <InfoCard
                            icon={<Phone className="h-5 w-5" />}
                            label="Contact"
                        >
                            <a
                                href={`tel:${BUSINESS.phoneFormatted.replace(/\s+/g, '')}`}
                                className="transition-colors hover:text-brand-cream"
                            >
                                {BUSINESS.phoneFormatted}
                            </a>
                        </InfoCard>

                        <InfoCard
                            icon={<Clock3 className="h-5 w-5" />}
                            label="Booking hours"
                        >
                            <p>{BUSINESS.hours.days}</p>
                            <p>{BUSINESS.hours.time}</p>
                        </InfoCard>

                        <div className="rounded-2xl border border-brand-border bg-[#101010] p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream">
                                Cancellation policy
                            </p>

                            <p className="mt-3 text-sm leading-6 text-brand-textSecondary">
                                Please cancel or reschedule at least 2 hours before your
                                appointment.
                            </p>
                        </div>
                    </aside>

                    <div className="order-1 lg:order-2">
                        <div className="h-[72vh] min-h-[620px] overflow-hidden rounded-3xl shadow-2xl shadow-black/30 sm:h-[760px] lg:h-[780px]">
                            <ChatInterface />
                        </div>
                    </div>
                </section>

                <div className="mt-8 border-t border-brand-border/50 pt-6 text-center text-xs leading-5 text-brand-textSecondary">
                    By booking an appointment, you confirm that the details you provide
                    are correct and that you agree to the cancellation policy.
                </div>
            </div>
        </main>
    );
}

function TrustItem({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-border bg-[#101010] px-4 py-3 text-sm text-brand-textSecondary">
            <span className="text-brand-cream">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function InfoCard({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-brand-border bg-[#101010] p-5">
            <div className="flex items-center gap-3 text-brand-cream">
                {icon}

                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {label}
                </p>
            </div>

            <div className="mt-3 text-sm leading-6 text-brand-textSecondary">
                {children}
            </div>
        </div>
    );
}