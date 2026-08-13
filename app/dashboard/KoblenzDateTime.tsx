'use client';

import {
    useEffect,
    useState,
} from 'react';

const TIME_ZONE =
    'Europe/Berlin';

type DateTimeValue = {
    date: string;
    time: string;
};

const getDateTime = (): DateTimeValue => {
    const now =
        new Date();

    const date =
        new Intl.DateTimeFormat(
            'de-DE',
            {
                timeZone:
                    TIME_ZONE,
                weekday:
                    'short',
                day:
                    '2-digit',
                month:
                    'short',
                year:
                    'numeric',
            },
        ).format(now);

    const time =
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone:
                    TIME_ZONE,
                hour:
                    '2-digit',
                minute:
                    '2-digit',
                hour12:
                    true,
            },
        ).format(now);

    return {
        date,
        time,
    };
};

export default function KoblenzDateTime() {
    const [
        value,
        setValue,
    ] =
        useState<DateTimeValue | null>(
            null,
        );

    useEffect(() => {
        const update =
            () => {
                setValue(
                    getDateTime(),
                );
            };

        update();

        const timer =
            window.setInterval(
                update,
                30000,
            );

        return () => {
            window.clearInterval(
                timer,
            );
        };
    }, []);

    return (
        <div className="min-w-[190px] rounded-2xl border border-white/10 bg-[#0f1013] px-5 py-3 text-right">
            <p className="text-base font-semibold text-white sm:text-lg">
                {value?.date ?? '—'}
            </p>

            <p className="mt-0.5 font-mono text-xl font-semibold tracking-[0.06em] text-[#e7c57c] sm:text-2xl">
                {value?.time ?? '—'}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                Koblenz time
            </p>
        </div>
    );
}