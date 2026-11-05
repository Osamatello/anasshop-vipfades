'use client';

import { Check } from 'lucide-react';

import type { VipPackage } from '@/components/chat/constants';
import {
  selectionTotalDuration,
  selectionTotalPrice,
  servicesSelection,
  vipSelection,
  type BookingSelection,
} from '@/components/chat/selection';
import type { Service } from '@/lib/data';

import VipCard from './VipCard';

const SERVICE_ORDER = [
  'haircut-beard',
  'mens-haircut',
  'premium-haircut-styling',
  'facial-cleansing',
  'hot-wax',
  'ears-nose',
  'beard-trim',
  'eyebrows',
];

const VIP_ORDER = ['vip-koenigsklasse', 'vip-exklusiv'];

/** Black card, shared by the booking cards. Its creamy gold edge only shows on touch or hover. */
export const CREAMY_GOLD_FRAME =
  'border border-transparent bg-[#0c0c0c] [@media(hover:hover)]:hover:[background:linear-gradient(160deg,#16130c,#090806)_padding-box,linear-gradient(145deg,#f5e9cb,#6f5c35_45%,#e5d0a0)_border-box] active:[background:linear-gradient(160deg,#16130c,#090806)_padding-box,linear-gradient(145deg,#f5e9cb,#6f5c35_45%,#e5d0a0)_border-box]';
export const CREAMY_GOLD_FRAME_SELECTED =
  'border border-transparent shadow-[0_14px_40px_rgba(229,208,160,0.22)] [background:linear-gradient(160deg,#2a2415,#100e08)_padding-box,linear-gradient(145deg,#fff4d6,#e5d0a0_50%,#fff4d6)_border-box]';
const CREAMY_GOLD_TEXT =
  'bg-gradient-to-br from-[#fff8e6] to-[#f0dfb8] bg-clip-text text-transparent';

function orderIndex(order: string[], slug?: string) {
  const index = order.indexOf(slug ?? '');
  return index < 0 ? order.length : index;
}

export default function BookingServices({
  services,
  vipPackages,
  selection,
  onChange,
  onContinue,
}: {
  services: Service[];
  vipPackages: VipPackage[];
  selection: BookingSelection | null;
  onChange: (selection: BookingSelection | null) => void;
  onContinue: () => void;
}) {
  const selectedVipSlug =
    selection?.kind === 'vip' ? selection.vipPackage.slug : null;
  const selectedServices = selection?.kind === 'services' ? selection.services : [];

  const orderedServices = [...services].sort(
    (a, b) =>
      orderIndex(SERVICE_ORDER, a.slug) - orderIndex(SERVICE_ORDER, b.slug),
  );
  const orderedPackages = [...vipPackages].sort(
    (a, b) => orderIndex(VIP_ORDER, a.slug) - orderIndex(VIP_ORDER, b.slug),
  );

  const toggleVip = (vipPackage: VipPackage) => {
    onChange(selectedVipSlug === vipPackage.slug ? null : vipSelection(vipPackage));
  };

  // Picking a service replaces a VIP package, so nothing is ever locked.
  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some((item) => item.id === service.id);
    const next = isSelected
      ? selectedServices.filter((item) => item.id !== service.id)
      : [...selectedServices, service];

    onChange(next.length > 0 ? servicesSelection(next) : null);
  };

  return (
    <div className="px-4 pt-4 sm:px-8 lg:pt-6">
      <SectionLabel>VIP-Pakete</SectionLabel>

      <div className="mt-2 grid gap-2.5 lg:mt-3 lg:gap-4 xl:grid-cols-2">
        {orderedPackages.map((vipPackage) => (
          <VipCard
            key={vipPackage.slug}
            vipPackage={vipPackage}
            selected={selectedVipSlug === vipPackage.slug}
            onClick={() => toggleVip(vipPackage)}
          />
        ))}
      </div>

      <div className="mt-5 lg:mt-7">
        <SectionLabel>Einzelleistungen</SectionLabel>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:mt-3 lg:gap-2.5">
        {orderedServices.map((service) => {
          const selected = selectedServices.some(
            (item) => item.id === service.id,
          );

          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleService(service)}
              className={`group relative flex min-h-14 items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-2 lg:min-h-[5.25rem] lg:rounded-2xl lg:px-5 lg:py-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                selected
                  ? CREAMY_GOLD_FRAME_SELECTED
                  : `${CREAMY_GOLD_FRAME} hover:shadow-[0_12px_34px_rgba(229,208,160,0.16)]`
              }`}
            >
              <Shine />

              <span className="relative min-w-0">
                <span className="block font-serif text-[15px] font-semibold leading-tight text-white lg:text-[1.05rem]">
                  {service.name}
                </span>
                {service.duration ? (
                  <span className="mt-0.5 block text-xs font-medium text-[#d9d5cd] lg:mt-1 lg:text-[13px]">
                    {service.duration} Min.
                  </span>
                ) : null}
              </span>

              <span className="relative flex flex-shrink-0 items-center gap-2.5">
                <span
                  className={`pr-0.5 font-serif text-lg font-bold leading-none lg:text-[1.4rem] ${CREAMY_GOLD_TEXT}`}
                >
                  €{service.price}
                </span>
                {selected && <SelectedMark />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stays in view while the customer scrolls through the services. */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-4 border-t border-brand-border/60 bg-[#090909]/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:mt-5 lg:py-4">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selection}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-textPrimary px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-[#f5e9cb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selection
            ? `Weiter · ${selectionTotalDuration(selection)} Min. · €${selectionTotalPrice(selection)}`
            : 'Wähle mindestens eine Leistung'}
        </button>
      </div>
    </div>
  );
}

/** A band of light that crosses the card on hover. */
function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-y-6 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-textSecondary">
      {children}
    </p>
  );
}

function SelectedMark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
        dark ? 'bg-[#1f1b14] text-[#f5e9cb]' : 'bg-[#e5d0a0] text-[#1f1b14]'
      }`}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}
