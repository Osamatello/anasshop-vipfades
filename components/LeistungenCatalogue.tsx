'use client';

import Link from 'next/link';
import { ArrowUpRight, Clock, Crown, Scissors } from 'lucide-react';
import { SERVICES } from '@/lib/data';
import { VIP_PACKAGE_CARDS } from '@/components/chat/constants';
import { serviceAnchor, serviceDescription } from '@/lib/services/presentation';

const focusClass =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream';

export default function LeistungenCatalogue() {
  const orderedServices = [
    ...SERVICES.filter((service) => service.id === 'haircut-beard'),
    ...SERVICES.filter((service) => service.id !== 'haircut-beard'),
  ];

  return (
    <section id="services" className="pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-brand-cream sm:text-[11px]">
            VIP FADES
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Unsere Leistungen
          </h1>
          <div className="gold-divider mt-4" />
          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-brand-textPrimary/80 sm:text-base">
            Präzises Handwerk zu transparenten Preisen. Wähle die Behandlung, die zu deinem Stil und deiner Routine passt.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:mt-14 md:grid-cols-2 md:gap-6">
          {VIP_PACKAGE_CARDS.map((vipPackage) => {
            const isTopTier = vipPackage.tier === 'koenigsklasse';

            return (
              <Link
                key={vipPackage.id}
                id={vipPackage.slug}
                href={`/booking?service=${encodeURIComponent(vipPackage.slug)}`}
                className={`group relative scroll-mt-28 overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6 lg:p-7 ${focusClass} ${
                  isTopTier
                    ? 'border-brand-cream/55 bg-gradient-to-br from-brand-cream/[0.12] via-brand-card/50 to-transparent shadow-[0_18px_50px_-30px_rgba(232,220,200,0.45)] hover:border-brand-cream/80'
                    : 'border-brand-cream/25 bg-brand-card/45 hover:border-brand-cream/50'
                }`}
                aria-label={`${vipPackage.name} – Termin buchen`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isTopTier && <Crown className="h-4 w-4 flex-none text-brand-cream" />}
                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-cream/85">
                        {vipPackage.badge}
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-[24px] font-light leading-tight text-brand-textPrimary sm:text-[28px]">
                      {vipPackage.name}
                    </h2>
                  </div>

                  <span className="flex-none font-serif text-3xl font-light leading-none text-brand-cream sm:text-4xl">
                    {vipPackage.price} €
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] font-light text-brand-textSecondary sm:text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  {vipPackage.durationMinutes} Min.
                </div>

                <p className="mt-4 text-[12px] font-light leading-relaxed text-brand-textPrimary/78 sm:text-sm">
                  {vipPackage.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-brand-cream/10 pt-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-cream sm:text-xs">
                    Termin buchen
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-brand-cream transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-auto mt-5 grid max-w-6xl auto-rows-fr grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {orderedServices.map((service, index) => {
            const isPopular = service.id === 'haircut-beard';

            return (
              <Link
                key={service.id}
                id={serviceAnchor(service)}
                href={`/booking?service=${encodeURIComponent(service.slug ?? service.id)}`}
                className={`reveal reveal-delay-${(index % 3) + 1} group relative scroll-mt-28 rounded-xl border p-4 transition-all duration-300 sm:p-5 ${focusClass} ${
                  isPopular
                    ? 'border-brand-cream/45 bg-brand-bgSecondary/70 hover:border-brand-cream/75'
                    : 'border-brand-border/80 bg-brand-card/35 hover:border-brand-cream/45'
                }`}
                aria-label={`${service.name} – Termin buchen`}
              >
                {isPopular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-brand-cream px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-bg sm:left-5">
                    Am beliebtesten
                  </span>
                )}

                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-brand-cream/70">
                          <Scissors className="h-3.5 w-3.5" />
                          <span className="text-[8px] font-medium uppercase tracking-[0.18em]">VIP FADES</span>
                        </div>
                        <h3 className="mt-2 font-serif text-[19px] font-light leading-tight text-brand-textPrimary sm:text-xl">
                          {service.name}
                        </h3>
                      </div>

                      <span className="flex-none font-serif text-[24px] font-light leading-none text-brand-cream sm:text-[26px]">
                        {service.price} €
                      </span>
                    </div>

                    {service.duration && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-light text-brand-textSecondary sm:text-[11px]">
                        <Clock className="h-3 w-3" />
                        {service.duration} Min.
                      </div>
                    )}

                    <p className="mt-3 text-[11px] font-light leading-relaxed text-brand-textPrimary/72 sm:text-xs">
                      {serviceDescription(service)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-brand-border/70 pt-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-brand-cream/90 sm:text-[11px]">
                      Termin buchen
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-brand-cream/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
