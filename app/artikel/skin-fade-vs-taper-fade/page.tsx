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

const ARTICLE_URL = `${SITE_URL}/artikel/skin-fade-vs-taper-fade`;
const PUBLISHED_AT = '2026-09-18';
const UPDATED_AT = '2026-09-18';

const faqItems = [
  {
    question: 'Was ist der Hauptunterschied zwischen Skin Fade und Taper Fade?',
    answer:
      'Ein Skin Fade blendet die Seiten großflächiger bis auf sehr kurze beziehungsweise Hautlänge aus. Ein Taper Fade konzentriert den Übergang meist stärker auf Schläfen und Nacken und lässt an den übrigen Seiten mehr Länge stehen.',
  },
  {
    question: 'Welcher Fade wirkt auffälliger?',
    answer:
      'Ein Skin Fade erzeugt in der Regel den stärkeren Kontrast zwischen den sehr kurzen Seiten und dem längeren Haar darüber. Ein Taper Fade wirkt meist zurückhaltender.',
  },
  {
    question: 'Welcher Schnitt wächst unauffälliger heraus?',
    answer:
      'Ein Taper Fade kann durch die längeren Seiten oft weicher herauswachsen. Beim Skin Fade fällt nachwachsendes Haar an den sehr kurzen Bereichen meist früher sichtbar auf.',
  },
  {
    question: 'Kann man einen Taper Fade mit längeren Haaren kombinieren?',
    answer:
      'Ja. Gerade weil mehr Länge an den Seiten erhalten bleibt, lässt sich ein Taper gut mit vielen klassischen und längeren Styles kombinieren.',
  },
  {
    question: 'Welcher Fade passt besser zu mir?',
    answer:
      'Das hängt von Haarstruktur, Kopfform, gewünschtem Kontrast und Styling ab. Ein Barber kann die Fade-Höhe und die Seitenlänge an deinen Look anpassen.',
  },
];

const articleStructuredData = buildArticleStructuredData({
  title: 'Skin Fade vs. Taper Fade: Was ist der Unterschied?',
  description:
    'Vergleich von Skin Fade und Taper Fade: Übergang, Wirkung, Pflege und Entscheidungshilfe für deinen nächsten Barber-Termin.',
  url: ARTICLE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
});

const breadcrumbStructuredData = buildBreadcrumbStructuredData([
  { name: 'Startseite', url: SITE_URL },
  { name: 'Artikel', url: `${SITE_URL}/artikel` },
  { name: 'Skin Fade vs. Taper Fade', url: ARTICLE_URL },
]);

const faqStructuredData = buildFaqPageStructuredData(faqItems, ARTICLE_URL);

export const metadata: Metadata = {
  title: 'Skin Fade vs. Taper Fade: Unterschiede erklärt | VIP FADES',
  description:
    'Skin Fade oder Taper Fade? Erfahre die wichtigsten Unterschiede bei Übergang, Wirkung, Pflege und Styling. Barber-Ratgeber von VIP FADES Koblenz.',
  alternates: { canonical: '/artikel/skin-fade-vs-taper-fade' },
  openGraph: {
    title: 'Skin Fade vs. Taper Fade: Was ist der Unterschied?',
    description:
      'Ein klarer Vergleich von Skin Fade und Taper Fade für deinen nächsten Barber-Termin.',
    url: '/artikel/skin-fade-vs-taper-fade',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: UPDATED_AT,
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skin Fade vs. Taper Fade | VIP FADES',
    description:
      'Übergang, Wirkung, Pflege und Unterschiede einfach erklärt.',
    images: ['/images/og-image.jpg'],
  },
};

