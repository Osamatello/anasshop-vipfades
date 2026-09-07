'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import type { Service } from '@/lib/data';
import VipPackageCard from '@/components/VipPackageCard';

import type { VipPackage } from './constants';

export type ServicesSelection = {
  serviceIds: string[];
  vipPackageId: string | null;
  vipPackageName: string | null;
};

type ServicesPickerProps = {
  services: Service[];
  /** Bookable VIP packages, from the catalogue (empty => none offered). */
  vipPackages: VipPackage[];
  onContinue: (selection: ServicesSelection) => void;
  onBack: () => void;
};

/**
 * Local frontend milestone: checkbox-style multi service selection with a live
 * summary and two mutually-exclusive VIP packages (VIP KÖNIGSKLASSE and
 * VIP EXKLUSIV).
 *
 * This component only owns the selection state and the summary math. It never
 * advances the booking flow on its own — the customer confirms with "Weiter",
 * and the parent then continues through barber, date, time and confirmation.
 * The server re-resolves every price and duration authoritatively.
 *
 * All customer-facing text here is German only.
 */
export default function ServicesPicker({
  services,
  vipPackages,
  onContinue,
  onBack,
}: ServicesPickerProps) {
  // null = no VIP package selected; otherwise the selected package id.
  const [selectedVipId, setSelectedVipId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activeVipPackage = vipPackages.find(
    (vipPackage) => vipPackage.id === selectedVipId,
  );
  const vipActive = Boolean(activeVipPackage);

  const toggleVipPackage = (id: string) => {
    setSelectedVipId((current) => {
      // Deselecting the active package re-enables individual selection.
      if (current === id) {
        return null;
      }

      // Selecting a VIP package is exclusive: it replaces the other package
      // and clears every individual service.
      setSelectedIds([]);
      return id;
    });
  };

  const toggleService = (id: string) => {
    // Individual services are locked while a VIP package is selected.
    if (vipActive) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const selectedServices = selectedIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is Service => Boolean(service));

  // VIP package price/duration are fixed; individual selections add up.
  const totalPrice = activeVipPackage
    ? activeVipPackage.price
    : selectedServices.reduce((sum, service) => sum + service.price, 0);

  const totalDuration = activeVipPackage
    ? activeVipPackage.durationMinutes
    : selectedServices.reduce(
        (sum, service) => sum + (service.duration ?? 0),
        0,
      );

  const hasSelection = vipActive || selectedIds.length > 0;

  const summaryLabel = activeVipPackage
    ? activeVipPackage.name
    : selectedServices.map((service) => service.name).join(', ');

  const handleContinue = () => {
    if (!hasSelection) {
      return;
    }

    onContinue({
      serviceIds: vipActive ? [] : selectedIds,
      vipPackageId: activeVipPackage?.id ?? null,
      vipPackageName: activeVipPackage?.name ?? null,
    });
  };

  return (
    <div className="border-t border-brand-border/40 bg-[#0e0f11] px-4 pb-3 pt-3">
      <div className="max-h-[264px] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[300px]">
        {/* VIP packages — most premium first, mutually exclusive */}
        {vipPackages.map((vipPackage) => (
          <VipPackageCard
            key={vipPackage.id}
            vipPackage={vipPackage}
            selected={selectedVipId === vipPackage.id}
            onToggle={() => toggleVipPackage(vipPackage.id)}
          />
        ))}

        {/* Individual services */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-textSecondary">
            Einzelleistungen
          </span>

          <span className="h-px flex-1 bg-brand-border/60" />
        </div>

        {services.map((service) => {
          const checked = selectedIds.includes(service.id);

          return (
            <button
              key={service.id}
              type="button"
              role="checkbox"
              aria-checked={checked}
              aria-disabled={vipActive}
              onClick={() => toggleService(service.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                vipActive
                  ? 'cursor-not-allowed border-brand-border/50 opacity-40'
                  : checked
                    ? 'border-brand-cream/50 bg-brand-cream/5'
                    : 'border-brand-border bg-[#1a1b1e] hover:border-brand-cream/40'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                    checked
                      ? 'border-brand-cream bg-brand-cream text-brand-bg'
                      : 'border-brand-textSecondary/50'
                  }`}
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>

                <span className="flex flex-col">
                  <span className="text-sm font-medium text-brand-textPrimary">
                    {service.name}
                  </span>

                  {service.duration ? (
                    <span className="text-[11px] font-light text-brand-textSecondary">
                      {service.duration} Min.
                    </span>
                  ) : null}
                </span>
              </span>

              <span className="flex-shrink-0 text-sm text-brand-textPrimary/85">
                €{service.price}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live summary */}
      <div className="mt-3 rounded-2xl border border-brand-cream/20 bg-[#1a1b1e] p-3.5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-brand-textSecondary">
          Auswahl
        </p>

        <p className="mt-1 text-[13px] font-medium text-brand-textPrimary">
          {hasSelection ? summaryLabel : 'Noch keine Leistung ausgewählt'}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
          <span className="text-xs uppercase tracking-[0.16em] text-brand-textSecondary">
            Gesamt
          </span>

          <span className="flex items-baseline gap-3">
            <span className="text-[11px] font-light text-brand-textSecondary">
              {totalDuration} Min.
            </span>

            <span className="font-serif text-lg text-brand-cream">
              €{totalPrice}
            </span>
          </span>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-brand-border px-4 py-2 text-xs font-medium text-brand-textSecondary transition-colors hover:border-brand-cream/40 hover:text-brand-cream"
        >
          Zurück
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!hasSelection}
          className="flex-1 rounded-full bg-brand-cream px-4 py-2.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
