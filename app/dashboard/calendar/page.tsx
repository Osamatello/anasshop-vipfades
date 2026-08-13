import Image from 'next/image';
import Link from 'next/link';

import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
} from 'lucide-react';

import {
    redirect,
} from 'next/navigation';

import SignOutButton from '../SignOutButton';
import KoblenzDateTime from '../KoblenzDateTime';

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
    title: 'Kalender | VIP FADES',
};

const ANAS_BARBER_ID =
    '9d36a15c-f26f-4e9f-926f-7c5763c1423b';

const ABD_BARBER_ID =
    'd115a860-db00-4904-a906-5c67478cf6d2';

const WEEKDAYS = [
    'Mo',
    'Di',
    'Mi',
    'Do',
    'Fr',
    'Sa',
    'So',
];

const pad = (value: number) =>
    String(value).padStart(2, '0');

const toDateString = (
    year: number,
    month: number,
    day: number,
) =>
    `${year}-${pad(month + 1)}-${pad(day)}`;

const formatTime = (value: string) =>
    value.slice(0, 5);

const getBarberStyle = (
    barberId: string,
) => {
    if (barberId === ANAS_BARBER_ID) {
        return {
            label: 'Anas',
            event:
                'border-[#f0d9a7]/35 bg-[#f0d9a7]/12 text-[#f4dfb5]',
            dot: 'bg-[#f0d9a7]',
        };
    }

    if (barberId === ABD_BARBER_ID) {
        return {
            label: 'Abd',
            event:
                'border-[#be2026]/55 bg-[#351014] text-[#ff777c]',
            dot: 'bg-[#be2026]',
        };
    }

    return {
        label: 'Barber',
        event:
            'border-white/10 bg-white/[0.04] text-white/70',
        dot: 'bg-white/50',
    };
};

const parseMonth = (
    value: string | undefined,
    fallback: string,
) => {
    const fallbackYear =
        Number(fallback.slice(0, 4));
    const fallbackMonth =
        Number(fallback.slice(5, 7));

    if (!value || !/^\d{4}-\d{2}$/.test(value)) {
        return {
            year: fallbackYear,
            month: fallbackMonth - 1,
        };
    }

    const [year, month] =
        value.split('-').map(Number);

    if (month < 1 || month > 12) {
        return {
            year: fallbackYear,
            month: fallbackMonth - 1,
        };
    }

    return {
        year,
        month: month - 1,
    };
};

const getMonthHref = (
    year: number,
    month: number,
    offset: number,
) => {
    const date =
        new Date(Date.UTC(year, month + offset, 1));

    return `/dashboard/calendar?month=${date.getUTCFullYear()}-${pad(
        date.getUTCMonth() + 1,
    )}`;
};

