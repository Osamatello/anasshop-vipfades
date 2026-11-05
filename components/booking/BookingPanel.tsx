'use client';

import { useState } from 'react';

import BookingWizard from './BookingWizard';
import CancelBooking from './CancelBooking';

type PanelView = 'book' | 'cancel';

const TABS: { view: PanelView; label: string }[] = [
  { view: 'book', label: 'Termin buchen' },
  { view: 'cancel', label: 'Termin stornieren' },
];

export default function BookingPanel({
  initialView = 'book',
  initialBarber,
  initialServiceSlug,
}: {
  initialView?: PanelView;
  initialBarber?: string;
  initialServiceSlug?: string;
}) {
  const [view, setView] = useState<PanelView>(initialView);

  return (
    <>
      <div className="relative z-10 border-b border-brand-border/60 p-4 sm:px-8">
        <div className="grid grid-cols-2 gap-1 rounded-full border border-brand-border bg-black/30 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.view}
              type="button"
              aria-pressed={view === tab.view}
              onClick={() => setView(tab.view)}
              className={`min-h-11 rounded-full px-3 text-sm font-medium transition-colors ${
                view === tab.view
                  ? 'bg-brand-cream text-brand-bg'
                  : 'text-brand-textSecondary hover:text-brand-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <div className="chat-top-light pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-brand-cream/70 to-transparent" />

        {/* Stays mounted so switching tabs keeps the customer's selection. */}
        <div className={view === 'book' ? '' : 'hidden'}>
          <BookingWizard
            initialBarber={initialBarber}
            initialServiceSlug={initialServiceSlug}
            onCancelBooking={() => setView('cancel')}
          />
        </div>

        {view === 'cancel' && <CancelBooking onBook={() => setView('book')} />}
      </div>
    </>
  );
}
