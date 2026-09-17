import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Scissors, Sparkles, Users } from 'lucide-react';

import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import { BUSINESS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Über uns | VIP FADES – Barbershop Koblenz',
  description:
    'Lerne VIP FADES BY ANAS kennen: moderner Barbershop in Koblenz für präzise Fades, Herrenhaarschnitte, Bartpflege und VIP-Services. Mit Anas als Inhaber & Head Barber und Abd als Senior Barber.',
  keywords: [
    'Bester Barber Koblenz',
    'Bester Barbershop Koblenz',
    'Barbershop Koblenz',
    'Barber Koblenz',
    'Herrenfriseur Koblenz',
    'Skin Fade Koblenz',
    'Fade Koblenz',
    'Herrenhaarschnitt Koblenz',
    'Bartpflege Koblenz',
    'Barber Termin Koblenz',
  ],
  alternates: { canonical: '/ueber-uns' },
  openGraph: {
    title: 'Über VIP FADES | Barbershop in Koblenz',
    description:
      'Unser Team, unsere Geschichte und unser Anspruch an präzise Fades, moderne Herrenhaarschnitte und Barber-Service in Koblenz.',
    url: '/ueber-uns',
    type: 'website',
    images: ['/images/og-image.png'],
  },
};

const values = [
  {
    icon: Scissors,
    title: 'Bester Herrenhaarschnitt Koblenz',
    text: 'Modern Haircuts, präzise Konturen und ein hochwertiges Finish für deinen individuellen Look.',
  },
  {
    icon: Users,
    title: 'Best Hairstyle Koblenz',
    text: 'Aktuelle Hairstyles, clean Styling und moderne Looks für Männer, die Wert auf Details legen.',
  },
  {
    icon: Sparkles,
    title: 'Best Barber Germany',
    text: 'Premium Barber Quality, moderne Techniken und präzise Ergebnisse auf hohem Niveau.',
  },
];

const services = [
  'Men’s Grooming Koblenz',
  'Gentlemen’s Cut Koblenz',
  'Beard Styling Koblenz',
  'Hair Styling Koblenz',
  'Luxury Grooming Koblenz',
  'Men’s Hair Salon Koblenz',
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Über VIP FADES BY ANAS',
  url: 'https://vip-fades.com/ueber-uns',
  description:
    'VIP FADES BY ANAS ist ein Barbershop in Koblenz für Fades, Herrenhaarschnitte, Bartpflege und VIP-Services.',
  about: {
    '@type': 'HairSalon',
    name: 'VIP FADES BY ANAS',
    url: 'https://vip-fades.com',
    telephone: '+49 176 63782674',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'An der Moselbrücke 9',
      postalCode: '56068',
      addressLocality: 'Koblenz',
      addressCountry: 'DE',
    },
    employee: [
      {
        '@type': 'Person',
        name: 'Anas',
        jobTitle: 'Inhaber & Head Barber',
        image: 'https://vip-fades.com/images/about/anas-head-barber-koblenz.avif',
      },
      {
        '@type': 'Person',
        name: 'Abd',
        jobTitle: 'Senior Barber',
        image: 'https://vip-fades.com/images/about/abd-senior-barber-koblenz.avif',
      },
    ],
  },
};

