import {
    redirect,
} from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';

import {
    BarChart3,
    CalendarDays,
    CalendarRange,
    Clock3,
    Crown,
    LayoutDashboard,
    Phone,
    Scissors,
    UsersRound,
} from 'lucide-react';

import SignOutButton from './SignOutButton';
import KoblenzDateTime from './KoblenzDateTime';

import {
    createAuthServerClient,
} from '@/lib/supabase/auth-server';

import {
    getDashboardBookings,
} from '@/lib/supabase/bookings';

import {
    getKoblenzDate,
} from '@/lib/timezone';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Dashboard | VIP FADES',
};

const ANAS_BARBER_ID =
    '9d36a15c-f26f-4e9f-926f-7c5763c1423b';

const ABD_BARBER_ID =
    'd115a860-db00-4904-a906-5c67478cf6d2';

const WORKING_HOURS = '10:00 - 19:00';
const WORKING_DAYS = 'Mon - Thu';
const ACTIVE_SERVICES = 7;

const formatTime = (value: string) =>
    value.slice(0, 5);

const parseDate = (value: string) => {
    const [year, month, day] =
        value.split('-').map(Number);

    return new Date(
        Date.UTC(
            year,
            month - 1,
            day,
        ),
    );
};

const formatDate = (
    value: string,
    options?: Intl.DateTimeFormatOptions,
) => {
    const date =
        parseDate(value);

    return new Intl.DateTimeFormat(
        'en-GB',
        options ?? {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            timeZone: 'UTC',
        },
    ).format(date);
};

const getGreeting = () => {
    const hour = Number(
        new Intl.DateTimeFormat(
            'en-GB',
            {
                timeZone:
                    'Europe/Berlin',
                hour:
                    '2-digit',
                hour12:
                    false,
            },
        ).format(
            new Date(),
        ),
    );

    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 18) {
        return 'Good afternoon';
    }

    return 'Good evening';
};

const getStartOfWeek = (
    today: string,
) => {
    const date =
        parseDate(today);

    const day =
        date.getUTCDay();

    const diff =
        day === 0
            ? -6
            : 1 - day;

    date.setUTCDate(
        date.getUTCDate() +
        diff,
    );

    return date;
};

const getEndOfWeek = (
    today: string,
) => {
    const start =
        getStartOfWeek(today);

    const end =
        new Date(start);

    end.setUTCDate(
        end.getUTCDate() +
        6,
    );

    return end;
};

const getBarberVisual = (
    barberId: string,
) => {
    if (
        barberId ===
        ANAS_BARBER_ID
    ) {
        return {
            label: 'ANAS',
            badge:
                'border-[#f0d9a7]/50 bg-[#f0d9a7]/20 text-[#f7e7c4]',
            dot:
                'bg-[#f0d9a7]',
            border:
                'border-[#f0d9a7]/55',
            panel:
                'bg-[#f0d9a7]/12',
            edge:
                'border-l-[16px] border-l-[#f0d9a7]',
            bar:
                'bg-[#f0d9a7]',
            iconBg:
                'bg-[#f0d9a7]',
            iconText:
                'text-[#171717]',
        };
    }

    if (
        barberId ===
        ABD_BARBER_ID
    ) {
        return {
            label: 'ABD',
            badge:
                'border-[#d92b33]/60 bg-[#8f141a]/35 text-[#ff9ca1]',
            dot:
                'bg-[#d92b33]',
            border:
                'border-[#d92b33]/60',
            panel:
                'bg-[#3a1114]',
            edge:
                'border-l-[16px] border-l-[#d92b33]',
            bar:
                'bg-[#be2026]',
            iconBg:
                'bg-[#be2026]',
            iconText:
                'text-white',
        };
    }

    return {
        label: 'BARBER',
        badge:
            'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
        dot:
            'bg-zinc-500',
        border:
            'border-zinc-500/40',
        panel:
            'bg-zinc-500/5',
        edge:
            'border-l-[16px] border-l-zinc-500',
        bar:
            'bg-zinc-500',
        iconBg:
            'bg-zinc-600',
        iconText:
            'text-white',
    };
};

