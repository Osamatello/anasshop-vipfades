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

const ARTICLE_URL = `${SITE_URL}/artikel/wie-oft-zum-barber`;
const PUBLISHED_AT = '2026-09-18';
const UPDATED_AT = '2026-09-18';

const faqItems = [
  {
    question: 'Wie oft sollte man normalerweise zum Barber gehen?',
    answer:
      'Es gibt keinen festen Rhythmus für jeden. Kurze Fades brauchen meist früher eine Auffrischung als längere Schnitte. Entscheidend sind Haarwachstum, Schnittform und wie frisch du Konturen und Übergänge tragen möchtest.',
  },
  {
    question: 'Wann sollte ein Skin Fade nachgeschnitten werden?',
    answer:
      'Sobald der Übergang sichtbar herauswächst und dir nicht mehr sauber genug wirkt. Wer einen sehr frischen Look möchte, lässt einen Skin Fade typischerweise regelmäßiger nacharbeiten als einen längeren Schnitt.',
  },
  {
    question: 'Kann man nur die Konturen auffrischen lassen?',
    answer:
      'Je nach Schnitt kann eine Konturen- oder Bartauffrischung zwischen kompletten Haarschnitten sinnvoll sein. Ob das reicht, hängt davon ab, wie stark auch der Übergang herausgewachsen ist.',
  },
  {
    question: 'Wächst ein Taper Fade unauffälliger heraus?',
    answer:
      'Oft ja, weil seitlich mehr Länge erhalten bleibt. Dadurch kann der Übergang beim Herauswachsen weicher wirken als bei einem Skin Fade.',
  },
  {
    question: 'Kann mein Barber einen passenden Rhythmus empfehlen?',
    answer:
      'Ja. Ein Barber kann anhand von Haarwachstum, gewünschter Länge und deinem Styling einschätzen, welcher Nachschnitt-Rhythmus praktisch ist.',
  },
];

const articleStructuredData = buildArticleStructuredData({
  title: 'Wie oft sollte man zum Barber gehen?',
  description:
    'Praktischer Guide zum richtigen Barber-Rhythmus: Fades, klassische Herrenhaarschnitte, Konturen und Bartpflege.',
  url: ARTICLE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
});

const breadcrumbStructuredData = buildBreadcrumbStructuredData([
  { name: 'Startseite', url: SITE_URL },
  { name: 'Artikel', url: `${SITE_URL}/artikel` },
  { name: 'Wie oft zum Barber?', url: ARTICLE_URL },
]);

const faqStructuredData = buildFaqPageStructuredData(faqItems, ARTICLE_URL);

export const metadata: Metadata = {
  title: 'Wie oft zum Barber? Der richtige Rhythmus | VIP FADES',
  description:
    'Wie oft sollte man zum Barber gehen? Erfahre, wie Schnitt, Haarwachstum, Fade und Konturen deinen idealen Nachschnitt-Rhythmus bestimmen.',
  alternates: { canonical: '/artikel/wie-oft-zum-barber' },
  openGraph: {
    title: 'Wie oft sollte man zum Barber gehen?',
    description:
      'Ein praktischer Überblick für Fades, Herrenhaarschnitte, Konturen und Bartpflege.',
    url: '/artikel/wie-oft-zum-barber',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: UPDATED_AT,
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wie oft zum Barber? | VIP FADES',
    description:
      'Finde einen sinnvollen Rhythmus für Haarschnitt, Fade und Konturen.',
    images: ['/images/og-image.png'],
  },
};

