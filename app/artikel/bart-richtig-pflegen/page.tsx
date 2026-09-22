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

const ARTICLE_URL = `${SITE_URL}/artikel/bart-richtig-pflegen`;
const PUBLISHED_AT = '2026-09-18';
const UPDATED_AT = '2026-09-18';

const faqItems = [
  {
    question: 'Wie oft sollte man den Bart waschen?',
    answer:
      'Waschhäufigkeit hängt von Haut, Bartlänge und Alltag ab. Wichtig ist, den Bart sauber zu halten, ohne Haut und Haar unnötig auszutrocknen.',
  },
  {
    question: 'Braucht jeder Bart Bartöl?',
    answer:
      'Nicht zwingend. Bartöl kann Haut und Barthaar geschmeidiger machen, ist aber vor allem bei trockener Haut oder längerem Bart hilfreich. Menge und Produkt sollten zur Haut passen.',
  },
  {
    question: 'Wie hält man Bartkonturen sauber?',
    answer:
      'Definierte Linien an Wangen, Hals und Koteletten sorgen für einen gepflegten Eindruck. Kleine Nacharbeiten sind möglich, bei komplexen Übergängen ist eine Barber-Korrektur oft sauberer.',
  },
  {
    question: 'Wie oft sollte man den Bart trimmen?',
    answer:
      'Das hängt von gewünschter Länge und Form ab. Kurze, exakt konturierte Bärte brauchen meist häufiger eine Formkorrektur als längere, natürlicher getragene Bärte.',
  },
  {
    question: 'Kann man Haarschnitt und Bart zusammen abstimmen?',
    answer:
      'Ja. Seitenlänge, Fade, Koteletten und Bartform wirken zusammen. Ein abgestimmter Übergang kann den gesamten Look deutlich ruhiger und sauberer wirken lassen.',
  },
];

const articleStructuredData = buildArticleStructuredData({
  title: 'Bart richtig pflegen: Die wichtigsten Tipps vom Barber',
  description:
    'Praktische Bartpflege: Waschen, Konturen, Trimmen, Bürsten und Pflegeprodukte – einfach erklärt für einen sauberen, gepflegten Look.',
  url: ARTICLE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
});

const breadcrumbStructuredData = buildBreadcrumbStructuredData([
  { name: 'Startseite', url: SITE_URL },
  { name: 'Artikel', url: `${SITE_URL}/artikel` },
  { name: 'Bart richtig pflegen', url: ARTICLE_URL },
]);

const faqStructuredData = buildFaqPageStructuredData(faqItems, ARTICLE_URL);

export const metadata: Metadata = {
  title: 'Bart richtig pflegen: Tipps für Form & Konturen | VIP FADES',
  description:
    'Bartpflege einfach erklärt: Waschen, Trimmen, Konturen, Bürsten und Pflegeprodukte. Praktische Tipps von VIP FADES BY ANAS in Koblenz.',
  alternates: { canonical: '/artikel/bart-richtig-pflegen' },
  openGraph: {
    title: 'Bart richtig pflegen: Die wichtigsten Tipps vom Barber',
    description:
      'So hältst du Bart, Konturen und Form gepflegt – mit einer einfachen, alltagstauglichen Routine.',
    url: '/artikel/bart-richtig-pflegen',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: UPDATED_AT,
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bart richtig pflegen | VIP FADES',
    description:
      'Praktische Tipps für Bartform, Konturen, Waschen und Trimmen.',
    images: ['/images/og-image.jpg'],
  },
};