export default function UeberUnsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg text-brand-textPrimary">
      <PageAtmosphere showRings />
      <div className="relative z-10">
        <Header />

        <section className="mx-auto max-w-7xl px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-40 lg:pb-24">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-cream sm:text-xs">
              Über VIP FADES
            </p>
            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Mehr als ein Haarschnitt.
              <span className="mt-2 block text-brand-cream">Ein Barber-Erlebnis in Koblenz.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              VIP FADES BY ANAS steht für präzise Fades, moderne Herrenhaarschnitte,
              saubere Bartpflege und einen Service, bei dem du dich vom ersten Moment an
              wohlfühlen sollst.
            </p>
          </div>
        </section>

        <section className="border-y border-brand-border/70 bg-black/20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                Unsere Geschichte
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
                Mit Leidenschaft aufgebaut.
              </h2>
            </div>
            <div className="space-y-5 text-sm font-light leading-7 text-brand-textSecondary sm:text-base sm:leading-8">
              <p>
                VIP FADES ist dein moderner Barbershop in Koblenz für präzise Fades, Skin Fades,
                Herrenhaarschnitte und Bartpflege.
              </p>
              <p>
                Unser Ziel: hochwertige Barber-Qualität in Koblenz, moderne Styles und saubere
                Ergebnisse bei jedem Termin.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mb-7 max-w-2xl sm:mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
              Unser Team
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
              Die Menschen hinter VIP FADES.
            </h2>
            <p className="mt-5 text-sm font-light leading-7 text-brand-textSecondary sm:text-base">
              Gemeinsam stehen wir für Präzision, moderne Styles, saubere Fades und ein
              Barber-Erlebnis auf hohem Niveau.
            </p>
          </div>

          <div className="mx-auto grid max-w-[620px] gap-5 sm:grid-cols-2 sm:gap-6">
            <article className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[24px] border border-brand-border/80 bg-black/25 sm:max-w-[300px]">
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/images/about/anas-head-barber-koblenz.avif"
                  alt="Anas – Inhaber und Head Barber bei VIP FADES in Koblenz"
                  fill
                  sizes="(max-width: 640px) 280px, 300px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand-cream sm:text-[10px]">
                  Inhaber & Head Barber
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-medium">Anas</h3>
              </div>
            </article>

            <article className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[24px] border border-brand-border/80 bg-black/25 sm:max-w-[300px]">
              <div className="relative aspect-square overflow-hidden bg-[#f1f1f1]">
                <Image
                  src="/images/about/abd-senior-barber-koblenz.avif"
                  alt="Abd – Senior Barber bei VIP FADES in Koblenz"
                  fill
                  sizes="(max-width: 640px) 280px, 300px"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand-cream sm:text-[10px]">
                  Senior Barber
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-medium">Abd</h3>
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-brand-border/70 bg-black/20">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                Warum VIP FADES?
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
                Qualität, die man sieht.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-brand-border/80 bg-brand-bg/70 p-6">
                  <Icon className="h-5 w-5 text-brand-cream" />
                  <h3 className="mt-5 text-base font-semibold">{title}</h3>
                  <p className="mt-3 text-sm font-light leading-6 text-brand-textSecondary">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
              Unsere Services
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
              Dein Style. Unser Handwerk.
            </h2>
            <p className="mt-5 max-w-xl text-sm font-light leading-7 text-brand-textSecondary sm:text-base">
              Professional Grooming, Precision Styling und Premium Men’s Care für einen
              gepflegten, modernen Look.
            </p>
            <Link
              href="/leistungen"
              className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream transition-colors hover:text-brand-textPrimary"
            >
              Alle Leistungen ansehen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service} className="rounded-xl border border-brand-border/70 bg-black/20 px-5 py-4 text-sm text-brand-textSecondary">
                {service}
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-brand-border/70 bg-black/20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                Barber in Koblenz
              </p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
                Bester Barber in Koblenz? Dein Look beginnt bei VIP FADES.
              </h2>
              <p className="mt-6 max-w-3xl text-sm font-light leading-7 text-brand-textSecondary sm:text-base sm:leading-8">
                Du suchst den besten Barber in Koblenz oder einen Barbershop in Koblenz für
                einen sauberen Skin Fade? Bei VIP FADES bekommst du moderne
                Herrenhaarschnitte, präzise Fade-Techniken, Bartpflege und exklusive
                VIP-Services. Wenn du einen Herrenfriseur in Koblenz suchst und Wert auf
                saubere Details, moderne Styles und einen persönlichen Service legst, bist
                du bei uns richtig.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border/80 bg-brand-bg/80 p-6 sm:p-7">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-cream" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream">Besuch uns</p>
                  <p className="mt-3 text-sm font-light leading-6 text-brand-textSecondary">{BUSINESS.address}</p>
                </div>
              </div>
              <Link
                href="/booking"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg transition-colors hover:bg-brand-textPrimary"
              >
                Termin buchen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
            Dein nächster Termin
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">Bereit für deinen nächsten Look?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-7 text-brand-textSecondary sm:text-base">
            Wähle deine Leistung, deinen Barber und buche deinen Termin bei VIP FADES direkt online.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-bg transition-colors hover:bg-brand-textPrimary"
          >
            Jetzt Termin buchen <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <Footer />
        <FloatingChat />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