export default async function DashboardPage() {
    const supabase =
        await createAuthServerClient();

    const {
        data: {
            user,
        },
    } =
        await supabase.auth.getUser();

    if (!user) {
        redirect(
            '/dashboard/login',
        );
    }

    const today =
        getKoblenzDate();

    const bookings =
        await getDashboardBookings(
            today,
        );

    const todayBookings =
        bookings.filter(
            (booking) =>
                booking.booking_date ===
                today,
        );

    const upcomingBookings =
        bookings.filter(
            (booking) =>
                booking.booking_date >
                today,
        );

    const weekStart =
        getStartOfWeek(today);

    const weekEnd =
        getEndOfWeek(today);

    const thisWeekBookings =
        bookings.filter(
            (booking) => {
                const date =
                    parseDate(
                        booking.booking_date,
                    );

                return (
                    date >= weekStart &&
                    date <= weekEnd
                );
            },
        );

    const uniqueCustomers =
        new Set(
            bookings.map(
                (booking) =>
                    booking.customer_phone,
            ),
        ).size;

    const anasBookings =
        bookings.filter(
            (booking) =>
                booking.barber_id ===
                ANAS_BARBER_ID,
        );

    const abdBookings =
        bookings.filter(
            (booking) =>
                booking.barber_id ===
                ABD_BARBER_ID,
        );

    const weekRevenue =
        thisWeekBookings.reduce(
            (
                total,
                booking,
            ) =>
                total +
                Number(
                    booking.service_price,
                ),
            0,
        );

    return (
        <main className="min-h-screen bg-[#08090b] text-[#f5f4ef]">
            <div className="mx-auto flex min-h-screen max-w-[1800px]">
                <aside className="hidden w-[230px] flex-shrink-0 border-r border-white/10 bg-[#0a0b0d] lg:flex lg:flex-col">
                    <div className="border-b border-white/8 px-6 py-6">
                        <div className="flex flex-col items-center text-center">
                            <Image
                                src="/images/favicon.png"
                                alt="VIP FADES"
                                width={72}
                                height={72}
                                priority
                                className="h-[72px] w-[72px] rounded-full object-cover"
                            />

                            <p className="mt-3 text-lg font-semibold uppercase tracking-[0.18em]">
                                VIP FADES
                            </p>

                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d6a94e]">
                                BY ANAS
                            </p>
                        </div>
                    </div>

                    <nav className="space-y-1.5 px-4 py-6">
                        <SidebarLink
                            href="/dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                            active
                        />

                        <SidebarLink
                            href="/dashboard/calendar"
                            icon={CalendarDays}
                            label="Calendar"
                        />
                    </nav>

                    <div className="mt-auto px-4 pb-5">
                        <div className="border-t border-white/10 pt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a94e]/30 bg-[#d6a94e]/5 font-serif text-sm text-[#d6a94e]">
                                    VF
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">
                                        VIP FADES
                                    </p>

                                    <p className="mt-0.5 truncate text-[10px] text-white/45">
                                        Premium Cuts. Clean Fades.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <SignOutButton />
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="border-b border-white/10 bg-[#08090b]">
                        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
                            <div>
                                <h1 className="text-2xl font-semibold sm:text-3xl">
                                    {getGreeting()}, Team 👋
                                </h1>

                                <p className="mt-1 text-sm text-white/55">
                                    Here&apos;s what&apos;s happening at VIP FADES today.
                                </p>
                            </div>

                            <div className="flex items-center">
                                <KoblenzDateTime />
                            </div>
                        </div>
                    </header>

                    <div className="px-4 py-5 sm:px-6 xl:px-8">
                        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                            <MetricCard
                                label="Today"
                                value={
                                    todayBookings.length
                                }
                                note="Appointments"
                                accent="cream"
                            />

                            <MetricCard
                                label="Upcoming"
                                value={
                                    upcomingBookings.length
                                }
                                note="Upcoming bookings"
                                accent="blue"
                            />

                            <MetricCard
                                label="This Week"
                                value={
                                    thisWeekBookings.length
                                }
                                note="Total bookings"
                                accent="purple"
                            />

                            <MetricCard
                                label="Total Customers"
                                value={
                                    uniqueCustomers
                                }
                                note="Registered"
                                accent="green"
                            />
                        </section>

                        <section className="mt-5 grid gap-5 2xl:grid-cols-[1.65fr_0.92fr]">
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-white/10 bg-[#0f1013]">
                                    <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6a94e]/10 text-[#d6a94e]">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-semibold">
                                                    Today&apos;s Schedule
                                                </h2>

                                                <p className="mt-0.5 text-sm text-white/45">
                                                    {formatDate(
                                                        today,
                                                        {
                                                            weekday:
                                                                'short',
                                                            day:
                                                                '2-digit',
                                                            month:
                                                                'short',
                                                            year:
                                                                'numeric',
                                                            timeZone:
                                                                'UTC',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="p-5">
                                        {todayBookings.length >
                                            0 ? (
                                            <div className="space-y-3">
                                                {todayBookings.map(
                                                    (
                                                        booking
                                                    ) => (
                                                        <ScheduleRow
                                                            key={
                                                                booking.id
                                                            }
                                                            booking={
                                                                booking
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex min-h-[165px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0b0c0f] px-5 text-center">
                                                <CalendarRange className="h-7 w-7 text-white/65" />

                                                <p className="mt-3 text-sm font-semibold">
                                                    No appointments scheduled for today
                                                </p>

                                                <p className="mt-1 text-sm text-white/45">
                                                    Enjoy a free slot and get ahead of your day.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-[#0f1013]">
                                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                Upcoming Bookings
                                            </h2>

                                            <p className="mt-1 text-sm text-white/45">
                                                All confirmed future appointments
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="rounded-xl border border-white/10 px-3.5 py-2 text-sm text-white/75"
                                        >
                                            View all
                                        </button>
                                    </div>

                                    <div className="space-y-3 p-4">
                                        {upcomingBookings.length >
                                            0 ? (
                                            upcomingBookings.map(
                                                (
                                                    booking
                                                ) => (
                                                    <UpcomingRow
                                                        key={
                                                            booking.id
                                                        }
                                                        booking={
                                                            booking
                                                        }
                                                    />
                                                ),
                                            )
                                        ) : (
                                            <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/45">
                                                No upcoming bookings.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0f1013] p-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <FooterMetric
                                        icon={
                                            Clock3
                                        }
                                        label="Working Hours"
                                        value={
                                            WORKING_HOURS
                                        }
                                        note={
                                            WORKING_DAYS
                                        }
                                    />

                                    <FooterMetric
                                        icon={
                                            Scissors
                                        }
                                        label="Services"
                                        value={String(
                                            ACTIVE_SERVICES,
                                        )}
                                        note="Active services"
                                    />

                                    <FooterMetric
                                        icon={
                                            UsersRound
                                        }
                                        label="Customers"
                                        value={String(
                                            uniqueCustomers,
                                        )}
                                        note="Total registered"
                                    />

                                    <FooterMetric
                                        icon={
                                            BarChart3
                                        }
                                        label="Revenue (This Week)"
                                        value={`€${weekRevenue}`}
                                        note={`From ${thisWeekBookings.length} booking${thisWeekBookings.length ===
                                            1
                                            ? ''
                                            : 's'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="rounded-2xl border border-white/10 bg-[#0f1013]">
                                    <div className="border-b border-white/10 px-5 py-4">
                                        <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                                            Barber Load
                                        </p>

                                        <p className="mt-1 text-sm text-white/45">
                                            Today
                                        </p>
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <BarberLoadCard
                                            barberId={
                                                ANAS_BARBER_ID
                                            }
                                            count={
                                                anasBookings.length
                                            }
                                            total={
                                                bookings.length
                                            }
                                        />

                                        <BarberLoadCard
                                            barberId={
                                                ABD_BARBER_ID
                                            }
                                            count={
                                                abdBookings.length
                                            }
                                            total={
                                                bookings.length
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-sm text-white/75"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                View full calendar
                                            </span>

                                            <span>→</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

function SidebarLink({
    href,
    icon: Icon,
    label,
    active = false,
}: {
    href: string;
    icon: typeof LayoutDashboard;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${active
                ? 'border border-white/10 bg-white/[0.055] text-[#e7c57c]'
                : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                }`}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </Link>
    );
}

function MetricCard({
    label,
    value,
    note,
    accent,
}: {
    label: string;
    value: number;
    note: string;
    accent:
    | 'cream'
    | 'blue'
    | 'purple'
    | 'green';
}) {
    const accents = {
        cream:
            'bg-[#f0d18a]',
        blue:
            'bg-[#315e9c]',
        purple:
            'bg-[#9d57c4]',
        green:
            'bg-[#3b8a5a]',
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1013]">
            <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {label}
                </p>

                <p className="mt-2 text-3xl font-semibold">
                    {value}
                </p>

                <p className="mt-1 text-sm text-white/50">
                    {note}
                </p>
            </div>

            <div className="px-5 pb-4">
                <div
                    className={`h-1.5 rounded-full ${accents[accent]}`}
                />
            </div>
        </div>
    );
}

function ScheduleRow({
    booking,
}: {
    booking: Awaited<
        ReturnType<
            typeof getDashboardBookings
        >
    >[number];
}) {
    const visual =
        getBarberVisual(
            booking.barber_id,
        );

    return (
        <article
            className={`rounded-xl border ${visual.border} ${visual.panel} ${visual.edge} p-4`}
        >
            <div className="grid gap-4 sm:grid-cols-[95px_1fr_auto] sm:items-center">
                <div>
                    <p className="text-lg font-semibold">
                        {formatTime(
                            booking.start_time,
                        )}
                    </p>

                    <p className="text-xs text-white/45">
                        {formatTime(
                            booking.end_time,
                        )}
                    </p>
                </div>

                <div>
                    <span
                        className={`inline-flex rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] ${visual.badge}`}
                    >
                        {visual.label}
                    </span>

                    <p className="mt-2 font-semibold">
                        {
                            booking.customer_name
                        }
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                        {
                            booking.service_name
                        }
                    </p>
                </div>

                <p className="text-sm text-white/70">
                    €
                    {
                        booking.service_price
                    }
                </p>
            </div>
        </article>
    );
}

function UpcomingRow({
    booking,
}: {
    booking: Awaited<
        ReturnType<
            typeof getDashboardBookings
        >
    >[number];
}) {
    const visual =
        getBarberVisual(
            booking.barber_id,
        );

    return (
        <article className={`rounded-xl border ${visual.border} ${visual.panel} ${visual.edge} p-4`}>
            <div className="grid gap-4 sm:grid-cols-[64px_90px_1fr_auto] sm:items-center">
                <div className="rounded-lg border border-white/10 bg-[#0d0e11] px-2 py-2 text-center">
                    <p className="text-[10px] uppercase text-white/45">
                        {formatDate(
                            booking.booking_date,
                            {
                                weekday:
                                    'short',
                                timeZone:
                                    'UTC',
                            },
                        )}
                    </p>

                    <p className="text-xl font-semibold">
                        {formatDate(
                            booking.booking_date,
                            {
                                day:
                                    '2-digit',
                                timeZone:
                                    'UTC',
                            },
                        )}
                    </p>

                    <p className="text-[10px] uppercase text-white/45">
                        {formatDate(
                            booking.booking_date,
                            {
                                month:
                                    'short',
                                timeZone:
                                    'UTC',
                            },
                        )}
                    </p>
                </div>

                <div className="text-sm text-white/70">
                    <p>
                        {formatTime(
                            booking.start_time,
                        )}
                    </p>

                    <p className="mt-1 text-white/35">
                        —
                    </p>

                    <p className="mt-1">
                        {formatTime(
                            booking.end_time,
                        )}
                    </p>
                </div>

                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] ${visual.badge}`}
                        >
                            {visual.label}
                        </span>

                        <span className="rounded-md bg-[#d8b76d] px-2 py-0.5 text-[11px] font-semibold text-[#151515]">
                            €
                            {
                                booking.service_price
                            }
                        </span>
                    </div>

                    <p className="mt-2 text-base font-semibold">
                        {
                            booking.customer_name
                        }
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                        {
                            booking.service_name
                        }
                    </p>

                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/60">
                        <Phone className="h-3.5 w-3.5" />
                        {
                            booking.customer_phone
                        }
                    </p>
                </div>

                <div className="sm:text-right">
                    <span className="rounded-md bg-[#163f24] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#82dc9a]">
                        Confirmed
                    </span>
                </div>
            </div>
        </article>
    );
}

function BarberLoadCard({
    barberId,
    count,
    total,
}: {
    barberId: string;
    count: number;
    total: number;
}) {
    const visual =
        getBarberVisual(
            barberId,
        );

    const percent =
        total > 0
            ? Math.round(
                (count /
                    total) *
                100,
            )
            : 0;

    return (
        <div
            className={`rounded-xl border ${visual.border} ${visual.panel} p-4`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${visual.iconBg} ${visual.iconText}`}
                >
                    {barberId ===
                        ANAS_BARBER_ID ? (
                        <Crown className="h-5 w-5" />
                    ) : (
                        <Scissors className="h-5 w-5" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold">
                            {visual.label}
                        </p>

                        <p className="text-sm text-white/75">
                            {count}{' '}
                            {count === 1
                                ? 'booking'
                                : 'bookings'}
                        </p>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#090a0b]">
                        <div
                            className={`h-full rounded-full ${visual.bar}`}
                            style={{
                                width:
                                    `${percent}%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-xs text-white/45">
                        {percent}% of active bookings
                    </p>
                </div>
            </div>
        </div>
    );
}

function FooterMetric({
    icon: Icon,
    label,
    value,
    note,
}: {
    icon: typeof Clock3;
    label: string;
    value: string;
    note: string;
}) {
    return (
        <div className="flex items-start gap-3 xl:border-r xl:border-white/10 xl:last:border-r-0">
            <Icon className="mt-0.5 h-5 w-5 text-white/70" />

            <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                    {label}
                </p>

                <p className="mt-1 text-sm font-semibold">
                    {value}
                </p>

                <p className="mt-1 text-xs text-white/40">
                    {note}
                </p>
            </div>
        </div>
    );
}