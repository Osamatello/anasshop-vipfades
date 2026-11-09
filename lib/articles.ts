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
    slug: 'barber-koblenz-ohne-termin',
    title: 'Barber in Koblenz ohne Termin: So klappt dein Walk-in',
    excerpt:
      'Täglich von 10 bis 19 Uhr ohne Termin vorbeikommen: So läuft ein Walk-in bei VIP FADES ab – und wann sich ein Online-Termin lohnt.',
    publishedAt: '2026-11-09',
    updatedAt: '2026-11-09',
    readingTime: '4 Min.',
    category: 'Barber Koblenz',
  },
  {
    slug: 'barbershop-koblenz-altstadt-anfahrt',
    title: 'Barbershop in der Koblenzer Altstadt: Anfahrt, Parken & Ablauf',
    excerpt:
      'Adresse, Parkmöglichkeiten am Peter-Altmeier-Ufer und im Parkhaus Görresplatz und alles, was du vor deinem Besuch bei VIP FADES wissen solltest.',
    publishedAt: '2026-11-09',
    updatedAt: '2026-11-09',
    readingTime: '3 Min.',
    category: 'Barber Koblenz',
  },
  {
    slug: 'barber-koblenz',
    title: 'Barber in Koblenz: Woran erkennst du einen guten Barbershop?',
    excerpt:
      'Beratung, Fade-Technik, Hygiene, Bewertungen und Online-Buchung: Diese Checkliste hilft dir, in Koblenz den Barber zu finden, der zu dir passt.',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-06',
    readingTime: '6 Min.',
    category: 'Barber Koblenz',
  },
  {
    slug: 'low-mid-high-fade',
    title: 'Low, Mid oder High Fade: Welche Fade-Höhe passt zu dir?',
    excerpt:
      'Wo der Übergang beginnt, wie er wirkt und welche Fade-Höhe zu Kopfform, Alltag und Stil passt – verständlich erklärt vom Barber.',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-06',
    readingTime: '6 Min.',
    category: 'Haarschnitt & Fade',
  },
  {
    slug: 'herrenhaarschnitt-preis-koblenz',
    title: 'Herrenhaarschnitt in Koblenz: Was beeinflusst den Preis?',
    excerpt:
      'Fade, Bart, Styling oder Paket: Welche Faktoren den Preis beim Barber bestimmen und wo du die aktuellen Preise von VIP FADES findest.',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-06',
    readingTime: '5 Min.',
    category: 'Preise & Leistungen',
  },
  {
    slug: 'fade-mit-locken',
    title: 'Fade mit Locken: So wirkt der Curly Fade richtig',
    excerpt:
      'Welche Fade-Höhe zu lockigem Haar passt, wie viel Länge oben bleiben sollte und wie du deine Locken nach dem Schnitt richtig pflegst.',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-06',
    readingTime: '6 Min.',
    category: 'Haarschnitt & Fade',
  },
  {
    slug: 'grooming-fuer-maenner',
    title: 'Grooming für Männer: Augenbrauen, Gesichtsreinigung & Heißwachs',
    excerpt:
      'Mehr als nur ein Haarschnitt: Welche Grooming-Leistungen beim Barber sinnvoll sind und wie du sie mit Haarschnitt und Bart kombinierst.',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-06',
    readingTime: '5 Min.',
    category: 'Grooming',
  },
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
