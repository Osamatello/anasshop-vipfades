export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  category: string;
};

export const ARTICLES: ArticleSummary[] = [
  {
    slug: 'skin-fade-koblenz',
    title: 'Skin Fade in Koblenz: Was ist das und für wen eignet er sich?',
    excerpt:
      'Was einen Skin Fade ausmacht, wie er sich von anderen Fade-Varianten unterscheidet und worauf du vor deinem nächsten Barber-Termin achten solltest.',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    readingTime: '7 Min.',
    category: 'Haarschnitt & Fade',
  },
];

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
