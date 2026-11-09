import ArticleTemplate, {
  InlineLink,
  buildArticleMetadata,
  type ArticleContent,
} from '@/components/ArticleTemplate';

const content: ArticleContent = {
  slug: 'barber-koblenz-ohne-termin',
  seoTitle: 'Barber Koblenz ohne Termin: Walk-in bei VIP FADES | Barbershop Koblenz',
  seoDescription:
    'Spontan zum Barber in Koblenz? Bei VIP FADES sind Walk-ins täglich von 10 bis 19 Uhr willkommen. So läuft dein Besuch ohne Termin ab – und wann sich Online-Buchung lohnt.',
  titleLine1: 'Barber in Koblenz ohne Termin:',
  titleLine2: 'So klappt dein Walk-in',
  intro:
    'Du brauchst kurzfristig einen frischen Schnitt und willst nicht tagelang auf einen Termin warten? Bei VIP FADES in der Koblenzer Altstadt kannst du einfach vorbeikommen. Hier erfährst du, wie ein Besuch ohne Termin abläuft.',
  breadcrumbName: 'Barber Koblenz ohne Termin',
  sections: [
    {
      kind: 'text',
      id: 'walk-in-moeglich',
      heading: 'Kann ich bei VIP FADES ohne Termin vorbeikommen?',
      lead:
        'Ja. VIP FADES hat täglich von 10:00 bis 19:00 Uhr geöffnet, und Walk-ins sind jeden Tag willkommen.',
      paragraphs: [
        'Du musst dich vorher weder anmelden noch anrufen. Komm einfach in den Laden An der Moselbrücke 9 in Koblenz, sag kurz, welche Leistung du möchtest, und du wirst drangenommen, sobald ein Barber frei ist.',
        'Gerade für einen schnellen Nachschnitt, das Bart trimmen oder wenn du spontan einen frischen Look brauchst, ist ein Walk-in oft die einfachste Lösung.',
      ],
    },
    {
      kind: 'steps',
      id: 'ablauf',
      heading: 'So läuft dein Besuch ohne Termin ab',
      steps: [
        {
          title: 'Vorbeikommen',
          text: 'Komm während der Öffnungszeiten zwischen 10:00 und 19:00 Uhr in den Shop An der Moselbrücke 9.',
        },
        {
          title: 'Leistung nennen',
          text: (
            <>
              Sag, ob du einen Haarschnitt, Bart oder beides möchtest. Alle Leistungen und Preise
              findest du vorab auf der <InlineLink href="/leistungen">Leistungsseite</InlineLink>.
            </>
          ),
        },
        {
          title: 'Kurz beraten lassen',
          text: 'Dein Barber bespricht mit dir Länge, Fade-Höhe und Konturen, bevor er loslegt.',
        },
        {
          title: 'Bar bezahlen',
          text: 'Bei VIP FADES ist nur Barzahlung möglich. Bring also bitte Bargeld mit.',
        },
      ],
    },
    {
      kind: 'cards',
      id: 'walk-in-oder-termin',
      heading: 'Walk-in oder Online-Termin: Was passt zu dir?',
      cards: [
        {
          title: 'Walk-in',
          text: 'Ideal, wenn du flexibel bist und spontan vorbeikommen möchtest. Täglich von 10:00 bis 19:00 Uhr möglich.',
        },
        {
          title: 'Online-Termin',
          text: 'Ideal, wenn du eine feste Uhrzeit und deinen Wunsch-Barber sichern möchtest. Online-Termine gibt es Montag bis Donnerstag von 10:00 bis 19:00 Uhr.',
        },
        {
          title: 'Wunsch-Barber',
          text: 'Wenn du unbedingt bei Anas oder Abd sitzen möchtest, ist ein Online-Termin die sicherere Wahl.',
        },
      ],
    },
    {
      kind: 'summary',
      id: 'tipps',
      heading: 'Tipps für deinen Besuch ohne Termin',
      points: [
        'Bargeld mitbringen – Kartenzahlung ist nicht möglich.',
        'Ein Foto deines Wunsch-Looks auf dem Handy hilft bei der Beratung.',
        'Für einen festen Termin mit deinem Wunsch-Barber lieber online buchen (Mo–Do).',
        'Parken kannst du am Peter-Altmeier-Ufer oder im Parkhaus Görresplatz, rund 3 Gehminuten entfernt.',
      ],
    },
    {
      kind: 'text',
      id: 'online-buchen',
      heading: 'Lieber mit Termin? So buchst du online',
      paragraphs: [
        <>
          Über die <InlineLink href="/booking">Online-Buchung</InlineLink> wählst du Leistung, Barber
          und eine freie Uhrzeit. Musst du doch absagen, kannst du deinen Termin dort auch selbst
          stornieren.
        </>,
        <>
          Wie oft ein Nachschnitt sinnvoll ist, liest du im Artikel{' '}
          <InlineLink href="/artikel/wie-oft-zum-barber">Wie oft sollte man zum Barber gehen?</InlineLink>
        </>,
      ],
    },
  ],
  faqHeading: 'Häufige Fragen zum Barber ohne Termin',
  faq: [
    {
      question: 'Brauche ich bei VIP FADES in Koblenz einen Termin?',
      answer:
        'Nein. VIP FADES hat täglich von 10:00 bis 19:00 Uhr geöffnet und Walk-ins sind jeden Tag willkommen. Einen festen Termin kannst du zusätzlich online buchen.',
    },
    {
      question: 'An welchen Tagen kann ich online einen Termin buchen?',
      answer: 'Online-Termine gibt es von Montag bis Donnerstag zwischen 10:00 und 19:00 Uhr.',
    },
    {
      question: 'Kann ich bei VIP FADES mit Karte bezahlen?',
      answer: 'Nein, bei VIP FADES ist nur Barzahlung möglich.',
    },
    {
      question: 'Wo ist VIP FADES in Koblenz?',
      answer:
        'VIP FADES BY ANAS befindet sich An der Moselbrücke 9, 56068 Koblenz, in der Koblenzer Altstadt.',
    },
  ],
  ctaHeading: 'Spontan vorbeikommen oder Termin sichern',
  ctaText:
    'Komm täglich von 10 bis 19 Uhr ohne Termin vorbei – oder sichere dir Montag bis Donnerstag deinen Wunschtermin online.',
};

export const metadata = buildArticleMetadata(content);

export default function BarberKoblenzOhneTerminArticlePage() {
  return <ArticleTemplate content={content} />;
}
