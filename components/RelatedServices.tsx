import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import WhatsAppIcon from '@/components/WhatsAppIcon';
import { BUSINESS } from '@/lib/data';
import { articleServices, serviceHref } from '@/lib/seo/serviceLinks';

/** The services an article is about, plus booking and WhatsApp. */
export default function RelatedServices({ slug }: { slug: string }) {
  const services = articleServices(slug);
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="passende-leistungen">
      <h2 id="passende-leistungen" className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
        Passende Leistungen
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              href={serviceHref(service)}
              className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-brand-border/80 bg-black/20 p-5 transition-colors hover:border-brand-cream/50"
            >
              <span>
                <span className="block text-sm font-semibold text-brand-textPrimary transition-colors group-hover:text-brand-cream">
                  {service.name}
                </span>
                <span className="mt-1 block text-sm text-brand-cream">{service.price} €</span>
              </span>
              <ArrowUpRight className="h-4 w-4 flex-none text-brand-cream" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/booking" className="font-medium text-brand-cream underline-offset-4 hover:underline">
          Termin buchen
        </Link>
        <a
          href={BUSINESS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-brand-cream underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </section>
  );
}
