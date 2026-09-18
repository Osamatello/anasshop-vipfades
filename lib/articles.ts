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
  {
    slug: 'skin-fade-vs-taper-fade',
    title: 'Skin Fade vs. Taper Fade: Was ist der Unterschied?',
    excerpt:
      'Die wichtigsten Unterschiede zwischen Skin Fade und Taper Fade – inklusive Wirkung, Pflege und der Frage, welcher Übergang zu deinem Stil passen kann.',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    readingTime: '6 Min.',
    category: 'Haarschnitt & Fade',
  },
  {
    slug: 'wie-oft-zum-barber',
    title: 'Wie oft sollte man zum Barber gehen?',
    excerpt:
      'Wie häufig ein Barber-Termin sinnvoll ist, hängt von Schnitt, Haarwachstum und gewünschter Kontur ab. Hier findest du einen praktischen Überblick.',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    readingTime: '6 Min.',
    category: 'Barber Wissen',
  },
  {
    slug: 'herrenhaarschnitt-gesichtsform',
    title: 'Welcher Herrenhaarschnitt passt zu welcher Gesichtsform?',
    excerpt:
      'Gesichtsform, Haarstruktur und Proportionen beeinflussen, wie ein Haarschnitt wirkt. Dieser Guide zeigt, worauf es bei der Auswahl wirklich ankommt.',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    readingTime: '8 Min.',
    category: 'Haarschnitt & Styling',
  },
  {
    slug: 'bart-richtig-pflegen',
    title: 'Bart richtig pflegen: Die wichtigsten Tipps vom Barber',
    excerpt:
      'Ein gepflegter Bart braucht saubere Konturen, die richtige Länge und eine einfache Routine. Diese Tipps helfen dir, deinen Bart ordentlich zu halten.',
    publishedAt: '2026-09-18',
    updatedAt: '2026-09-18',
    readingTime: '7 Min.',
    category: 'Bartpflege',
  },
];

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