export default async function CalendarPage({
    searchParams,
}: {
    searchParams?: Promise<{
        month?: string;
    }>;
}) {
    const supabase =
        await createAuthServerClient();

    const {
        data: { user },
    } =
        await supabase.auth.getUser();

    if (!user) {
        redirect('/dashboard/login');
    }

    const today =
        getKoblenzDate();

    const bookings =
        await getDashboardBookings(today);

    const resolvedSearchParams =
        await searchParams;

    const {
        year,
        month,
    } =
        parseMonth(
            resolvedSearchParams?.month,
            today,
        );

    const firstDay =
        new Date(Date.UTC(year, month, 1));

    const daysInMonth =
        new Date(
            Date.UTC(year, month + 1, 0),
        ).getUTCDate();

    // Convert JS Sunday-first day index into Monday-first.
    const leadingEmptyDays =
        (firstDay.getUTCDay() + 6) % 7;

    const totalCells =
        Math.ceil(
            (leadingEmptyDays + daysInMonth) / 7,
        ) * 7;

    const monthLabel =
        new Intl.DateTimeFormat(
            'de-DE',
            {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
            },
        ).format(firstDay);

    const bookingsByDate =
        bookings.reduce<
            Record<string, typeof bookings>
        >(
            (result, booking) => {
                if (!result[booking.booking_date]) {
                    result[booking.booking_date] = [];
                }

                result[booking.booking_date].push(
                    booking,
                );

                return result;
            },
            {},
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
                        />

                        <SidebarLink
                            href="/dashboard/calendar"
                            icon={CalendarDays}
                            label="Kalender"
                            active
                        />
                    </nav>

                    <div className="mt-auto px-4 pb-5">
                        <div className="border-t border-white/10 pt-5">
                            <SignOutButton />
                        </div>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="border-b border-white/10">
                        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e7c57c]">
                                    VIP FADES
                                </p>

                                <h1 className="mt-1 text-3xl font-semibold">
                                    Buchungskalender
                                </h1>

                                <p className="mt-1 text-sm text-white/50">
                                    All active appointments for Anas and Abd.
                                </p>
                            </div>

                            <KoblenzDateTime />
                        </div>
                    </header>

                    <div className="px-4 py-6 sm:px-6 xl:px-8">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {monthLabel}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-3">
                                    <Legend
                                        label="Anas"
                                        className="bg-[#f0d9a7]"
                                    />

                                    <Legend
                                        label="Abd"
                                        className="bg-[#be2026]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={getMonthHref(
                                        year,
                                        month,
                                        -1,
                                    )}
                                    aria-label="Previous month"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0f1013] text-white/70 transition hover:border-white/20 hover:text-white"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>

                                <Link
                                    href="/dashboard/calendar"
                                    className="rounded-xl border border-[#d6a94e]/30 bg-[#d6a94e]/8 px-4 py-2.5 text-sm font-semibold text-[#e7c57c]"
                                >
                                    Today
                                </Link>

                                <Link
                                    href={getMonthHref(
                                        year,
                                        month,
                                        1,
                                    )}
                                    aria-label="Next month"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0f1013] text-white/70 transition hover:border-white/20 hover:text-white"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1013]">
                            <div className="grid grid-cols-7 border-b border-white/10 bg-[#0b0c0f]">
                                {WEEKDAYS.map(
                                    (day) => (
                                        <div
                                            key={day}
                                            className="border-r border-white/10 px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 last:border-r-0 sm:text-xs"
                                        >
                                            {day}
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="grid grid-cols-7">
                                {Array.from(
                                    { length: totalCells },
                                    (_, index) => {
                                        const dayNumber =
                                            index -
                                            leadingEmptyDays +
                                            1;

                                        const isCurrentMonth =
                                            dayNumber >= 1 &&
                                            dayNumber <= daysInMonth;

                                        if (!isCurrentMonth) {
                                            return (
                                                <div
                                                    key={`empty-${index}`}
                                                    className="min-h-[105px] border-b border-r border-white/[0.07] bg-[#0a0b0d]/70 sm:min-h-[145px] xl:min-h-[165px]"
                                                />
                                            );
                                        }

                                        const date =
                                            toDateString(
                                                year,
                                                month,
                                                dayNumber,
                                            );

                                        const dayBookings =
                                            bookingsByDate[date] ?? [];

                                        const isToday =
                                            date === today;

                                        return (
                                            <div
                                                key={date}
                                                className={`min-h-[105px] border-b border-r border-white/[0.07] p-1.5 sm:min-h-[145px] sm:p-2 xl:min-h-[165px] ${isToday
                                                    ? 'bg-[#d6a94e]/[0.045]'
                                                    : 'bg-[#0f1013]'
                                                    }`}
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span
                                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${isToday
                                                            ? 'bg-[#e7c57c] text-[#111214]'
                                                            : 'text-white/75'
                                                            }`}
                                                    >
                                                        {dayNumber}
                                                    </span>

                                                    {dayBookings.length > 0 && (
                                                        <span className="hidden text-[10px] text-white/35 sm:inline">
                                                            {dayBookings.length}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    {dayBookings
                                                        .slice(0, 3)
                                                        .map(
                                                            (booking) => {
                                                                const style =
                                                                    getBarberStyle(
                                                                        booking.barber_id,
                                                                    );

                                                                return (
                                                                    <div
                                                                        key={booking.id}
                                                                        title={`${formatTime(
                                                                            booking.start_time,
                                                                        )} ${booking.customer_name} — ${booking.service_name}`}
                                                                        className={`overflow-hidden rounded-md border px-1.5 py-1 text-[9px] leading-tight sm:px-2 sm:text-[10px] ${style.event}`}
                                                                    >
                                                                        <div className="flex items-center gap-1">
                                                                            <span
                                                                                className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${style.dot}`}
                                                                            />
                                                                            <span className="font-semibold">
                                                                                {formatTime(
                                                                                    booking.start_time,
                                                                                )}
                                                                            </span>
                                                                        </div>

                                                                        <p className="mt-0.5 hidden truncate sm:block">
                                                                            {booking.customer_name}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            },
                                                        )}

                                                    {dayBookings.length > 3 && (
                                                        <p className="px-1 text-[9px] font-medium text-white/40 sm:text-[10px]">
                                                            +{dayBookings.length - 3} weitere
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
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

function Legend({
    label,
    className,
}: {
    label: string;
    className: string;
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1013] px-3 py-2 text-xs text-white/65">
            <span
                className={`h-2.5 w-2.5 rounded-full ${className}`}
            />
            {label}
        </span>
    );
}