export default function WieOftZumBarberArticlePage() {
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
              Barber Wissen
            </p>

            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Wie oft sollte man
              <span className="mt-2 block text-brand-cream">zum Barber gehen?</span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Der richtige Rhythmus hängt nicht von einer festen Zahl ab. Schnitt,
              Haarwachstum, Konturen und dein Anspruch an einen frischen Look bestimmen,
              wann der nächste Termin sinnvoll ist.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-brand-textSecondary/80">
              <span>Veröffentlicht am 18. September 2026</span>
              <span>Aktualisiert am 18. September 2026</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                6 Min. Lesezeit
              </span>
            </div>
          </header>

          <div className="mt-10 space-y-12 text-[15px] font-light leading-8 text-brand-textSecondary sm:text-base">
            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Die kurze Antwort
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
                Je kürzer und präziser ein Haarschnitt ist, desto früher fällt
                herauswachsendes Haar auf. Ein Skin Fade braucht deshalb meistens
                häufiger eine Auffrischung als ein längerer, weicher geschnittener Look.
              </p>
              <p className="mt-5">
                Statt einem festen Kalender solltest du beobachten, wann Übergang,
                Konturen oder Form für dich nicht mehr sauber aussehen. Genau daraus
                entsteht dein persönlicher Barber-Rhythmus.
              </p>
            </section>

            <section className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                Orientierung
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
                Was beeinflusst den nächsten Termin?
              </h2>
              <ul className="mt-5 space-y-3">
                <li>• Wie schnell dein Haar wächst.</li>
                <li>• Wie kurz die Seiten geschnitten wurden.</li>
                <li>• Wie exakt du Konturen und Übergänge tragen möchtest.</li>
                <li>• Ob dein Schnitt beim Herauswachsen seine Form behält.</li>
                <li>• Wie viel Styling du im Alltag investieren möchtest.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Skin Fade: Warum der Rhythmus meist kürzer ist
              </h2>
              <p className="mt-5">
                Beim Skin Fade starten die Seiten auf sehr kurzer beziehungsweise
                Hautlänge. Schon wenig Nachwuchs verändert deshalb den Kontrast.
                Besonders an Schläfen, Nacken und über den Ohren wird schnell sichtbar,
                dass der Fade nicht mehr ganz frisch ist.
              </p>
              <p className="mt-5">
                Wenn du den Look bewusst etwas weicher herauswachsen lässt, kannst du
                natürlich länger warten. Entscheidend ist dein persönlicher Anspruch,
                nicht eine allgemeine Regel.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Längere Herrenhaarschnitte: Mehr Spielraum
              </h2>
              <p className="mt-5">
                Bei längeren Schnitten bleibt die Form oft länger harmonisch, weil kleine
                Längenunterschiede weniger auffallen. Trotzdem kann der Schnitt an
                Volumen verlieren oder an den Seiten zu schwer wirken.
              </p>
              <p className="mt-5">
                Ein sinnvoller Termin ist dann erreicht, wenn die Frisur sich nicht mehr
                so leicht stylen lässt oder die ursprüngliche Form deutlich verloren
                geht.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bart und Konturen separat betrachten
              </h2>
              <p className="mt-5">
                Bartlinien und Konturen können schneller unruhig wirken als der
                Haarschnitt selbst. Deshalb kann es sinnvoll sein, Bart oder Konturen
                zwischen zwei vollständigen Haarschnitten auffrischen zu lassen.
              </p>
              <p className="mt-5">
                Ob eine kleine Auffrischung ausreicht oder ein kompletter Termin besser
                ist, hängt davon ab, wie stark Schnitt und Fade bereits herausgewachsen
                sind.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Woran erkennst du, dass es Zeit ist?
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  'Der Fade zeigt keine klare Abstufung mehr.',
                  'Die Konturen an Schläfen oder Nacken wirken unsauber.',
                  'Die Seiten bauen sichtbar mehr Volumen auf als gewünscht.',
                  'Das Styling funktioniert nicht mehr wie direkt nach dem Schnitt.',
                ].map((text) => (
                  <div
                    key={text}
                    className="rounded-2xl border border-brand-border/80 bg-black/20 p-5"
                  >
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                So findest du deinen eigenen Rhythmus
              </h2>
              <p className="mt-5">
                Notiere dir nach einem frischen Schnitt ungefähr, ab wann du merkst,
                dass dir Form oder Übergang nicht mehr gefallen. Nach zwei oder drei
                Terminen kennst du deinen natürlichen Rhythmus deutlich besser.
              </p>
              <p className="mt-5">
                Bei VIP FADES BY ANAS in Koblenz kannst du deinen gewünschten Stil mit
                deinem Barber abstimmen und daraus einen sinnvollen Nachschnitt-Rhythmus
                ableiten. Preise und Leistungen findest du auf unserer{' '}
                <Link
                  href="/leistungen"
                  className="font-medium text-brand-cream underline-offset-4 hover:underline"
                >
                  Leistungsseite
                </Link>
                .
              </p>
            </section>

            <section id="faq">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                FAQ
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Häufige Fragen zum Barber-Rhythmus
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
                Zeit für einen frischen Schnitt?
              </h2>
              <p className="mt-4">
                Buche deinen nächsten Termin online und halte Fade, Konturen und Form so
                frisch, wie du sie tragen möchtest.
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
