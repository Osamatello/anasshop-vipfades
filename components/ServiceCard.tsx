import { Clock } from 'lucide-react';
import type { Service } from '@/lib/data';
import { COMPACT_CARD_LAYOUT } from '@/components/VipPackageCard';
import { serviceDescription } from '@/lib/services/presentation';

/** Shared informational card. The badge is absolute and cannot increase height. */
export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const isPopular = service.id === 'haircut-beard';
  return (
    <article className={`reveal reveal-delay-${(index % 3) + 1} service-card-hover group relative flex h-full flex-col justify-between ${COMPACT_CARD_LAYOUT} transition-all duration-300 ${isPopular
      ? 'border-brand-cream/50 bg-brand-bgSecondary/70 hover:border-brand-cream hover:shadow-[0_12px_40px_rgba(232,220,200,0.10)]'
      : 'border-brand-border bg-brand-card/30 hover:border-brand-cream/60 hover:shadow-[0_12px_40px_rgba(232,220,200,0.08)]'}`}>
      {isPopular && <span className="absolute -top-3 left-6 rounded-full bg-brand-cream px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-bg">Am beliebtesten</span>}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-light text-brand-textPrimary transition-colors duration-300 group-hover:text-brand-cream">{service.name}</h3>
          <span className="flex-shrink-0 font-serif text-2xl font-light text-brand-textPrimary">€{service.price}</span>
        </div>
        {service.duration && <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-light text-brand-textPrimary/80"><Clock className="h-3 w-3 text-brand-textPrimary/80" />{service.duration} Min.</span>}
        <p className="mt-4 text-sm font-light leading-relaxed text-brand-textPrimary/85">{serviceDescription(service)}</p>
      </div>
    </article>
  );
}
