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

const ARTICLE_URL = `${SITE_URL}/artikel/herrenhaarschnitt-gesichtsform`;
const PUBLISHED_AT = '2026-09-18';
const UPDATED_AT = '2026-09-18';

const faqItems = [
  {
    question: 'Welche Gesichtsformen gibt es bei Männern?',
    answer:
      'Häufig wird grob zwischen ovalen, runden, eckigen, länglichen, herzförmigen und diamantförmigen Gesichtsformen unterschieden. In der Praxis sind viele Gesichter Mischformen.',
  },
  {
    question: 'Ist die Gesichtsform das Wichtigste bei der Wahl des Haarschnitts?',
    answer:
      'Nein. Sie ist nur ein Faktor. Haarstruktur, Dichte, Wirbel, Stirnhöhe, Kopfform und dein gewünschtes Styling sind mindestens genauso wichtig.',
  },
  {
    question: 'Welcher Haarschnitt passt zu einem runden Gesicht?',
    answer:
      'Oft funktionieren Schnitte gut, die oben etwas mehr Höhe und an den Seiten weniger Volumen erzeugen. Die genaue Umsetzung hängt aber von Haarstruktur und Proportionen ab.',
  },
  {
    question: 'Kann ein Fade die Gesichtsform verändern?',
    answer:
      'Ein Fade verändert nicht die Gesichtsform selbst, kann aber durch die Verteilung von Volumen beeinflussen, wie breit, lang oder kantig ein Gesicht optisch wirkt.',
  },
  {
    question: 'Sollte ich Referenzbilder zum Barber mitbringen?',
    answer:
      'Ja, Referenzbilder können helfen. Wichtig ist zusätzlich zu erklären, was dir am Bild gefällt und ob dein Haar eine ähnliche Struktur und Länge hat.',
  },
];

const articleStructuredData = buildArticleStructuredData({
  title: 'Welcher Herrenhaarschnitt passt zu welcher Gesichtsform?',
  description:
    'Guide zu Gesichtsformen, Haarstruktur und Proportionen: So findest du einen Herrenhaarschnitt, der zu deinem Look passt.',
  url: ARTICLE_URL,
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
});

const breadcrumbStructuredData = buildBreadcrumbStructuredData([
  { name: 'Startseite', url: SITE_URL },
  { name: 'Artikel', url: `${SITE_URL}/artikel` },
  { name: 'Herrenhaarschnitt & Gesichtsform', url: ARTICLE_URL },
]);

const faqStructuredData = buildFaqPageStructuredData(faqItems, ARTICLE_URL);

export const metadata: Metadata = {
  title: 'Herrenhaarschnitt nach Gesichtsform: Guide | VIP FADES',
  description:
    'Welcher Herrenhaarschnitt passt zu welcher Gesichtsform? Erfahre, wie Proportionen, Haarstruktur und Volumen den richtigen Look beeinflussen.',
  alternates: { canonical: '/artikel/herrenhaarschnitt-gesichtsform' },
  openGraph: {
    title: 'Welcher Herrenhaarschnitt passt zu welcher Gesichtsform?',
    description:
      'Ein praktischer Guide zu Gesichtsform, Haarstruktur, Volumen und Proportionen.',
    url: '/artikel/herrenhaarschnitt-gesichtsform',
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: UPDATED_AT,
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herrenhaarschnitt & Gesichtsform | VIP FADES',
    description:
      'So beeinflussen Gesichtsform, Haarstruktur und Proportionen deinen Haarschnitt.',
    images: ['/images/og-image.jpg'],
  },
};

