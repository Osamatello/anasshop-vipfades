import { Check } from 'lucide-react';

import { BUSINESS } from '@/lib/data';

export type TicketDetails = {
  service?: string;
  duration?: number;
  price?: number;
  barber?: string;
  date?: string;
  time?: string;
  customerName?: string;
  customerPhone?: string;
};

const PLACEHOLDER = '—';

/** The customer's choices, shown live on a creamy gold VIP pass. */
export default function VipTicket({
  details,
  confirmed = false,
  compact = false,
  tilted = false,
}: {
  details: TicketDetails;
  confirmed?: boolean;
  compact?: boolean;
  tilted?: boolean;
}) {
  const padding = compact ? 'px-5' : 'px-7';

  return (
    <div
      className={`relative w-full rounded-3xl bg-gradient-to-br from-[#f5e9cb] via-[#e5d0a0] to-[#c2a56d] text-[#1f1b14] shadow-[0_30px_80px_rgba(229,208,160,0.25)] ${
        tilted ? 'lg:-rotate-2' : ''
      } ${compact ? 'pb-3 pt-4' : 'pb-5 pt-7'}`}
    >
      <div className={padding}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">
            VIP Pass · Koblenz
          </p>

          {confirmed && (
            <span className="flex items-center gap-1 rounded-full bg-[#1f1b14] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f5e9cb]">
              <Check className="h-3 w-3" strokeWidth={3} />
              Bestätigt
            </span>
          )}
        </div>

        <p
          className={`font-serif font-semibold leading-none ${
            compact ? 'mt-2 text-2xl' : 'mt-4 text-[1.9rem]'
          }`}
        >
          {details.service ?? 'Dein Termin'}
        </p>

        <dl
          className={`grid grid-cols-2 gap-x-3 ${
            compact ? 'mt-3 gap-y-2' : 'mt-5 gap-y-4'
          }`}
        >
          <TicketField
            label="Barber"
            value={details.barber}
            compact={compact}
          />
          <TicketField
            label="Dauer"
            value={details.duration ? `${details.duration} Min.` : undefined}
            compact={compact}
          />
          <TicketField label="Tag" value={details.date} compact={compact} />
          <TicketField label="Uhrzeit" value={details.time} compact={compact} />
          <TicketField
            label="Name"
            value={details.customerName}
            compact={compact}
          />
          <TicketField
            label="Handynummer"
            value={details.customerPhone}
            compact={compact}
          />
        </dl>
      </div>

      {/* Tear line */}
      <div
        className={`relative border-t-2 border-dashed border-[#1f1b14]/40 ${
          compact ? 'my-3' : 'my-5'
        }`}
      >
        <span className="absolute -left-3 -top-[13px] h-6 w-6 rounded-full bg-[#090909]" />
        <span className="absolute -right-3 -top-[13px] h-6 w-6 rounded-full bg-[#090909]" />
      </div>

      <div className={`flex items-center justify-between gap-3 ${padding}`}>
        <span className="text-[11px] font-medium leading-4">
          {BUSINESS.address}
        </span>
        <span
          className={`flex-shrink-0 font-serif font-semibold ${
            compact ? 'text-2xl' : 'text-4xl'
          }`}
        >
          {details.price === undefined ? PLACEHOLDER : `€${details.price}`}
        </span>
      </div>
    </div>
  );
}

function TicketField({
  label,
  value,
  compact,
}: {
  label: string;
  value?: string;
  compact: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1f1b14]/80">
        {label}
      </dt>
      <dd
        className={`mt-0.5 break-words font-serif font-bold leading-tight ${
          compact ? 'text-[15px]' : 'text-lg'
        }`}
      >
        {value ?? PLACEHOLDER}
      </dd>
    </div>
  );
}
