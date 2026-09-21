import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';

import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import { ARTICLES } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Artikel & Barber-Ratgeber | VIP FADES Koblenz',
  description:
    'Barber-Wissen von VIP FADES BY ANAS in Koblenz: verständliche Artikel zu Skin Fades, Herrenhaarschnitten, Bartpflege, Styling und moderner Männerpflege.',
  alternates: { canonical: '/artikel' },
  openGraph: {
    title: 'Artikel & Barber-Ratgeber | VIP FADES Koblenz',
    description:
      'Praktisches Barber-Wissen zu Fades, Herrenhaarschnitten, Bartpflege und Styling von VIP FADES BY ANAS in Koblenz.',
    url: '/artikel',
    type: 'website',
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel & Barber-Ratgeber | VIP FADES Koblenz',
    description:
      'Barber-Wissen zu Fades, Herrenhaarschnitten, Bartpflege und Styling von VIP FADES BY ANAS.',
    images: ['/images/og-image.png'],
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`));
}

export default function ArtikelPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg text-brand-textPrimary">
      <PageAtmosphere showRings />

      <div className="relative z-10">
        <Header />

        <section className="mx-auto max-w-7xl px-5 pb-14 pt-36 sm:px-8 sm:pb-16 sm:pt-40 lg:pb-20">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-cream sm:text-xs">
              VIP FADES WISSEN
            </p>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Barber Wissen,
              <span className="mt-2 block text-brand-cream">Pflege & Style.</span>
            </h1>

            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              Klare Antworten auf Fragen rund um Skin Fades, Herrenhaarschnitte,
              Bartpflege und modernes Styling – direkt aus dem Barber-Alltag bei
              VIP FADES BY ANAS in Koblenz.
            </p>
          </div>
        </section>

        <section className="border-y border-brand-border/70 bg-black/20">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
            <div className="mb-8 max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
                Ratgeber
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
                Neueste Artikel
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {ARTICLES.map((article) => (
                <article
                  key={article.slug}
                  className="group rounded-[24px] border border-brand-border/80 bg-brand-bg/75 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-cream/50 hover:shadow-[0_18px_55px_rgba(0,0,0,0.32)] sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-cream/75">
                    <span>{article.category}</span>
                    <span className="h-1 w-1 rounded-full bg-brand-cream/40" />
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl font-light leading-tight text-brand-textPrimary sm:text-4xl">
                    {article.title}
                  </h3>

                  <p className="mt-5 text-sm font-light leading-7 text-brand-textSecondary sm:text-base">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-brand-border/70 pt-5">
                    <p className="text-xs font-light text-brand-textSecondary/80">
                      Veröffentlicht am {formatDate(article.publishedAt)}
                    </p>

                    <Link
                      href={`/artikel/${article.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream transition-colors hover:text-brand-textPrimary"
                    >
                      Artikel lesen
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <FloatingChat />
      </div>
    </main>
  );
}