export default function SkinFadeVsTaperFadeArticlePage() {
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
              Skin Fade vs. Taper Fade:
              <span className="mt-2 block text-brand-cream">
                Was ist der Unterschied?
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Beide Techniken arbeiten mit Übergängen, wirken aber deutlich
              unterschiedlich. Hier erfährst du, wo der Unterschied liegt und welche
              Variante zu deinem gewünschten Look passen kann.
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
                Der Unterschied kurz erklärt
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
                Beim Skin Fade werden die Seiten großflächiger bis auf sehr kurze
                beziehungsweise Hautlänge ausgeblendet. Beim Taper Fade bleibt an den
                Seiten mehr Länge stehen; der Übergang konzentriert sich stärker auf
                Schläfen und Nacken.
              </p>
              <p className="mt-5">
                Beide Schnitte können präzise und modern aussehen. Entscheidend ist
                nicht, welcher davon grundsätzlich besser ist, sondern welche Wirkung
                du erreichen möchtest und wie der Übergang zu deiner Frisur oben passt.
              </p>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-cream">
                  Skin Fade
                </p>
                <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
                  Mehr Kontrast
                </h2>
                <p className="mt-4">
                  Sehr kurze Seiten und ein deutlich sichtbarer Übergang sorgen für
                  einen cleanen, kontrastreichen Look. Die Konturen wirken besonders
                  frisch, wenn der Fade sauber nachgearbeitet ist.
                </p>
              </div>

              <div className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-cream">
                  Taper Fade
                </p>
                <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
                  Mehr Länge
                </h2>
                <p className="mt-4">
                  Der Übergang sitzt konzentrierter an Schläfen und Nacken. Dadurch
                  bleibt seitlich mehr Haar erhalten und der Gesamtlook wirkt meist
                  weicher und zurückhaltender.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Wirkung und Styling
              </h2>
              <p className="mt-5">
                Ein Skin Fade lenkt durch den starken Kontrast automatisch mehr
                Aufmerksamkeit auf das Haar am Oberkopf. Struktur, Volumen oder ein
                klar gestylter Look werden dadurch stärker betont.
              </p>
              <p className="mt-5">
                Ein Taper Fade integriert sich ruhiger in die Gesamtfrisur. Das macht
                ihn interessant, wenn du deine Seiten nicht komplett sehr kurz tragen
                möchtest oder einen klassischeren Stil bevorzugst.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Welcher Fade braucht mehr Pflege?
              </h2>
              <p className="mt-5">
                Beim Skin Fade fällt nachwachsendes Haar an den sehr kurzen Bereichen
                schneller auf. Wenn du den Übergang dauerhaft sehr scharf tragen
                möchtest, wirst du ihn entsprechend früher nacharbeiten lassen.
              </p>
              <p className="mt-5">
                Ein Taper kann oft etwas unauffälliger herauswachsen, weil insgesamt
                mehr Länge an den Seiten bleibt. Trotzdem hängt der passende
                Nachschnitt-Rhythmus von deinem Haarwachstum und deinem Anspruch an
                die Konturen ab.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Welche Variante passt zu welchem Stil?
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-brand-border/80 bg-black/20 p-5">
                  <h3 className="font-semibold text-brand-textPrimary">
                    Du möchtest maximalen Kontrast?
                  </h3>
                  <p className="mt-2">
                    Dann kann ein Skin Fade die passendere Richtung sein, besonders in
                    Kombination mit klaren Konturen und strukturiertem Haar oben.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-border/80 bg-black/20 p-5">
                  <h3 className="font-semibold text-brand-textPrimary">
                    Du möchtest einen weicheren Übergang?
                  </h3>
                  <p className="mt-2">
                    Dann kann ein Taper Fade besser funktionieren, weil die Seiten
                    weniger stark reduziert werden.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-border/80 bg-black/20 p-5">
                  <h3 className="font-semibold text-brand-textPrimary">
                    Du bist dir nicht sicher?
                  </h3>
                  <p className="mt-2">
                    Entscheide nicht nur nach einem Bild. Haarstruktur, Kopfform,
                    Länge oben und dein tägliches Styling sollten gemeinsam betrachtet
                    werden.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Was solltest du deinem Barber zeigen?
              </h2>
              <p className="mt-5">
                Referenzbilder helfen, wenn du zusätzlich erklären kannst, was dir am
                Beispiel gefällt. Sag zum Beispiel, ob du die Fade-Höhe, die
                Seitenlänge, die Konturen oder das Styling oben übernehmen möchtest.
              </p>
              <p className="mt-5">
                Bei VIP FADES BY ANAS in Koblenz kannst du deinen gewünschten Look
                vor dem Schnitt mit deinem Barber abstimmen. Unsere aktuellen
                Leistungen findest du auf der{' '}
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
                Häufige Fragen zu Skin Fade und Taper Fade
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
                Skin Fade oder Taper Fade? Wir planen den Look mit dir.
              </h2>
              <p className="mt-4">
                Buche deinen Termin online und besprich direkt mit deinem Barber,
                welcher Übergang zu deinem Haar und deinem Stil passt.
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
