'use client';

import { Clock } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/data';
import VipPackageCard, {
  COMPACT_CARD_LAYOUT,
} from '@/components/VipPackageCard';
import { VIP_PACKAGE_CARDS } from '@/components/chat/constants';

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'haircut-beard':
    'Das komplette Grooming-Erlebnis: präziser Haarschnitt, detaillierte Bartkonturen, saubere Linien und ein perfektes Finish.',
  'mens-haircut':
    'Ein Haarschnitt, der zu deinem Stil und deinen Wünschen passt – mit präzisen Details und einem sauberen Finish.',
  'beard-trim':
    'Präzises Bartformen und Trimmen für klare Konturen, saubere Kanten und einen gepflegten Look.',
  eyebrows:
    'Saubere und präzise Augenbrauenpflege für eine natürliche, ausgeglichene und klar definierte Form.',
  'facial-cleansing':
    'Erfrischende Gesichtsbehandlung mit Reinigung und Pflege für ein sauberes, glattes und frisches Hautbild.',
  'hot-wax':
    'Warmwachs-Behandlung für das gesamte Gesicht inklusive Ohren und Nase – für ein glattes, sauberes und langanhaltendes Ergebnis.',
  'ears-nose':
    'Schnelle und präzise Entfernung unerwünschter Haare an Ohren und Nase für ein sauberes, gepflegtes Finish.',
};

export default function Services() {
  const orderedServices = [
    ...SERVICES.filter((service) => service.id === 'haircut-beard'),
    ...SERVICES.filter((service) => service.id !== 'haircut-beard'),
  ];

  return (
    <section
      id="services"
      className="pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-36"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-brand-cream">
            VIP FADES
          </p>

          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Unsere Leistungen
          </h2>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light text-brand-textPrimary/85">
            Präzises Handwerk zu transparenten Preisen. Wähle die Behandlung, die zu deinem Stil und deiner Routine passt.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {VIP_PACKAGE_CARDS.map((vipPackage) => (
            <VipPackageCard
              key={vipPackage.id}
              vipPackage={vipPackage}
              size="large"
            />
          ))}
        </div>

        <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {orderedServices.map((service: Service, index: number) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const isPopular = service.id === 'haircut-beard';

  return (
    <div
      className={`reveal reveal-delay-${(index % 3) + 1} group relative flex flex-col justify-between ${COMPACT_CARD_LAYOUT} transition-all duration-300 hover:-translate-y-1 ${isPopular
        ? 'border-brand-cream/50 bg-brand-bgSecondary/70 hover:border-brand-cream hover:shadow-[0_12px_40px_rgba(232,220,200,0.10)]'
        : 'border-brand-border bg-brand-card/30 hover:border-brand-cream/60 hover:shadow-[0_12px_40px_rgba(232,220,200,0.08)]'
        }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-cream px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-bg">
          Am beliebtesten
        </span>
      )}

      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-light text-brand-textPrimary transition-colors duration-300 group-hover:text-brand-cream">
            {service.name}
          </h3>

          <span className="flex-shrink-0 font-serif text-2xl font-light text-brand-textPrimary">
            €{service.price}
          </span>
        </div>

        {service.duration && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-light text-brand-textPrimary/80">
            <Clock className="h-3 w-3 text-brand-textPrimary/80" />
            {service.duration} Min.
          </span>
        )}

        <p className="mt-4 text-sm font-light leading-relaxed text-brand-textPrimary/85">
          {SERVICE_DESCRIPTIONS[service.id] ?? service.description}
        </p>
      </div>
    </div>
  );
}
