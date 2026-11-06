import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'herrenhaarschnitt-preis-koblenz',
  seoTitle: 'Herrenhaarschnitt Preis Koblenz: Was beeinflusst die Kosten? | VIP FADES',
  seoDescription:
    'Was kostet ein Herrenhaarschnitt beim Barber in Koblenz? Welche Faktoren den Preis bestimmen – Fade, Bart, Styling, Pakete – und wo du aktuelle Preise findest.',
  titleLine1: 'Herrenhaarschnitt in Koblenz:',
  titleLine2: 'Was beeinflusst den Preis?',
  intro:
    'Preise für einen Herrenhaarschnitt unterscheiden sich je nach Leistung deutlich. Dieser Überblick erklärt, wofür du beim Barber bezahlst und wie du das passende Angebot für dich findest.',
  breadcrumbName: 'Herrenhaarschnitt Preis Koblenz',
  sections: [
    {
      kind: 'text',
      id: 'preis-ueberblick',
      heading: 'Wovon hängt der Preis eines Herrenhaarschnitts ab?',
      lead:
        'Der Preis richtet sich vor allem nach Aufwand und Zeit: Ein schlichter Maschinenschnitt ist schneller erledigt als ein Skin Fade mit Konturen, Bart und Styling.',
      paragraphs: [
        'Beim Barber zahlst du nicht nur für die Länge, die abgeschnitten wird, sondern für Beratung, Technik und Detailarbeit. Ein sauber ausgearbeiteter Fade braucht mehrere Durchgänge mit unterschiedlichen Aufsätzen und Werkzeugen.',
      ],
    },
    {
      kind: 'cards',
      id: 'preisfaktoren',
      heading: 'Die wichtigsten Preisfaktoren',
      cards: [
        {
          title: 'Art des Schnitts',
          text: 'Ein klassischer Herrenhaarschnitt ist meist günstiger als ein Premium-Schnitt mit aufwendigem Fade und Styling.',
        },
        {
          title: 'Zusatzleistungen',
          text: 'Bart trimmen, Augenbrauen, Gesichtsreinigung oder Heißwachs kommen einzeln dazu – oder sind in Paketen gebündelt.',
        },
        {
          title: 'Pakete',
          text: 'Kombinationen wie Haarschnitt + Bart oder VIP-Pakete bündeln mehrere Leistungen in einem Termin.',
        },
      ],
    },
    {
      kind: 'summary',
      id: 'spartipps',
      heading: 'So bekommst du das meiste für dein Geld',
      points: [
        'Haare und Bart in einem Termin buchen – das spart dir einen zweiten Besuch.',
        'Einen festen Rhythmus finden – ein gepflegter Fade lässt sich schneller nacharbeiten als ein komplett herausgewachsener.',
        'Online buchen, damit dein Barber genug Zeit für deinen Schnitt eingeplant hat.',
        'Vorher klären, was im Preis enthalten ist, zum Beispiel Waschen oder Styling.',
      ],
    },
    {
      kind: 'text',
      id: 'preise-vip-fades',
      heading: 'Aktuelle Preise bei VIP FADES in Koblenz',
      paragraphs: [
        'Bei VIP FADES BY ANAS kannst du zwischen Herrenhaarschnitt, Premium Haarschnitt & Styling, Bart trimmen und der Kombination Haarschnitt + Bart wählen. Dazu kommen Grooming-Leistungen wie Augenbrauen, Gesichtsreinigung, Heißwachs sowie Ohren & Nase und VIP-Pakete.',
        <>
          Alle aktuellen Preise und Dauer jeder Leistung siehst du transparent auf der{' '}
          <InlineLink href="/leistungen">Leistungsseite</InlineLink>. Dort kannst du direkt weiter
          zur <InlineLink href="/booking">Online-Buchung</InlineLink>.
        </>,
      ],
    },
    {
      kind: 'text',
      id: 'billig-vs-qualitaet',
      heading: 'Lohnt sich ein teurerer Schnitt?',
      paragraphs: [
        'Ein günstiger Schnitt kann gut sein – entscheidend ist, ob Übergänge gleichmäßig sind und der Look ein paar Wochen hält. Ein sauber gesetzter Fade wächst gleichmäßiger heraus und sieht länger gepflegt aus.',
        <>
          Wie oft ein Nachschnitt sinnvoll ist, erfährst du im Artikel{' '}
          <InlineLink href="/artikel/wie-oft-zum-barber">Wie oft sollte man zum Barber gehen?</InlineLink>
        </>,
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zu Preisen beim Barber',
  faq: [
    {
      question: 'Was kostet ein Herrenhaarschnitt bei VIP FADES in Koblenz?',
      answer:
        'Die aktuellen Preise für alle Haarschnitte, Bartleistungen und Pakete findest du auf der Leistungsseite von VIP FADES unter vip-fades.com/leistungen.',
    },
    {
      question: 'Kann ich Haarschnitt und Bart in einem Termin buchen?',
      answer:
        'Ja. Haarschnitt + Bart ist bei VIP FADES als eigene Leistung buchbar, sodass beides in einem Termin erledigt wird.',
    },
    {
      question: 'Warum kostet ein Fade mehr als ein einfacher Schnitt?',
      answer:
        'Ein Fade braucht mehr Zeit und Präzision: Der Übergang wird in mehreren Stufen ausgearbeitet und die Konturen werden sauber nachgezogen.',
    },
    {
      question: 'Kann ich vorher sehen, wie lange eine Leistung dauert?',
      answer: 'Ja. Bei der Online-Buchung und auf der Leistungsseite steht zu jeder Leistung die geplante Dauer.',
    },
  ],
  ctaHeading: 'Preise ansehen und Termin sichern',
  ctaText:
    'Wähle deine Leistung, sieh Preis und Dauer auf einen Blick und buche deinen Termin in Koblenz online.',
};

export const metadata = buildArticleMetadata(content);

export default function HerrenhaarschnittPreisKoblenzArticlePage() {
  return <ArticleTemplate content={content} />;
}
