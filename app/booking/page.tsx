import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock3,
    LockKeyhole,
    MapPin,
    Phone,
} from 'lucide-react';

import ChatInterface from '@/components/chat/ChatInterface';
import { BUSINESS } from '@/lib/data';

export default function BookingPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070707] text-brand-textPrimary">
            {/* Global moving atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="global-glow-one absolute -left-[20%] top-[5%] h-[850px] w-[850px] rounded-full bg-brand-cream/[0.065] blur-[180px]" />

                <div className="global-glow-two absolute right-[-25%] top-[18%] h-[950px] w-[950px] rounded-full bg-brand-cream/[0.045] blur-[210px]" />

                <div className="global-glow-three absolute bottom-[-35%] left-[35%] h-[800px] w-[800px] rounded-full bg-brand-cream/[0.035] blur-[200px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(232,220,200,0.035),transparent_35%)]" />
            </div>

            <div className="relative z-10 mx-auto min-h-screen w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                {/* Premium top bar */}
                <header className="relative mb-0 grid min-h-[92px] grid-cols-3 items-center border border-brand-border/70 border-b-brand-cream/20 bg-[#080808]/80 px-5 backdrop-blur-xl sm:px-7 lg:px-10">
                    {/* Back */}
                    <div className="flex justify-start">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 text-xs text-brand-textSecondary transition-colors duration-300 hover:text-brand-cream sm:text-sm"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            <span className="hidden sm:inline">
                                Back to VIP FADES
                            </span>
                            <span className="sm:hidden">
                                Back
                            </span>
                        </Link>
                    </div>

                    {/* Center brand */}
                    <Link
                        href="/"
                        className="group relative flex flex-col items-center justify-center"
                        aria-label="VIP FADES home"
                    >
                        <div className="absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cream/[0.06] blur-2xl transition-all duration-500 group-hover:bg-brand-cream/[0.10]" />

                        <div className="relative flex items-center gap-3">
                            <Image
                                src="/images/favicon.png"
                                alt="VIP FADES"
                                width={48}
                                height={48}
                                priority
                                className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
                            />

                            <div className="hidden flex-col sm:flex">
                                <span className="font-serif text-lg font-light leading-none tracking-[0.08em] text-brand-textPrimary">
                                    VIP FADES
                                </span>

                                <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.32em] text-brand-cream/80">
                                    BY ANAS
                                </span>
                            </div>
                        </div>

                        <div className="brand-line absolute -bottom-3 left-1/2 h-px bg-gradient-to-r from-transparent via-brand-cream to-transparent" />
                    </Link>

                    {/* Private booking */}
                    <div className="flex justify-end">
                        <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-cream/75 sm:text-[10px] sm:tracking-[0.28em]">
                            <span className="hidden sm:inline">
                                Private Online Booking
                            </span>

                            <span className="sm:hidden">
                                Booking
                            </span>

                            <LockKeyhole className="h-3.5 w-3.5" />
                        </div>
                    </div>

                    {/* Moving top light */}
                    <div className="top-light pointer-events-none absolute bottom-0 left-0 h-px w-48 bg-gradient-to-r from-transparent via-brand-cream to-transparent" />
                </header>

                {/* Split booking experience */}
                <section className="relative grid min-h-[calc(100vh-150px)] overflow-hidden rounded-b-[28px] border-x border-b border-brand-border/70 bg-[#090909]/95 backdrop-blur-sm lg:grid-cols-[38%_62%]">
                    {/* Large moving gold atmosphere across page */}
                    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                        <div className="gold-wave gold-wave-one absolute left-[-22%] top-[-10%] h-[900px] w-[900px] rounded-[50%] border border-brand-cream/[0.10]" />

                        <div className="gold-wave gold-wave-two absolute left-[5%] top-[5%] h-[760px] w-[760px] rounded-[50%] border border-brand-cream/[0.06]" />

                        <div className="moving-gold-glow absolute left-[-18%] top-[10%] h-[700px] w-[700px] rounded-full bg-brand-cream/[0.08] blur-[175px]" />

                        <div className="moving-gold-glow-secondary absolute right-[-20%] top-[15%] h-[700px] w-[700px] rounded-full bg-brand-cream/[0.035] blur-[190px]" />
                    </div>

                    {/* Left editorial panel */}
                    <aside className="relative z-10 flex flex-col justify-between overflow-hidden border-b border-brand-border/70 bg-[#0a0a0a]/55 p-7 sm:p-9 lg:border-b-0 lg:border-r lg:p-12 xl:p-14">
                        {/* Local gold ribbon */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="ribbon-glow absolute -right-[320px] top-[40px] h-[720px] w-[720px] rounded-[48%] border-[2px] border-brand-cream/[0.08]" />

                            <div className="ribbon-glow-two absolute -right-[260px] top-[100px] h-[620px] w-[620px] rounded-[48%] border border-brand-cream/[0.08]" />

                            <div className="absolute right-[-200px] top-[140px] h-[500px] w-[500px] rounded-full bg-brand-cream/[0.055] blur-[130px]" />
                        </div>

                        {/* Vertical glowing divider */}
                        <div className="divider-glow pointer-events-none absolute bottom-0 right-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-brand-cream/80 to-transparent lg:block" />

                        <div className="relative z-10">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-cream">
                                VIP FADES BY ANAS
                            </p>

                            <div className="mt-10">
                                <h1 className="max-w-md font-serif text-4xl font-light leading-[1.02] tracking-tight text-brand-textPrimary sm:text-5xl xl:text-6xl">
                                    Your chair.
                                    <br />
                                    Your barber.
                                    <br />
                                    <span className="text-brand-cream">
                                        Your time.
                                    </span>
                                </h1>

                                <div className="booking-accent mt-7 h-px w-14 bg-brand-cream" />

                                <p className="mt-7 max-w-md text-sm font-light leading-7 text-brand-textSecondary sm:text-base">
                                    Book your next VIP FADES appointment with your
                                    personal grooming concierge.
                                </p>
                            </div>

                            {/* Visit details */}
                            <div className="mt-12 space-y-4">
                                <InfoRow
                                    icon={<MapPin className="h-4 w-4" />}
                                    label="Location"
                                >
                                    <p>{BUSINESS.address}</p>
                                </InfoRow>

                                <InfoRow
                                    icon={<Clock3 className="h-4 w-4" />}
                                    label="Online Appointments"
                                >
                                    <p className="text-brand-textPrimary">
                                        Monday to Thursday
                                    </p>

                                    <p className="mt-1">
                                        10:00 – 19:00
                                    </p>

                                    <p className="mt-2 text-brand-cream/75">
                                        Walk-ins welcome every day
                                    </p>
                                </InfoRow>

                                <InfoRow
                                    icon={<Phone className="h-4 w-4" />}
                                    label="Contact"
                                >
                                    <a
                                        href={`tel:${BUSINESS.phoneFormatted.replace(/\s+/g, '')}`}
                                        className="transition-colors hover:text-brand-cream"
                                    >
                                        {BUSINESS.phoneFormatted}
                                    </a>
                                </InfoRow>
                            </div>
                        </div>

                        {/* Cancellation */}
                        <div className="relative z-10 mt-10 rounded-2xl border border-brand-cream/15 bg-black/20 px-5 py-5 backdrop-blur-sm">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-brand-cream">
                                Cancellation Policy
                            </p>

                            <p className="mt-3 max-w-sm text-xs font-light leading-6 text-brand-textSecondary">
                                Please cancel or reschedule at least 2 hours before
                                your appointment.
                            </p>
                        </div>
                    </aside>

                    {/* Right concierge */}
                    <div className="relative z-10 flex min-h-[700px] flex-col bg-[#090909]/70 lg:min-h-0">
                        {/* Right moving atmosphere */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="right-glow absolute right-[-300px] top-[50px] h-[700px] w-[700px] rounded-full bg-brand-cream/[0.025] blur-[180px]" />

                            <div className="right-glow-two absolute bottom-[-300px] left-[20%] h-[650px] w-[650px] rounded-full bg-brand-cream/[0.02] blur-[190px]" />
                        </div>

                        {/* Concierge header */}
                        <div className="relative z-10 flex items-center justify-between border-b border-brand-border/60 px-6 py-5 sm:px-8 lg:px-10">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                                    Personal Grooming Concierge
                                </p>

                                <p className="mt-2 text-sm font-light text-brand-textSecondary">
                                    Tell us what you need. We’ll guide the rest.
                                </p>
                            </div>

                            <div className="hidden items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-textSecondary sm:flex">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                                </span>

                                Online
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="relative z-10 flex-1 overflow-hidden">
                            <div className="chat-top-light pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-brand-cream/70 to-transparent" />

                            <div className="h-full min-h-[620px]">
                                <ChatInterface />
                            </div>
                        </div>

                        {/* Bottom reassurance */}
                        <div className="relative z-10 border-t border-brand-border/50 px-6 py-4 text-center text-[9px] font-light uppercase tracking-[0.24em] text-brand-cream/45 sm:px-8">
                            Secure Booking · Instant Confirmation · Choose Your Barber
                        </div>
                    </div>
                </section>

                {/* Legal */}
                <div className="mt-5 text-center text-[10px] font-light leading-5 text-brand-textSecondary/50">
                    By booking an appointment, you confirm that the details you
                    provide are correct and that you agree to the cancellation
                    policy.
                </div>
            </div>

            <style>{`
                @keyframes globalGlowOne {
                    0%,
                    100% {
                        transform: translate3d(-40px, -20px, 0) scale(1);
                    }

                    50% {
                        transform: translate3d(420px, 160px, 0) scale(1.25);
                    }
                }

                @keyframes globalGlowTwo {
                    0%,
                    100% {
                        transform: translate3d(80px, 0, 0) scale(1);
                    }

                    50% {
                        transform: translate3d(-450px, 180px, 0) scale(1.2);
                    }
                }

                @keyframes globalGlowThree {
                    0%,
                    100% {
                        transform: translate3d(0, 40px, 0);
                    }

                    50% {
                        transform: translate3d(180px, -180px, 0);
                    }
                }

                @keyframes goldWaveOne {
                    0%,
                    100% {
                        transform: translate3d(-120px, -40px, 0)
                            rotate(-18deg)
                            scale(1);
                        opacity: 0.25;
                    }

                    50% {
                        transform: translate3d(650px, 100px, 0)
                            rotate(20deg)
                            scale(1.18);
                        opacity: 0.55;
                    }
                }

                @keyframes goldWaveTwo {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0)
                            rotate(15deg);
                        opacity: 0.15;
                    }

                    50% {
                        transform: translate3d(550px, 120px, 0)
                            rotate(-18deg);
                        opacity: 0.35;
                    }
                }

                @keyframes movingGoldGlow {
                    0%,
                    100% {
                        transform: translate3d(-100px, 0, 0) scale(1);
                    }

                    50% {
                        transform: translate3d(850px, 120px, 0) scale(1.25);
                    }
                }

                @keyframes movingGoldGlowSecondary {
                    0%,
                    100% {
                        transform: translate3d(100px, 0, 0);
                    }

                    50% {
                        transform: translate3d(-700px, 160px, 0);
                    }
                }

                @keyframes ribbonMove {
                    0%,
                    100% {
                        transform: translate3d(0, -60px, 0)
                            rotate(-10deg)
                            scale(1);
                    }

                    50% {
                        transform: translate3d(-100px, 80px, 0)
                            rotate(12deg)
                            scale(1.08);
                    }
                }

                @keyframes ribbonMoveTwo {
                    0%,
                    100% {
                        transform: translate3d(20px, 40px, 0)
                            rotate(8deg);
                    }

                    50% {
                        transform: translate3d(-80px, -60px, 0)
                            rotate(-12deg);
                    }
                }

                @keyframes dividerGlow {
                    0% {
                        transform: translateY(-70%);
                        opacity: 0;
                    }

                    20% {
                        opacity: 1;
                    }

                    80% {
                        opacity: 1;
                    }

                    100% {
                        transform: translateY(70%);
                        opacity: 0;
                    }
                }

                @keyframes bookingAccentPulse {
                    0%,
                    100% {
                        width: 3.5rem;
                        opacity: 0.55;
                    }

                    50% {
                        width: 6rem;
                        opacity: 1;
                        box-shadow: 0 0 20px rgba(232, 220, 200, 0.35);
                    }
                }

                @keyframes topLightMove {
                    from {
                        transform: translateX(-250px);
                    }

                    to {
                        transform: translateX(1450px);
                    }
                }

                @keyframes brandLinePulse {
                    0%,
                    100% {
                        width: 70px;
                        opacity: 0.3;
                        transform: translateX(-50%);
                    }

                    50% {
                        width: 130px;
                        opacity: 1;
                        transform: translateX(-50%);
                    }
                }

                @keyframes rightGlow {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }

                    50% {
                        transform: translate3d(-300px, 160px, 0);
                    }
                }

                @keyframes rightGlowTwo {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }

                    50% {
                        transform: translate3d(180px, -180px, 0);
                    }
                }

                @keyframes chatTopLight {
                    0%,
                    100% {
                        opacity: 0.25;
                    }

                    50% {
                        opacity: 0.85;
                    }
                }

                .global-glow-one {
                    animation: globalGlowOne 18s ease-in-out infinite;
                }

                .global-glow-two {
                    animation: globalGlowTwo 22s ease-in-out infinite;
                }

                .global-glow-three {
                    animation: globalGlowThree 24s ease-in-out infinite;
                }

                .gold-wave-one {
                    animation: goldWaveOne 24s ease-in-out infinite;
                }

                .gold-wave-two {
                    animation: goldWaveTwo 28s ease-in-out infinite;
                }

                .moving-gold-glow {
                    animation: movingGoldGlow 20s ease-in-out infinite;
                }

                .moving-gold-glow-secondary {
                    animation: movingGoldGlowSecondary 24s ease-in-out infinite;
                }

                .ribbon-glow {
                    animation: ribbonMove 16s ease-in-out infinite;
                }

                .ribbon-glow-two {
                    animation: ribbonMoveTwo 19s ease-in-out infinite;
                }

                .divider-glow {
                    animation: dividerGlow 7s ease-in-out infinite;
                }

                .booking-accent {
                    animation: bookingAccentPulse 4s ease-in-out infinite;
                }

                .top-light {
                    animation: topLightMove 9s linear infinite;
                }

                .brand-line {
                    animation: brandLinePulse 4s ease-in-out infinite;
                }

                .right-glow {
                    animation: rightGlow 18s ease-in-out infinite;
                }

                .right-glow-two {
                    animation: rightGlowTwo 22s ease-in-out infinite;
                }

                .chat-top-light {
                    animation: chatTopLight 4s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .global-glow-one,
                    .global-glow-two,
                    .global-glow-three,
                    .gold-wave-one,
                    .gold-wave-two,
                    .moving-gold-glow,
                    .moving-gold-glow-secondary,
                    .ribbon-glow,
                    .ribbon-glow-two,
                    .divider-glow,
                    .booking-accent,
                    .top-light,
                    .brand-line,
                    .right-glow,
                    .right-glow-two,
                    .chat-top-light {
                        animation: none;
                    }

                    .booking-accent {
                        width: 3.5rem;
                    }

                    .brand-line {
                        width: 80px;
                        transform: translateX(-50%);
                    }
                }
            `}</style>
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
        <div className="group -mx-3 flex gap-4 rounded-2xl px-3 py-3 transition-all duration-300 hover:bg-brand-cream/[0.035]">
            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/20 bg-brand-cream/[0.04] text-brand-cream transition-all duration-300 group-hover:scale-105 group-hover:border-brand-cream/50 group-hover:bg-brand-cream/[0.10] group-hover:shadow-[0_0_20px_rgba(232,220,200,0.10)]">
                {icon}
            </div>

            <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand-cream/70 transition-colors duration-300 group-hover:text-brand-cream">
                    {label}
                </p>

                <div className="mt-2 text-sm font-light leading-6 text-brand-textSecondary">
                    {children}
                </div>
            </div>
        </div>
    );
}