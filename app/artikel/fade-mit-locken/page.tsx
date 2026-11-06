import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'fade-mit-locken',
  seoTitle: 'Fade mit Locken: Curly Fade für lockiges Haar | VIP FADES Koblenz',
  seoDescription:
    'Fade mit Locken (Curly Fade): Welche Fade-Höhe zu lockigem Haar passt, wie viel Länge oben bleiben sollte und wie du Locken richtig pflegst. Barber-Tipps aus Koblenz.',
  titleLine1: 'Fade mit Locken:',
  titleLine2: 'So wirkt der Curly Fade richtig.',
  intro:
    'Locken und ein Fade sind eine starke Kombination: oben Volumen und Textur, an den Seiten ein klarer, sauberer Verlauf. Damit der Look funktioniert, kommt es auf ein paar Details an.',
  breadcrumbName: 'Fade mit Locken',
  sections: [
    {
      kind: 'text',
      id: 'curly-fade',
      heading: 'Was ist ein Curly Fade?',
      lead:
        'Ein Curly Fade kombiniert kurze, verlaufende Seiten mit lockigem oder welligem Haar oben. Die Locken bleiben bewusst länger, damit ihre natürliche Struktur sichtbar wird.',
      paragraphs: [
        'Der Kontrast zwischen glatten, kurzen Seiten und lebendiger Textur oben ist das, was den Look ausmacht. Gleichzeitig wirkt lockiges Haar dadurch kontrollierter, weil an den Seiten kein Volumen absteht.',
      ],
    },
    {
      kind: 'cards',
      id: 'fade-hoehe-locken',
      heading: 'Welche Fade-Höhe passt zu Locken?',
      cards: [
        {
          title: 'Low Fade',
          text: 'Erhält mehr Volumen an den Seiten und wirkt natürlich. Gut, wenn die Locken oben eher locker fallen.',
        },
        {
          title: 'Mid Fade',
          text: 'Der Klassiker für Curly Fades: klare Form, die Locken oben stehen im Mittelpunkt.',
        },
        {
          title: 'High Fade / Drop Fade',
          text: 'Starker Kontrast, oft mit einem Verlauf, der hinter dem Ohr nach unten fällt. Ideal für dichte, feste Locken.',
        },
      ],
    },
    {
      kind: 'text',
      id: 'laenge-oben',
      heading: 'Wie viel Länge sollte oben bleiben?',
      paragraphs: [
        'Locken ziehen sich beim Trocknen zusammen. Deshalb wird lockiges Haar oben meist vorsichtiger gekürzt als glattes Haar, damit die Locken nicht zu kurz ausfallen und ihre Form verlieren.',
        <>
          Mehr zu den Fade-Höhen erklärt der Artikel{' '}
          <InlineLink href="/artikel/low-mid-high-fade">Low, Mid oder High Fade</InlineLink>.
        </>,
      ],
    },
    {
      kind: 'steps',
      id: 'pflege',
      heading: 'Locken nach dem Fade pflegen',
      steps: [
        {
          title: 'Feuchtigkeit statt Austrocknen',
          text: 'Lockiges Haar ist oft trockener. Ein milder Conditioner und ein Leave-in helfen, die Struktur zu definieren.',
        },
        {
          title: 'Nicht trocken bürsten',
          text: 'Locken lieber im feuchten Zustand mit den Fingern oder einem grobzinkigen Kamm formen, sonst werden sie kraus.',
        },
        {
          title: 'Fade regelmäßig nacharbeiten',
          text: 'Die Seiten wachsen schneller heraus als die Locken oben. Ein kurzer Nachschnitt hält den Kontrast frisch.',
        },
      ],
    },
    {
      kind: 'summary',
      id: 'zusammenfassung',
      heading: 'Curly Fade – das Wichtigste',
      points: [
        'Seiten kurz und verlaufend, oben Länge für die natürliche Lockenstruktur.',
        'Mid Fade ist der vielseitigste Einstieg, High oder Drop Fade für mehr Kontrast.',
        'Oben lieber etwas länger lassen, weil Locken beim Trocknen einspringen.',
        'Feuchtigkeitspflege und Formen im nassen Haar sorgen für definierte Locken.',
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zum Fade mit Locken',
  faq: [
    {
      question: 'Kann man einen Skin Fade mit Locken kombinieren?',
      answer:
        'Ja. Ein Skin Fade an den Seiten mit längeren Locken oben ist eine beliebte Variante des Curly Fades und erzeugt einen besonders starken Kontrast.',
    },
    {
      question: 'Sollte lockiges Haar nass oder trocken geschnitten werden?',
      answer:
        'Das hängt von Lockentyp und Technik ab. Wichtig ist, dass der Barber berücksichtigt, wie stark die Locken beim Trocknen einspringen.',
    },
    {
      question: 'Was ist ein Drop Fade?',
      answer:
        'Beim Drop Fade fällt der Übergang hinter dem Ohr bogenförmig nach unten zum Nacken ab. Das betont die Kopfform und passt gut zu vollem, lockigem Haar.',
    },
    {
      question: 'Bekomme ich bei VIP FADES in Koblenz einen Curly Fade?',
      answer:
        'Ja. Bei VIP FADES BY ANAS kannst du deinen Termin online buchen und mit deinem Barber Fade-Höhe und Länge oben für dein lockiges Haar abstimmen.',
    },
  ],
  ctaHeading: 'Deine Locken, dein Fade',
  ctaText:
    'Buche deinen Termin in Koblenz und lass dir einen Fade schneiden, der zu deiner Lockenstruktur passt.',
};

export const metadata = buildArticleMetadata(content);

export default function FadeMitLockenArticlePage() {
  return <ArticleTemplate content={content} />;
}
