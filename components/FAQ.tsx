'use client';

import Link from 'next/link';

import { BARBERS, BUSINESS, SERVICES } from '@/lib/data';
import { buildFaqPageStructuredData, serializeJsonLd } from '@/lib/seo/structuredData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const haircutPrice = SERVICES.find((service) => service.id === 'haircut')?.price ?? 20;
const beardPrice = SERVICES.find((service) => service.id === 'beard')?.price ?? 15;
const haircutBeardPrice =
  SERVICES.find((service) => service.id === 'haircut-beard')?.price ?? 35;
const premiumHaircutPrice =
  SERVICES.find((service) => service.id === 'premium-haircut-styling')?.price ?? 28;

const FAQS = [
  {
    question: 'Brauche ich bei VIP FADES in Koblenz einen Termin?',
    answer: (
      <>
        Nein. Walk-ins sind willkommen. Wenn du deine Wunschzeit und deinen Barber sichern
        möchtest, kannst du deinen Termin direkt über unsere{' '}
        <Link
          href="/booking"
          className="text-brand-cream underline-offset-4 transition-colors hover:text-brand-textPrimary hover:underline"
        >
          Online-Buchung
        </Link>{' '}
        reservieren.
      </>
    ),
  },
  {
    question: 'Wie kann ich einen Termin bei VIP FADES buchen?',
    answer: (
      <>
        Du kannst deinen Termin online über unsere{' '}
        <Link
          href="/booking"
          className="text-brand-cream underline-offset-4 transition-colors hover:text-brand-textPrimary hover:underline"
        >
          Buchungsseite
        </Link>{' '}
        vereinbaren. Dort wählst du deinen Service, deinen Barber und einen verfügbaren
        Termin.
      </>
    ),
  },
  {
    question: 'Was kostet ein Haarschnitt bei VIP FADES?',
    answer: (
      <>
        Ein Herrenhaarschnitt kostet aktuell {haircutPrice} €, Bart trimmen {beardPrice} €
        und Haarschnitt + Bart {haircutBeardPrice} €. Der Premium Haarschnitt & Styling
        kostet {premiumHaircutPrice} €. Alle aktuellen Leistungen und Preise findest du auf
        unserer{' '}
        <Link
          href="/leistungen"
          className="text-brand-cream underline-offset-4 transition-colors hover:text-brand-textPrimary hover:underline"
        >
          Leistungsseite
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Welche Leistungen bietet VIP FADES an?',
    answer:
      'VIP FADES bietet Herrenhaarschnitte, präzise Fades, Bartpflege, Premium Haarschnitt & Styling, Gesichtsreinigung, Augenbrauenpflege, Heißwachs sowie Pflege für Ohren und Nase.',
  },
  {
    question: 'Wo befindet sich VIP FADES in Koblenz?',
    answer: 'Du findest VIP FADES BY ANAS in ' + BUSINESS.address + '.',
  },
  {
    question: 'Wie sind die Öffnungszeiten von VIP FADES?',
    answer:
      'Aktuell sind wir ' +
      BUSINESS.hours.days +
      ' von ' +
      BUSINESS.hours.time +
      ' für dich da. ' +
      BUSINESS.hours.walkins +
      '.',
  },
  {
    question: 'Welche Barber arbeiten bei VIP FADES?',
    answer:
      BARBERS[0].name +
      ' ist ' +
      BARBERS[0].title +
      ' mit Fokus auf ' +
      BARBERS[0].specialty +
      '. ' +
      BARBERS[1].name +
      ' ist ' +
      BARBERS[1].title +
      ' und spezialisiert auf ' +
      BARBERS[1].specialty +
      '.',
  },
  {
    question: 'Was ist beim Premium Haarschnitt & Styling enthalten?',
    answer:
      'Der Premium Haarschnitt & Styling umfasst eine persönliche Beratung, Haarwäsche, einen präzisen Haarschnitt und professionelles Styling für ein komplettes Finish.',
  },
  {
    question: 'Wie kurzfristig kann ich meinen Termin stornieren oder verschieben?',
    answer:
      'Bitte storniere oder verschiebe deinen Termin mindestens 2 Stunden vorher. So kann der Termin noch an einen anderen Kunden vergeben werden.',
  },
];

const faqStructuredData = buildFaqPageStructuredData([
  {
    question: 'Brauche ich bei VIP FADES in Koblenz einen Termin?',
    answer:
      'Nein. Walk-ins sind willkommen. Wenn du deine Wunschzeit und deinen Barber sichern möchtest, kannst du deinen Termin direkt über unsere Online-Buchung reservieren.',
  },
  {
    question: 'Wie kann ich einen Termin bei VIP FADES buchen?',
    answer:
      'Du kannst deinen Termin online über unsere Buchungsseite vereinbaren. Dort wählst du deinen Service, deinen Barber und einen verfügbaren Termin.',
  },
  {
    question: 'Was kostet ein Haarschnitt bei VIP FADES?',
    answer:
      'Ein Herrenhaarschnitt kostet aktuell ' +
      haircutPrice +
      ' €, Bart trimmen ' +
      beardPrice +
      ' € und Haarschnitt + Bart ' +
      haircutBeardPrice +
      ' €. Der Premium Haarschnitt & Styling kostet ' +
      premiumHaircutPrice +
      ' €. Alle aktuellen Leistungen und Preise findest du auf unserer Leistungsseite.',
  },
  {
    question: 'Welche Leistungen bietet VIP FADES an?',
    answer:
      'VIP FADES bietet Herrenhaarschnitte, präzise Fades, Bartpflege, Premium Haarschnitt & Styling, Gesichtsreinigung, Augenbrauenpflege, Heißwachs sowie Pflege für Ohren und Nase.',
  },
  {
    question: 'Wo befindet sich VIP FADES in Koblenz?',
    answer: 'Du findest VIP FADES BY ANAS in ' + BUSINESS.address + '.',
  },
  {
    question: 'Wie sind die Öffnungszeiten von VIP FADES?',
    answer:
      'Aktuell sind wir ' +
      BUSINESS.hours.days +
      ' von ' +
      BUSINESS.hours.time +
      ' für dich da. ' +
      BUSINESS.hours.walkins +
      '.',
  },
  {
    question: 'Welche Barber arbeiten bei VIP FADES?',
    answer:
      BARBERS[0].name +
      ' ist ' +
      BARBERS[0].title +
      ' mit Fokus auf ' +
      BARBERS[0].specialty +
      '. ' +
      BARBERS[1].name +
      ' ist ' +
      BARBERS[1].title +
      ' und spezialisiert auf ' +
      BARBERS[1].specialty +
      '.',
  },
  {
    question: 'Was ist beim Premium Haarschnitt & Styling enthalten?',
    answer:
      'Der Premium Haarschnitt & Styling umfasst eine persönliche Beratung, Haarwäsche, einen präzisen Haarschnitt und professionelles Styling für ein komplettes Finish.',
  },
  {
    question: 'Wie kurzfristig kann ich meinen Termin stornieren oder verschieben?',
    answer:
      'Bitte storniere oder verschiebe deinen Termin mindestens 2 Stunden vorher. So kann der Termin noch an einen anderen Kunden vergeben werden.',
  },
]);

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-y border-brand-border/70 bg-black/20 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-brand-cream">
            FAQ
          </p>

          <h2
            id="faq-heading"
            className="mt-3 max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-brand-textPrimary sm:text-5xl"
          >
            Häufige Fragen zu VIP FADES in Koblenz
          </h2>

          <div className="mt-5 h-px w-12 bg-brand-cream" />

          <p className="mt-6 max-w-lg text-base font-light leading-8 text-brand-textPrimary/75 sm:text-lg">
            Hier findest du direkte Antworten zu Terminen, Preisen, Leistungen,
            Öffnungszeiten und deinem Besuch bei VIP FADES.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={'faq-' + (index + 1)}
              className="border-brand-border/70"
            >
              <AccordionTrigger className="py-6 text-left text-base font-medium leading-7 text-brand-textPrimary hover:no-underline hover:text-brand-cream sm:py-7 sm:text-lg lg:text-xl">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="max-w-3xl pb-7 pr-8 text-[15px] font-light leading-8 text-brand-textPrimary/75 sm:pb-8 sm:text-base lg:text-[17px]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqStructuredData) }}
      />
    </section>
  );
}
