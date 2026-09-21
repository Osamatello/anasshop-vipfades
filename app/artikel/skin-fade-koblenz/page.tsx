import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';

import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import {
  SITE_URL,
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  buildFaqPageStructuredData,
  serializeJsonLd,
} from '@/lib/seo/structuredData';

const ARTICLE_URL = `${SITE_URL}/artikel/skin-fade-koblenz`;
const PUBLISHED_AT = '2026-09-18';
const UPDATED_AT = '2026-09-18';

const faqItems = [
  {
    question: 'Was ist ein Skin Fade?',
    answer:
      'Ein Skin Fade ist ein Herrenhaarschnitt, bei dem die Seiten und der Nacken bis auf die Haut oder nahezu auf Hautlänge gekürzt und anschließend stufenlos in längeres Haar überblendet werden.',
  },
  {
    question: 'Wie lange sieht ein Skin Fade frisch aus?',
    answer:
      'Das hängt vom Haarwachstum und davon ab, wie scharf du die Konturen tragen möchtest. Viele Kunden lassen einen Fade regelmäßig nacharbeiten, sobald der Übergang sichtbar herauswächst.',
  },
  {
    question: 'Was ist der Unterschied zwischen Skin Fade und Taper Fade?',
    answer:
      'Beim Skin Fade wird ein größerer Bereich der Seiten bis auf sehr kurze beziehungsweise Hautlänge ausgearbeitet. Ein Taper Fade konzentriert den Übergang stärker auf Schläfen und Nacken und wirkt meist zurückhaltender.',
  },
  {
    question: 'Passt ein Skin Fade zu jedem Haartyp?',
    answer:
      'Ein Skin Fade lässt sich mit vielen Haartypen kombinieren. Entscheidend sind Haarstruktur, Kopfform, gewünschte Länge oben und der Stil, den du im Alltag tragen möchtest.',
  },
  {
    question: 'Kann ich einen Skin Fade bei VIP FADES in Koblenz buchen?',
    answer:
      'Ja. Bei VIP FADES BY ANAS in Koblenz kannst du deinen Barber-Termin online buchen und beim Termin besprechen, welche Fade-Höhe und welcher Übergang zu deinem gewünschten Look passen.',
  },
];

const articleStructuredData = buildArticleStructuredData({
  title: 'Skin Fade in Koblenz: Was ist das und für wen eignet er sich?',
  description:
    'Klare Erklärung zum Skin Fade: Aufbau, Unterschiede zu anderen Fades, Pflege und Tipps für deinen Barber-Termin in Koblenz.',
  url: ARTICLE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
});

const breadcrumbStructuredData = buildBreadcrumbStructuredData([
  { name: 'Startseite', url: SITE_URL },
  { name: 'Artikel', url: `${SITE_URL}/artikel` },
  {
    name: 'Skin Fade in Koblenz',
    url: ARTICLE_URL,
  },
]);

const faqStructuredData = buildFaqPageStructuredData(faqItems, ARTICLE_URL);

export const metadata: Metadata = {
  title: 'Skin Fade Koblenz: Erklärung, Ablauf & Tipps | VIP FADES',
  description:
    'Was ist ein Skin Fade? Erfahre Unterschiede, Ablauf, Pflege und für wen der Look geeignet ist. Barber-Ratgeber von VIP FADES BY ANAS in Koblenz.',
  alternates: { canonical: '/artikel/skin-fade-koblenz' },
  openGraph: {
    title: 'Skin Fade in Koblenz: Was ist das und für wen eignet er sich?',
    description:
      'Alles Wichtige zum Skin Fade: Definition, Varianten, Pflege und Tipps für deinen nächsten Barber-Termin in Koblenz.',
    url: '/artikel/skin-fade-koblenz',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: UPDATED_AT,
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skin Fade in Koblenz | VIP FADES BY ANAS',
    description:
      'Definition, Unterschiede, Pflege und Tipps rund um den Skin Fade.',
    images: ['/images/og-image.png'],
  },
};

export default function SkinFadeKoblenzArticlePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg text-brand-textPrimary">
      <PageAtmosphere />

      <div className="relative z-10">
        <Header />

        <article className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:pt-40">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:text-brand-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu den Artikeln
          </Link>

          <header className="mt-10 border-b border-brand-border/70 pb-10 sm:mt-12 sm:pb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
              Haarschnitt & Fade
            </p>

            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Skin Fade in Koblenz:
              <span className="mt-2 block text-brand-cream">
                Was ist das und für wen eignet er sich?
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Ein klarer Überblick darüber, was einen Skin Fade ausmacht, wie er sich
              von anderen Fade-Varianten unterscheidet und worauf du vor deinem
              nächsten Barber-Termin achten solltest.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-brand-textSecondary/80">
              <span>Veröffentlicht am 18. September 2026</span>
              <span>Aktualisiert am 18. September 2026</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                7 Min. Lesezeit
              </span>
            </div>
          </header>

          <div className="mt-10 space-y-12 text-[15px] font-light leading-8 text-brand-textSecondary sm:text-base sm:leading-8">
            <section aria-labelledby="definition">
              <h2
                id="definition"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Was ist ein Skin Fade?
              </h2>

              <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
                Ein Skin Fade ist ein Herrenhaarschnitt, bei dem die Seiten und der
                Nacken bis auf die Haut oder nahezu auf Hautlänge gekürzt werden. Von
                dort wird das Haar stufenlos in die längere Partie darüber
                überblendet.
              </p>

              <p className="mt-5">
                Der entscheidende Punkt ist nicht nur, dass die Seiten kurz sind,
                sondern wie sauber der Übergang aufgebaut wird. Ein guter Fade soll
                keine harten Linien zeigen. Stattdessen verändert sich die Länge
                kontrolliert von sehr kurz zu länger, sodass der Übergang aus
                normaler Betrachtungsdistanz gleichmäßig wirkt.
              </p>
            </section>

            <section
              aria-labelledby="kurz-erklaert"
              className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6 sm:p-8"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                Kurz erklärt
              </p>

              <h2
                id="kurz-erklaert"
                className="mt-3 font-serif text-3xl font-light text-brand-textPrimary"
              >
                Das Wichtigste zum Skin Fade
              </h2>

              <ul className="mt-5 space-y-3">
                <li>• Die Seiten beginnen auf sehr kurzer beziehungsweise Hautlänge.</li>
                <li>• Der Übergang wird stufenlos in längeres Haar ausgearbeitet.</li>
                <li>• Low, Mid und High Fade beschreiben die Höhe des Übergangs.</li>
                <li>• Der Look lässt sich mit vielen Längen und Haarstrukturen kombinieren.</li>
                <li>• Wie oft du nachschneiden lässt, hängt davon ab, wie frisch du den Fade tragen möchtest.</li>
              </ul>
            </section>

            <section aria-labelledby="fade-varianten">
              <h2
                id="fade-varianten"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Low, Mid oder High Skin Fade: Wo liegt der Unterschied?
              </h2>

              <p className="mt-5">
                Die Begriffe Low, Mid und High beziehen sich darauf, wie hoch der
                Übergang an den Seiten beginnt. Das verändert die Wirkung des
                gesamten Haarschnitts deutlich.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: 'Low Skin Fade',
                    text: 'Der Übergang bleibt relativ tief an Schläfen und Nacken. Das wirkt meist dezenter und lässt mehr Gewicht an den Seiten stehen.',
                  },
                  {
                    title: 'Mid Skin Fade',
                    text: 'Der Fade sitzt ungefähr im mittleren Seitenbereich. Er verbindet einen klaren Kontrast mit einem ausgewogenen Gesamtbild.',
                  },
                  {
                    title: 'High Skin Fade',
                    text: 'Der Übergang beginnt deutlich höher. Dadurch entsteht stärkerer Kontrast zwischen den sehr kurzen Seiten und dem Haar oben.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-brand-border/80 bg-black/20 p-5"
                  >
                    <h3 className="text-sm font-semibold text-brand-textPrimary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="skin-vs-taper">
              <h2
                id="skin-vs-taper"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Skin Fade vs. Taper Fade
              </h2>

              <p className="mt-5">
                Beide Techniken arbeiten mit Übergängen, aber die Wirkung ist
                unterschiedlich. Beim Skin Fade wird ein größerer Teil der Seiten sehr
                kurz ausgearbeitet. Ein Taper konzentriert den Verlauf stärker auf
                Schläfen und Nacken und lässt an den restlichen Seiten mehr Länge
                stehen.
              </p>

              <p className="mt-5">
                Wenn du einen auffälligen, sehr sauberen Kontrast möchtest, ist ein
                Skin Fade oft die naheliegende Richtung. Wenn du einen weicheren,
                zurückhaltenderen Übergang bevorzugst, kann ein Taper besser passen.
                Die Entscheidung sollte aber immer zusammen mit der Länge oben,
                Haarstruktur und Kopfform betrachtet werden.
              </p>
            </section>

            <section aria-labelledby="geeignet">
              <h2
                id="geeignet"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Für wen eignet sich ein Skin Fade?
              </h2>

              <p className="mt-5">
                Ein Skin Fade lässt sich mit vielen Haartypen und Frisuren verbinden.
                Er kann zu kurzem strukturiertem Haar genauso funktionieren wie zu
                längeren Styles oben. Entscheidend ist, dass Höhe, Übergang und
                Oberkopf nicht getrennt voneinander geplant werden.
              </p>

              <p className="mt-5">
                Bei einer persönlichen Beratung sollte ein Barber unter anderem
                berücksichtigen, wie dein Haar fällt, wie viel Länge du oben behalten
                möchtest und ob du deinen Look eher klassisch, clean oder deutlich
                kontrastreicher tragen willst.
              </p>
            </section>

            <section aria-labelledby="haltbarkeit">
              <h2
                id="haltbarkeit"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Wie oft sollte man einen Skin Fade nachschneiden?
              </h2>

              <p className="mt-5">
                Ein Fade verändert sich sichtbar, sobald das sehr kurze Haar an den
                Seiten nachwächst. Wie schnell dich das stört, ist individuell. Wer
                dauerhaft sehr scharfe Konturen und einen klaren Übergang möchte,
                kommt typischerweise häufiger zum Barber als jemand, der den
                herauswachsenden Look entspannt trägt.
              </p>

              <p className="mt-5">
                Statt eine feste Zahl für jeden Kunden vorzugeben, ist es sinnvoller,
                den Rhythmus an dein Haarwachstum und deinen gewünschten Look
                anzupassen.
              </p>
            </section>

            <section aria-labelledby="termin">
              <h2
                id="termin"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Was solltest du vor deinem Barber-Termin wissen?
              </h2>

              <p className="mt-5">
                Je genauer du beschreiben kannst, welche Wirkung du möchtest, desto
                leichter lässt sich der Schnitt planen. Ein Referenzfoto kann helfen,
                wichtiger ist aber die Frage, was dir daran gefällt: die Fade-Höhe,
                die Länge oben, die Konturen oder das Styling.
              </p>

              <p className="mt-5">
                Bei VIP FADES BY ANAS in Koblenz kannst du beim Termin gemeinsam mit
                deinem Barber festlegen, welche Fade-Höhe und welcher Übergang zu
                deinem gewünschten Stil passen. Unsere aktuellen Leistungen und Preise
                findest du auf der{' '}
                <Link
                  href="/leistungen"
                  className="font-medium text-brand-cream underline-offset-4 hover:underline"
                >
                  Leistungsseite
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="pflege">
              <h2
                id="pflege"
                className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Skin Fade pflegen: Drei einfache Tipps
              </h2>

              <ol className="mt-5 space-y-4">
                <li>
                  <strong className="font-semibold text-brand-textPrimary">1. Styling oben bewusst wählen:</strong>{' '}
                  Die sehr kurzen Seiten lenken den Blick stärker auf das Haar oben.
                  Ein Produkt sollte deshalb zu deiner Haarstruktur und dem gewünschten
                  Finish passen.
                </li>
                <li>
                  <strong className="font-semibold text-brand-textPrimary">2. Konturen nicht selbst überarbeiten:</strong>{' '}
                  Kleine Korrekturen an der Übergangslinie können schnell ungleichmäßig
                  wirken. Wenn der Fade sichtbar herausgewachsen ist, ist eine saubere
                  Barber-Korrektur meist die bessere Lösung.
                </li>
                <li>
                  <strong className="font-semibold text-brand-textPrimary">3. Rhythmus finden:</strong>{' '}
                  Beobachte, nach welcher Zeit dir der Fade nicht mehr frisch genug
                  aussieht. Daraus ergibt sich dein persönlicher Nachschnitt-Rhythmus.
                </li>
              </ol>
            </section>

            <section id="faq" aria-labelledby="faq-heading">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                FAQ
              </p>

              <h2
                id="faq-heading"
                className="mt-3 font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl"
              >
                Häufige Fragen zum Skin Fade
              </h2>

              <div className="mt-6 divide-y divide-brand-border/70 border-y border-brand-border/70">
                {faqItems.map((item) => (
                  <div key={item.question} className="py-6">
                    <h3 className="text-base font-semibold text-brand-textPrimary">
                      {item.question}
                    </h3>
                    <p className="mt-3">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-brand-cream/25 bg-brand-cream/[0.045] p-7 sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                VIP FADES KOBLENZ
              </p>

              <h2 className="mt-4 font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Du möchtest deinen nächsten Fade planen?
              </h2>

              <p className="mt-4 max-w-2xl">
                Buche deinen Termin online und besprich mit deinem Barber, welcher
                Übergang zu deinem Haar und deinem gewünschten Look passt.
              </p>

              <Link
                href="/booking"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-cream bg-brand-cream px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-bg transition-colors hover:bg-brand-textPrimary"
              >
                Termin buchen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>

        <Footer />
        <FloatingChat />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqStructuredData) }}
      />
    </main>
  );
}
