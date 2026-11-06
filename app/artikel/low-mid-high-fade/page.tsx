import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'low-mid-high-fade',
  seoTitle: 'Low Fade, Mid Fade oder High Fade? Unterschiede erklärt | VIP FADES',
  seoDescription:
    'Low Fade, Mid Fade, High Fade: Wo der Übergang beginnt, wie er wirkt und welche Fade-Höhe zu Kopfform und Stil passt. Barber-Ratgeber aus Koblenz.',
  titleLine1: 'Low, Mid oder High Fade:',
  titleLine2: 'Welche Fade-Höhe passt zu dir?',
  intro:
    'Die Höhe des Fades verändert die Wirkung eines Haarschnitts mehr als fast jedes andere Detail. Hier erfährst du, wie sich Low, Mid und High Fade unterscheiden und wie du die richtige Variante wählst.',
  breadcrumbName: 'Low, Mid oder High Fade',
  sections: [
    {
      kind: 'text',
      id: 'fade-hoehe',
      heading: 'Was bedeutet die Fade-Höhe?',
      lead:
        'Die Fade-Höhe beschreibt, an welcher Stelle der Seiten der kürzeste Bereich in längeres Haar übergeht. Je höher der Fade beginnt, desto mehr Kopfhaut ist sichtbar und desto stärker ist der Kontrast.',
      paragraphs: [
        'Als grobe Orientierung dienen Ohr und Schläfe: Ein Low Fade bleibt knapp über dem Ohr, ein Mid Fade läuft etwa auf Schläfenhöhe aus, ein High Fade beginnt deutlich darüber. Die genaue Linie wird beim Schnitt an deine Kopfform angepasst.',
      ],
    },
    {
      kind: 'cards',
      id: 'varianten',
      heading: 'Die drei Fade-Varianten im Vergleich',
      cards: [
        {
          title: 'Low Fade',
          text: 'Der Übergang sitzt tief an Ohr und Nacken. Wirkt dezent und gepflegt, passt gut ins Büro und wächst unauffällig heraus.',
        },
        {
          title: 'Mid Fade',
          text: 'Der Allrounder: deutlich sichtbarer Kontrast, aber noch ausgewogen. Funktioniert mit kurzem und mittellangem Haar oben.',
        },
        {
          title: 'High Fade',
          text: 'Maximaler Kontrast mit sehr kurzen Seiten. Wirkt markant und sportlich, braucht aber häufiger einen Nachschnitt.',
        },
      ],
    },
    {
      kind: 'summary',
      id: 'auf-einen-blick',
      heading: 'Fade-Höhe auf einen Blick',
      points: [
        'Low Fade: dezent, alltagstauglich, längere Abstände zwischen den Terminen möglich.',
        'Mid Fade: klarer Kontrast, vielseitig, die häufigste Wahl für den ersten Fade.',
        'High Fade: auffällig, betont Gesichtskonturen, wächst schneller sichtbar heraus.',
        'Jede Höhe lässt sich als Skin Fade (bis auf die Haut) oder weicher ausarbeiten.',
      ],
    },
    {
      kind: 'text',
      id: 'kopfform',
      heading: 'Welche Fade-Höhe passt zu welcher Kopfform?',
      paragraphs: [
        'Bei einem eher runden Gesicht kann ein höherer Fade mit mehr Volumen oben das Gesicht optisch strecken. Bei einem schmalen, länglichen Gesicht wirkt ein Low oder Mid Fade oft ausgewogener, weil an den Seiten mehr Breite bleibt.',
        <>
          Auch Wirbel, Narben oder ein unebener Hinterkopf spielen eine Rolle. Mehr dazu liest du im
          Guide{' '}
          <InlineLink href="/artikel/herrenhaarschnitt-gesichtsform">
            Welcher Herrenhaarschnitt passt zu welcher Gesichtsform?
          </InlineLink>
        </>,
      ],
    },
    {
      kind: 'text',
      id: 'skin-oder-nicht',
      heading: 'Low Skin Fade, Mid Skin Fade, High Skin Fade',
      paragraphs: [
        'Die Höhe sagt nur, wo der Übergang liegt. Ob der kürzeste Bereich bis auf die Haut geht, ist eine zweite Entscheidung. Ein „Mid Skin Fade“ beginnt also auf Schläfenhöhe und läuft unten bis auf die Haut aus.',
        <>
          Wie sich das vom weicheren Taper unterscheidet, erklärt der Artikel{' '}
          <InlineLink href="/artikel/skin-fade-vs-taper-fade">Skin Fade vs. Taper Fade</InlineLink>.
        </>,
      ],
    },
    {
      kind: 'steps',
      id: 'beim-barber',
      heading: 'So kommunizierst du die Fade-Höhe beim Barber',
      steps: [
        { title: 'Begriff nennen', text: 'Sag „Low“, „Mid“ oder „High“ und ob du einen Skin Fade möchtest.' },
        { title: 'Zeigen statt raten', text: 'Zeig mit dem Finger, wo der kürzeste Bereich enden soll.' },
        { title: 'Länge oben klären', text: 'Die Fade-Höhe wirkt nur im Zusammenspiel mit der Länge oben richtig.' },
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zu Low, Mid und High Fade',
  faq: [
    {
      question: 'Was ist der Unterschied zwischen Low Fade und Mid Fade?',
      answer:
        'Beim Low Fade beginnt der Übergang knapp über dem Ohr, beim Mid Fade etwa auf Schläfenhöhe. Der Mid Fade zeigt dadurch mehr Kontrast.',
    },
    {
      question: 'Welcher Fade ist am alltagstauglichsten?',
      answer:
        'Ein Low Fade wirkt am dezentesten und wächst am unauffälligsten heraus. Für viele ist er deshalb der beste Einstieg.',
    },
    {
      question: 'Wie oft muss ein High Fade nachgeschnitten werden?',
      answer:
        'Weil bei einem High Fade mehr Fläche sehr kurz ist, sieht man das Nachwachsen schneller. Wer ihn dauerhaft frisch tragen möchte, kommt meist häufiger zum Barber als bei einem Low Fade.',
    },
    {
      question: 'Kann ich die Fade-Höhe beim nächsten Termin ändern?',
      answer:
        'Ein Fade kann jederzeit höher gesetzt werden. Tiefer geht erst, wenn das Haar an den Seiten genug nachgewachsen ist.',
    },
  ],
  ctaHeading: 'Unsicher, welche Fade-Höhe zu dir passt?',
  ctaText:
    'Buche deinen Termin in Koblenz und entscheide gemeinsam mit deinem Barber über Höhe, Übergang und Länge oben.',
};

export const metadata = buildArticleMetadata(content);

export default function LowMidHighFadeArticlePage() {
  return <ArticleTemplate content={content} />;
}
