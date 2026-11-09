import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'barbershop-koblenz-altstadt-anfahrt',
  seoTitle: 'Barbershop Koblenz Altstadt: Anfahrt & Parken | VIP FADES',
  seoDescription:
    'So findest du VIP FADES in der Koblenzer Altstadt: Adresse An der Moselbrücke 9, Parken am Peter-Altmeier-Ufer oder im Parkhaus Görresplatz und alles, was du vor deinem Besuch wissen solltest.',
  titleLine1: 'Barbershop in der Koblenzer Altstadt:',
  titleLine2: 'Anfahrt, Parken & Ablauf',
  intro:
    'VIP FADES liegt mitten in der Koblenzer Altstadt, direkt an der Moselbrücke. Damit dein Besuch entspannt beginnt, findest du hier Adresse, Parkmöglichkeiten und die wichtigsten Infos auf einen Blick.',
  breadcrumbName: 'Barbershop Koblenz Altstadt',
  sections: [
    {
      kind: 'text',
      id: 'adresse',
      heading: 'Wo befindet sich VIP FADES?',
      lead: 'Die Adresse lautet: An der Moselbrücke 9, 56068 Koblenz.',
      paragraphs: [
        'Der Barbershop liegt in der Koblenzer Altstadt, nahe der Mosel. Wenn du dein Navi oder Google Maps nutzt, gib einfach „VIP Fades Barbershop Koblenz“ oder die Adresse ein.',
      ],
    },
    {
      kind: 'cards',
      id: 'parken',
      heading: 'Parken in der Nähe',
      cards: [
        {
          title: 'Peter-Altmeier-Ufer',
          text: 'Günstige Parkmöglichkeiten gibt es direkt am Peter-Altmeier-Ufer an der Mosel.',
        },
        {
          title: 'Parkhaus Görresplatz',
          text: 'Das Parkhaus Görresplatz ist rund 3 Gehminuten vom Barbershop entfernt.',
        },
      ],
    },
    {
      kind: 'summary',
      id: 'vor-dem-besuch',
      heading: 'Gut zu wissen vor deinem Besuch',
      points: [
        'Geöffnet ist täglich von 10:00 bis 19:00 Uhr.',
        'Walk-ins sind jeden Tag willkommen – ein Termin ist nicht nötig.',
        'Online-Termine gibt es Montag bis Donnerstag von 10:00 bis 19:00 Uhr.',
        'Bezahlt wird nur bar – bitte Bargeld mitbringen.',
      ],
    },
    {
      kind: 'text',
      id: 'leistungen',
      heading: 'Was dich im Shop erwartet',
      paragraphs: [
        'Bei VIP FADES bekommst du Herrenhaarschnitte, präzise Fades, Bartpflege und Premium Haarschnitt & Styling. Dazu kommen Grooming-Leistungen wie Augenbrauen, Gesichtsreinigung, Heißwachs sowie Ohren & Nase.',
        <>
          Alle Preise und die Dauer jeder Leistung findest du auf der{' '}
          <InlineLink href="/leistungen">Leistungsseite</InlineLink>. Wenn du spontan kommen
          möchtest, lies vorher kurz{' '}
          <InlineLink href="/artikel/barber-koblenz-ohne-termin">Barber in Koblenz ohne Termin</InlineLink>
          .
        </>,
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zur Anfahrt',
  faq: [
    {
      question: 'Wie lautet die Adresse von VIP FADES in Koblenz?',
      answer: 'VIP FADES BY ANAS befindet sich An der Moselbrücke 9, 56068 Koblenz.',
    },
    {
      question: 'Wo kann ich bei VIP FADES parken?',
      answer:
        'Günstige Parkmöglichkeiten gibt es direkt am Peter-Altmeier-Ufer sowie im rund 3 Gehminuten entfernten Parkhaus Görresplatz.',
    },
    {
      question: 'Wann hat VIP FADES geöffnet?',
      answer:
        'VIP FADES hat täglich von 10:00 bis 19:00 Uhr geöffnet. Online-Termine gibt es Montag bis Donnerstag.',
    },
    {
      question: 'Kann ich bei VIP FADES mit Karte zahlen?',
      answer: 'Nein, bei VIP FADES ist nur Barzahlung möglich.',
    },
  ],
  ctaHeading: 'Route planen und vorbeikommen',
  ctaText:
    'Komm täglich von 10 bis 19 Uhr in die Koblenzer Altstadt – mit oder ohne Termin.',
};

export const metadata = buildArticleMetadata(content);

export default function BarbershopKoblenzAltstadtAnfahrtArticlePage() {
  return <ArticleTemplate content={content} />;
}
