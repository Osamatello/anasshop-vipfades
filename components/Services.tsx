'use client';

import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import VipPackageCard from '@/components/VipPackageCard';
import { VIP_PACKAGE_CARDS } from '@/components/chat/constants';
import ServiceCard from '@/components/ServiceCard';
import { serviceAnchor } from '@/lib/services/presentation';

const FOCUS = 'block h-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream';

export default function Services({ fullCatalogue = false }: { fullCatalogue?: boolean }) {
  const Heading = fullCatalogue ? 'h1' : 'h2';
  const orderedServices = [
    ...SERVICES.filter((service) => service.id === 'haircut-beard'),
    ...SERVICES.filter((service) => service.id !== 'haircut-beard'),
  ];
  const visibleServices = fullCatalogue ? orderedServices : orderedServices.filter((service) => service.id === 'haircut-beard');

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

          <Heading className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Unsere Leistungen
          </Heading>

          <div className="gold-divider mt-4" />

          <p className="mx-auto mt-6 max-w-lg text-base font-light text-brand-textPrimary/85">
            Präzises Handwerk zu transparenten Preisen. Wähle die Behandlung, die zu deinem Stil und deiner Routine passt.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {VIP_PACKAGE_CARDS.map((vipPackage) => (
            fullCatalogue ? <div key={vipPackage.id} id={vipPackage.slug} className="h-full scroll-mt-28">
            <VipPackageCard
              vipPackage={vipPackage}
              size="large"
            />
            </div> : <Link key={vipPackage.id} href={`/leistungen#${vipPackage.slug}`} className={FOCUS} aria-label={`${vipPackage.name} – Leistungen ansehen`}>
              <VipPackageCard vipPackage={vipPackage} size="large" />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleServices.map((service, index) => (
            fullCatalogue ? <div key={service.id} id={serviceAnchor(service)} className="h-full scroll-mt-28">
              <ServiceCard service={service} index={index} />
            </div> : <Link key={service.id} href={`/leistungen#${serviceAnchor(service)}`} className={`${FOCUS} sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:col-start-2 lg:mx-0 lg:w-full`} aria-label={`${service.name} – Leistungen ansehen`}>
              <ServiceCard service={service} index={index} />
            </Link>
          ))}
        </div>
        {!fullCatalogue && <div className="mt-10 flex justify-center">
          <Link href="/leistungen" className="inline-flex items-center justify-center rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream">Alle Leistungen ansehen</Link>
        </div>}
      </div>
    </section>
  );
}
