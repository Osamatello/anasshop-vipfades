import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';

import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import { ARTICLES, getArticleBySlug } from '@/lib/articles';
import {
  SITE_URL,
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  buildFaqPageStructuredData,
  serializeJsonLd,
} from '@/lib/seo/structuredData';

export type ArticleSection =
  | { kind: 'text'; id: string; heading: string; lead?: ReactNode; paragraphs: ReactNode[] }
  | { kind: 'summary'; id: string; heading: string; points: string[] }
  | {
      kind: 'cards';
      id: string;
      heading: string;
      intro?: ReactNode;
      cards: Array<{ title: string; text: string }>;
    }
  | {
      kind: 'steps';
      id: string;
      heading: string;
      intro?: ReactNode;
      steps: Array<{ title: string; text: ReactNode }>;
    };

export type ArticleContent = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  breadcrumbName: string;
  sections: ArticleSection[];
  faqHeading: string;
  faq: Array<{ question: string; answer: string }>;
  ctaHeading: string;
  ctaText: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`));
}

function requireSummary(slug: string) {
  const summary = getArticleBySlug(slug);
  if (!summary) throw new Error(`Article "${slug}" is missing from lib/articles.ts`);
  return summary;
}

export function buildArticleMetadata(content: ArticleContent): Metadata {
  const summary = requireSummary(content.slug);
  const path = `/artikel/${content.slug}`;
  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: summary.title,
      description: content.seoDescription,
      url: path,
      type: 'article',
      publishedTime: summary.publishedAt,
      modifiedTime: summary.updatedAt,
      images: ['/images/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.breadcrumbName} | VIP FADES BY ANAS`,
      description: content.seoDescription,
      images: ['/images/og-image.jpg'],
    },
  };
}

const h2Class = 'font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl';

function Section({ section }: { section: ArticleSection }) {
  if (section.kind === 'summary') {
    return (
      <section
        aria-labelledby={section.id}
        className="rounded-[24px] border border-brand-cream/20 bg-brand-cream/[0.035] p-6 sm:p-8"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
          Kurz erklärt
        </p>
        <h2 id={section.id} className="mt-3 font-serif text-3xl font-light text-brand-textPrimary">
          {section.heading}
        </h2>
        <ul className="mt-5 space-y-3">
          {section.points.map((point) => (
            <li key={point}>• {point}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (section.kind === 'cards') {
    return (
      <section aria-labelledby={section.id}>
        <h2 id={section.id} className={h2Class}>
          {section.heading}
        </h2>
        {section.intro && <p className="mt-5">{section.intro}</p>}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {section.cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-brand-border/80 bg-black/20 p-5">
              <h3 className="text-sm font-semibold text-brand-textPrimary">{card.title}</h3>
              <p className="mt-3 text-sm leading-7">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.kind === 'steps') {
    return (
      <section aria-labelledby={section.id}>
        <h2 id={section.id} className={h2Class}>
          {section.heading}
        </h2>
        {section.intro && <p className="mt-5">{section.intro}</p>}
        <ol className="mt-5 space-y-4">
          {section.steps.map((step, index) => (
            <li key={step.title}>
              <strong className="font-semibold text-brand-textPrimary">
                {index + 1}. {step.title}:
              </strong>{' '}
              {step.text}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section aria-labelledby={section.id}>
      <h2 id={section.id} className={h2Class}>
        {section.heading}
      </h2>
      {section.lead && (
        <p className="mt-5 text-base font-medium leading-8 text-brand-textPrimary sm:text-lg">
          {section.lead}
        </p>
      )}
      {section.paragraphs.map((paragraph, index) => (
        <p key={index} className="mt-5">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-brand-cream underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export default function ArticleTemplate({ content }: { content: ArticleContent }) {
  const summary = requireSummary(content.slug);
  const articleUrl = `${SITE_URL}/artikel/${content.slug}`;

  const articleStructuredData = buildArticleStructuredData({
    title: summary.title,
    description: content.seoDescription,
    url: articleUrl,
    datePublished: summary.publishedAt,
    dateModified: summary.updatedAt,
  });
  const breadcrumbStructuredData = buildBreadcrumbStructuredData([
    { name: 'Startseite', url: SITE_URL },
    { name: 'Artikel', url: `${SITE_URL}/artikel` },
    { name: content.breadcrumbName, url: articleUrl },
  ]);
  const faqStructuredData = buildFaqPageStructuredData(content.faq, articleUrl);

  const related = ARTICLES.filter((article) => article.slug !== content.slug).slice(0, 3);

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
              {summary.category}
            </p>
            <h1 className="mt-5 font-serif text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              {content.titleLine1}
              <span className="mt-2 block text-brand-cream">{content.titleLine2}</span>
            </h1>
            <p className="mt-7 max-w-3xl text-base font-light leading-8 text-brand-textSecondary sm:text-lg">
              {content.intro}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-light text-brand-textSecondary/80">
              <span>Veröffentlicht am {formatDate(summary.publishedAt)}</span>
              <span>Aktualisiert am {formatDate(summary.updatedAt)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {summary.readingTime} Lesezeit
              </span>
            </div>
          </header>

          <div className="mt-10 space-y-12 text-[15px] font-light leading-8 text-brand-textSecondary sm:text-base sm:leading-8">
            {content.sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}

            <section id="faq" aria-labelledby="faq-heading">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">FAQ</p>
              <h2 id="faq-heading" className={`mt-3 ${h2Class}`}>
                {content.faqHeading}
              </h2>
              <div className="mt-6 divide-y divide-brand-border/70 border-y border-brand-border/70">
                {content.faq.map((item) => (
                  <div key={item.question} className="py-6">
                    <h3 className="text-base font-semibold text-brand-textPrimary">{item.question}</h3>
                    <p className="mt-3">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="weiterlesen">
              <h2 id="weiterlesen" className={h2Class}>
                Weiterlesen
              </h2>
              <ul className="mt-5 space-y-3">
                {related.map((article) => (
                  <li key={article.slug}>
                    <InlineLink href={`/artikel/${article.slug}`}>{article.title}</InlineLink>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-brand-cream/25 bg-brand-cream/[0.045] p-7 sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cream">
                VIP FADES KOBLENZ
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light text-brand-textPrimary sm:text-4xl">
                {content.ctaHeading}
              </h2>
              <p className="mt-4 max-w-2xl">{content.ctaText}</p>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqStructuredData) }} />
    </main>
  );
}
