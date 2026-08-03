'use client';

import { Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import { SectionHeading } from './SectionHeading';

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-ink-900 px-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Visit Us"
          title="Get in Touch"
          description="Find us in the heart of Koblenz. Walk in or book ahead."
          light
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={MapPin}
            label="Address"
            lines={[BUSINESS.address]}
            href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}`}
          />
          <ContactCard
            icon={Phone}
            label="Phone"
            lines={[BUSINESS.phoneFormatted]}
            href={`tel:${BUSINESS.phone}`}
          />
          <ContactCard
            icon={Clock}
            label="Hours"
            lines={[BUSINESS.hours.days, BUSINESS.hours.time, BUSINESS.hours.walkins]}
          />
          <ContactCard
            icon={Instagram}
            label="Instagram"
            lines={[BUSINESS.instagram]}
            href={BUSINESS.instagramUrl}
          />
        </div>

        <div className="reveal reveal-delay-4 mt-12 overflow-hidden rounded-3xl border border-white/5">
          <iframe
            title="VIP FADES location map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              BUSINESS.address
            )}&output=embed`}
            className="h-[300px] w-full grayscale contrast-110 sm:h-[380px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  lines,
  href,
}: {
  icon: React.ElementType;
  label: string;
  lines: string[];
  href?: string;
}) {
  const inner = (
    <div className="reveal reveal-delay-2 group flex h-full flex-col items-start rounded-3xl border border-white/5 bg-ink-950 p-6 transition-all hover:border-gold/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-gold">
        {label}
      </p>
      <div className="mt-2 space-y-0.5">
        {lines.map((l, i) => (
          <p
            key={i}
            className={`text-sm font-light text-warm/85 ${
              i === 0 ? 'font-medium text-warm' : ''
            }`}
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