export default function BartRichtigPflegenArticlePage() {
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
              Bartpflege
            </p>

            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Bart richtig pflegen:
              <span className="mt-2 block text-brand-cream">
                Die wichtigsten Tipps vom Barber
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Ein gepflegter Bart braucht keine komplizierte Routine. Sauberkeit,
              kontrollierte Länge, klare Konturen und die richtige Pflege machen den
              größten Unterschied.
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

          <div className="mt-10 space-y-12 text-[15px] font-light leading-8 text-brand-textSecondary sm:text-base">
            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Was gehört zu guter Bartpflege?
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
                Gute Bartpflege bedeutet vor allem: Bart und Haut sauber halten, die
                gewünschte Form regelmäßig kontrollieren und nur so viel Produkt
                verwenden, wie Haar und Haut tatsächlich brauchen.
              </p>
              <p className="mt-5">
                Ein teures Regal voller Produkte ersetzt keine saubere Form. Der
                gepflegte Eindruck entsteht zuerst durch Länge, Symmetrie und klare
                Übergänge zwischen Haar, Koteletten und Bart.
              </p>
            </section>

            <section className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                Einfache Routine
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
                Die vier Grundlagen
              </h2>
              <ul className="mt-5 space-y-3">
                <li>• Bart und Haut sauber halten.</li>
                <li>• Regelmäßig kämmen oder bürsten.</li>
                <li>• Länge und Konturen kontrolliert trimmen.</li>
                <li>• Pflegeprodukte sparsam und passend zur Haut einsetzen.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bart richtig waschen
              </h2>
              <p className="mt-5">
                Im Bart sammeln sich Schweiß, Hautfett, Staub und Stylingreste. Deshalb
                sollte er regelmäßig gereinigt werden. Wie oft, hängt von Bartlänge,
                Hauttyp, Sport und Alltag ab.
              </p>
              <p className="mt-5">
                Zu aggressive Reinigung kann Haut und Barthaar trocken wirken lassen.
                Ziel ist deshalb nicht maximale Reinigungskraft, sondern eine Routine,
                die sauber hält und trotzdem angenehm für die Haut bleibt.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Kämmen und Bürsten: Warum es mehr als Styling ist
              </h2>
              <p className="mt-5">
                Regelmäßiges Kämmen oder Bürsten bringt längere Barthaare in eine
                gemeinsame Richtung und zeigt dir schneller, wo einzelne Haare aus der
                Form stehen.
              </p>
              <p className="mt-5">
                Besonders vor dem Trimmen ist das hilfreich: Erst wenn der Bart in
                seiner natürlichen Richtung liegt, lässt sich die Form sinnvoll
                beurteilen.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Konturen: Der schnellste Weg zu einem gepflegten Look
              </h2>
              <p className="mt-5">
                Selbst ein dichter Bart kann ungepflegt wirken, wenn Halslinie,
                Wangenlinie oder Koteletten keine klare Form haben. Saubere Konturen
                geben dem Bart einen bewussten Rahmen.
              </p>
              <p className="mt-5">
                Die Linien sollten aber zur natürlichen Bartdichte passen. Eine zu hoch
                gesetzte Halslinie oder künstlich tiefe Wangenlinie kann die
                Proportionen unruhig wirken lassen.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bart trimmen: Nicht überall gleich viel wegnehmen
              </h2>
              <p className="mt-5">
                Ein guter Bart wird nicht einfach auf eine einzige Länge gekürzt.
                Kinnbereich, Wangen, Schnurrbart und Übergang zu den Koteletten können
                unterschiedliche Längen brauchen, damit die Gesamtform stimmt.
              </p>
              <p className="mt-5">
                Besonders der Übergang vom Haarschnitt in den Bart sollte bewusst
                geplant werden. Bei einem Fade kann dieser Bereich weich verbunden oder
                klar getrennt werden – abhängig vom gewünschten Stil.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bartöl und andere Pflegeprodukte
              </h2>
              <p className="mt-5">
                Pflegeprodukte können helfen, wenn Haut oder Barthaar trocken wirken.
                Weniger ist dabei oft mehr. Ein Produkt sollte sich angenehm verteilen
                lassen und nicht dazu führen, dass der Bart schwer oder fettig wirkt.
              </p>
              <p className="mt-5">
                Bei empfindlicher oder gereizter Haut solltest du Produkte vorsichtig
                testen und bei anhaltenden Hautproblemen medizinischen Rat einholen.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bart und Haarschnitt als ein Gesamtlook
              </h2>
              <p className="mt-5">
                Die stärkste Wirkung entsteht, wenn Bart und Haarschnitt nicht getrennt
                geplant werden. Koteletten, Fade-Höhe, Bartdichte und Konturen
                beeinflussen gemeinsam die Proportionen des Gesichts.
              </p>
              <p className="mt-5">
                Bei VIP FADES BY ANAS in Koblenz kannst du Haarschnitt und Bartpflege
                kombinieren. Die aktuellen Leistungen und Preise findest du auf unserer{' '}
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
                Häufige Fragen zur Bartpflege
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
                Saubere Konturen und eine Bartform, die zu dir passt.
              </h2>
              <p className="mt-4">
                Buche Bartpflege einzeln oder zusammen mit deinem Haarschnitt direkt
                online.
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
