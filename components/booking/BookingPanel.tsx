'use client';

import { useState } from 'react';

import BookingWizard from './BookingWizard';
import CancelBooking from './CancelBooking';
import VipTicket, { type TicketDetails } from './VipTicket';

type PanelView = 'book' | 'cancel';

const TABS: { view: PanelView; label: string }[] = [
  { view: 'book', label: 'Termin buchen' },
  { view: 'cancel', label: 'Termin stornieren' },
];

export default function BookingPanel({
  initialView = 'book',
  initialBarber,
  initialServiceSlug,
  info,
}: {
  initialView?: PanelView;
  initialBarber?: string;
  initialServiceSlug?: string;
  /** Shop details shown beside the booking steps. */
  info: React.ReactNode;
}) {
  const [view, setView] = useState<PanelView>(initialView);
  const [ticket, setTicket] = useState<TicketDetails | null>({});

  const showTicket = view === 'book' && ticket !== null;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(400px,36%)]">
      {/* Steps */}
      <div className="min-w-0 lg:border-r lg:border-brand-border/60">
        <div className="border-b border-brand-border/60 p-4 sm:px-8">
          <div className="grid grid-cols-2 gap-1 rounded-full border border-brand-border bg-black/30 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.view}
                type="button"
                aria-pressed={view === tab.view}
                onClick={() => setView(tab.view)}
                className={`min-h-11 rounded-full px-3 text-sm font-medium transition-colors ${
                  view === tab.view
                    ? 'bg-[#e5d0a0] text-brand-bg'
                    : 'text-brand-textSecondary hover:text-brand-cream'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stays mounted so switching tabs keeps the customer's selection. */}
        <div className={view === 'book' ? '' : 'hidden'}>
          <BookingWizard
            initialBarber={initialBarber}
            initialServiceSlug={initialServiceSlug}
            onTicketChange={setTicket}
            onCancelBooking={() => setView('cancel')}
          />
        </div>

        {view === 'cancel' && <CancelBooking onBook={() => setView('book')} />}
      </div>

      {/* Pass and shop details */}
      <aside className="border-t border-brand-border/60 bg-[radial-gradient(circle_at_50%_24%,rgba(229,208,160,0.2),transparent_55%)] p-6 sm:p-8 lg:border-t-0 lg:p-10">
        <div className="lg:sticky lg:top-32">
          {showTicket && ticket && (
            <div className="mx-auto mb-10 mt-2 hidden max-w-[380px] lg:block">
              <VipTicket details={ticket} tilted />
            </div>
          )}

          {info}
        </div>
      </aside>
    </div>
  );
}