export default function HerrenhaarschnittGesichtsformArticlePage() {
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
              Haarschnitt & Styling
            </p>

            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Welcher Herrenhaarschnitt passt
              <span className="mt-2 block text-brand-cream">
                zu welcher Gesichtsform?
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Gesichtsform kann bei der Wahl eines Haarschnitts helfen – aber sie ist
              nie der einzige Faktor. Haarstruktur, Volumen, Kopfform und dein Alltag
              entscheiden mit.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-brand-textSecondary/80">
              <span>Veröffentlicht am 18. September 2026</span>
              <span>Aktualisiert am 18. September 2026</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                8 Min. Lesezeit
              </span>
            </div>
          </header>

          <div className="mt-10 space-y-12 text-[15px] font-light leading-8 text-brand-textSecondary sm:text-base">
            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Die wichtigste Regel zuerst
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
                Ein guter Herrenhaarschnitt sollte nicht nur zur Gesichtsform passen,
                sondern zu deinem gesamten Kopfprofil, deiner Haarstruktur und dem
                Aufwand, den du täglich ins Styling investieren möchtest.
              </p>
              <p className="mt-5">
                Deshalb ist eine starre Regel wie „runde Gesichtsform = genau dieser
                Schnitt“ zu einfach. Ein Barber betrachtet Proportionen und verteilt
                Länge und Volumen so, dass der gesamte Look harmonisch wirkt.
              </p>
            </section>

            <section className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                Kurz erklärt
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
                Worauf kommt es wirklich an?
              </h2>
              <ul className="mt-5 space-y-3">
                <li>• Gesichtsform und Kopfform.</li>
                <li>• Haarstruktur, Dichte und Wirbel.</li>
                <li>• Verhältnis von Seitenlänge zu Volumen oben.</li>
                <li>• Bartform und Konturen.</li>
                <li>• Wie viel Styling du im Alltag machen möchtest.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Ovale Gesichtsform
              </h2>
              <p className="mt-5">
                Ovale Proportionen gelten als vielseitig, weil weder Breite noch Länge
                extrem dominieren. Viele klassische und moderne Herrenhaarschnitte
                funktionieren gut, solange das Volumen oben und an den Seiten
                kontrolliert bleibt.
              </p>
              <p className="mt-5">
                Ein Fade, ein strukturierter Crop oder ein klassischer Seitenschnitt
                können je nach Haarstruktur alle funktionieren. Entscheidend ist die
                Ausführung, nicht nur der Name des Schnitts.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Runde Gesichtsform
              </h2>
              <p className="mt-5">
                Bei einem runden Gesicht kann mehr Höhe am Oberkopf und weniger
                seitliches Volumen die Proportionen optisch strecken. Ein sauberer Fade
                kann diesen Effekt unterstützen.
              </p>
              <p className="mt-5">
                Sehr viel Breite an den Seiten kann das Gesicht dagegen optisch noch
                runder wirken. Deshalb lohnt es sich, die Seiten kontrolliert zu halten
                und oben bewusst Form aufzubauen.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Eckige Gesichtsform
              </h2>
              <p className="mt-5">
                Eine ausgeprägte Kieferlinie kann durch einen präzisen Haarschnitt
                zusätzlich betont oder bewusst weicher eingebunden werden. Kurze Seiten
                und klare Konturen verstärken häufig den markanten Charakter.
              </p>
              <p className="mt-5">
                Wer einen weicheren Look möchte, kann mit etwas mehr Länge und weniger
                aggressiven Übergängen arbeiten.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Längliche Gesichtsform
              </h2>
              <p className="mt-5">
                Bei länglichen Proportionen sollte nicht unnötig viel zusätzliche Höhe
                am Oberkopf entstehen. Etwas mehr Breite an den Seiten kann helfen, den
                Gesamteindruck auszugleichen.
              </p>
              <p className="mt-5">
                Sehr hohe Styles mit extrem kurzen Seiten können das Gesicht optisch
                noch länger wirken lassen. Hier ist Balance wichtiger als maximaler
                Kontrast.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Herz- und diamantförmige Gesichter
              </h2>
              <p className="mt-5">
                Bei schmalerem Kinn oder ausgeprägteren Wangenknochen kann es sinnvoll
                sein, seitlich nicht zu viel Gewicht zu entfernen. Etwas Struktur und
                kontrolliertes Volumen können die Proportionen ruhiger wirken lassen.
              </p>
              <p className="mt-5">
                Auch hier gilt: Die individuelle Kopfform ist wichtiger als die
                theoretische Kategorie allein.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Haarstruktur schlägt Theorie
              </h2>
              <p className="mt-5">
                Glattes, lockiges, dichtes oder feines Haar reagiert unterschiedlich auf
                denselben Schnitt. Ein Look, der auf einem Referenzbild perfekt wirkt,
                kann bei einer anderen Haarstruktur anders fallen.
              </p>
              <p className="mt-5">
                Deshalb sollte ein Barber nicht einfach ein Foto kopieren, sondern
                verstehen, welche Form und Wirkung du daraus übernehmen möchtest.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                Bart und Haarschnitt gemeinsam planen
              </h2>
              <p className="mt-5">
                Ein Bart verändert die sichtbaren Proportionen des Gesichts. Länge,
                Konturen und Volumen im Kinnbereich können beeinflussen, wie breit oder
                lang das Gesicht wirkt.
              </p>
              <p className="mt-5">
                Wenn du Bart und Haarschnitt kombinierst, lohnt es sich deshalb, beide
                als einen Gesamtlook zu planen statt getrennt voneinander.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                So bereitest du deinen Barber-Termin vor
              </h2>
              <p className="mt-5">
                Bring gern ein oder zwei Referenzbilder mit, aber beschreibe zusätzlich,
                was dir wichtig ist: kurze Seiten, mehr Volumen oben, eine bestimmte
                Kontur oder möglichst wenig Stylingaufwand.
              </p>
              <p className="mt-5">
                Bei VIP FADES BY ANAS in Koblenz kannst du deinen gewünschten Look mit
                deinem Barber besprechen. Unsere Leistungen und Preise findest du auf
                der{' '}
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
                Häufige Fragen zu Gesichtsform und Haarschnitt
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
                Lass deinen Schnitt zu dir passen – nicht nur zum Foto.
              </h2>
              <p className="mt-4">
                Buche deinen Termin und plane gemeinsam mit deinem Barber einen Look,
                der zu Haarstruktur, Proportionen und Alltag passt.
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
