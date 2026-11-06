import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'grooming-fuer-maenner',
  seoTitle: 'Grooming für Männer in Koblenz: Augenbrauen, Gesichtsreinigung & Heißwachs | VIP FADES',
  seoDescription:
    'Männer-Grooming beim Barber in Koblenz: Augenbrauen zupfen, Gesichtsreinigung, Heißwachs und Ohren & Nase – was dahintersteckt und wann es sich lohnt.',
  titleLine1: 'Grooming für Männer:',
  titleLine2: 'Mehr als nur ein Haarschnitt.',
  intro:
    'Ein frischer Fade wirkt erst richtig, wenn das Gesamtbild stimmt. Augenbrauen, Haut und kleine Details machen oft den Unterschied – hier erfährst du, welche Grooming-Leistungen beim Barber sinnvoll sind.',
  breadcrumbName: 'Grooming für Männer',
  sections: [
    {
      kind: 'text',
      id: 'was-ist-grooming',
      heading: 'Was bedeutet Grooming für Männer?',
      lead:
        'Grooming beschreibt die gezielte Pflege von Gesicht, Bart und Haaren über den reinen Haarschnitt hinaus. Ziel ist ein gepflegtes, stimmiges Erscheinungsbild ohne großen Aufwand im Alltag.',
      paragraphs: [
        'Viele Männer lassen Haare und Bart regelmäßig machen, vergessen aber Augenbrauen, Haut oder störende Härchen an Ohren und Nase. Genau diese Details fallen im direkten Gespräch zuerst auf.',
      ],
    },
    {
      kind: 'cards',
      id: 'leistungen',
      heading: 'Die wichtigsten Grooming-Leistungen beim Barber',
      cards: [
        {
          title: 'Augenbrauen',
          text: 'Zupfen oder Konturieren bringt Ordnung ins Gesicht, ohne gemacht zu wirken. Die natürliche Form bleibt erhalten.',
        },
        {
          title: 'Gesichtsreinigung',
          text: 'Eine gründliche Reinigung befreit die Haut von Talg und Schmutz und fühlt sich nach dem Haarschnitt besonders frisch an.',
        },
        {
          title: 'Heißwachs',
          text: 'Entfernt Härchen an Wangen, Ohren oder Nase sauber und hält länger als Rasieren oder Trimmen.',
        },
      ],
    },
    {
      kind: 'text',
      id: 'kombinieren',
      heading: 'Grooming mit Haarschnitt und Bart kombinieren',
      paragraphs: [
        'Am effizientesten ist Grooming, wenn du es direkt mit deinem Haarschnitt oder Bart-Termin verbindest. So bist du in einem Termin komplett fertig und musst nicht separat planen.',
        <>
          Bei VIP FADES gibt es dafür auch VIP-Pakete, die mehrere Leistungen bündeln. Alle Optionen
          findest du auf der <InlineLink href="/leistungen">Leistungsseite</InlineLink>. Tipps zur
          Bartroutine liest du im Artikel{' '}
          <InlineLink href="/artikel/bart-richtig-pflegen">Bart richtig pflegen</InlineLink>.
        </>,
      ],
    },
    {
      kind: 'summary',
      id: 'wann-sinnvoll',
      heading: 'Wann sich Grooming besonders lohnt',
      points: [
        'Vor wichtigen Terminen wie Bewerbung, Hochzeit oder Fotoshooting.',
        'Wenn Augenbrauen zusammenwachsen oder stark unregelmäßig sind.',
        'Bei Härchen an Ohren und Nase, die beim Trimmen schnell nachwachsen.',
        'Als Abschluss nach dem Haarschnitt für ein rundum frisches Gefühl.',
      ],
    },
    {
      kind: 'steps',
      id: 'zuhause',
      heading: 'Einfache Grooming-Routine für zu Hause',
      steps: [
        { title: 'Gesicht täglich reinigen', text: 'Ein milder Reiniger morgens und abends reicht für die meisten Hauttypen.' },
        { title: 'Feuchtigkeit geben', text: 'Eine leichte Feuchtigkeitscreme beugt trockener Haut vor – gerade nach der Rasur.' },
        { title: 'Profi-Details beim Barber', text: 'Augenbrauen und Heißwachs lieber vom Profi machen lassen, damit die Form natürlich bleibt.' },
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zum Männer-Grooming',
  faq: [
    {
      question: 'Kann ich beim Barber in Koblenz meine Augenbrauen machen lassen?',
      answer:
        'Ja. Bei VIP FADES BY ANAS in Koblenz sind Augenbrauen als eigene Leistung buchbar und lassen sich mit Haarschnitt oder Bart kombinieren.',
    },
    {
      question: 'Tut Heißwachs weh?',
      answer:
        'Heißwachs ist meist angenehmer als Kaltwachs, weil es sich warm um die Härchen legt. Ein kurzes Ziepen beim Abziehen ist normal.',
    },
    {
      question: 'Wie oft sollte man eine Gesichtsreinigung machen lassen?',
      answer:
        'Das hängt vom Hauttyp ab. Viele kombinieren sie einfach mit ihrem regelmäßigen Barber-Termin.',
    },
    {
      question: 'Gibt es Grooming-Pakete bei VIP FADES?',
      answer:
        'Ja. Neben Einzelleistungen gibt es VIP-Pakete, die Haarschnitt, Bart und Grooming kombinieren. Details stehen auf der Leistungsseite.',
    },
  ],
  ctaHeading: 'Komplett frisch in einem Termin',
  ctaText:
    'Kombiniere Haarschnitt, Bart und Grooming und buche deinen Termin bei VIP FADES in Koblenz online.',
};

export const metadata = buildArticleMetadata(content);

export default function GroomingFuerMaennerArticlePage() {
  return <ArticleTemplate content={content} />;
}
