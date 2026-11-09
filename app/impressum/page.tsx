import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPage from '@/components/LegalPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Impressum | VIP FADES BY ANAS',
  description: 'Impressum von VIP FADES BY ANAS, Barbershop in Koblenz.',
  alternates: { canonical: '/impressum' },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" updated={LEGAL.updated}>
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {LEGAL.businessName}
          <br />
          {LEGAL.ownerName && (
            <>
              Inhaber: {LEGAL.ownerName}
              <br />
            </>
          )}
          {LEGAL.legalForm && (
            <>
              {LEGAL.legalForm}
              <br />
            </>
          )}
          {LEGAL.street}
          <br />
          {LEGAL.postalCity}
          <br />
          {LEGAL.country}
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${LEGAL.phone.replace(/\s+/g, '')}`}>{LEGAL.phone}</a>
          <br />
          E-Mail: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </p>
      </section>

      {LEGAL.vatId && (
        <section>
          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {LEGAL.vatId}</p>
        </section>
      )}

      {(LEGAL.profession || LEGAL.chamber) && (
      <section>
        <h2>Berufsbezeichnung und berufsrechtliche Angaben</h2>
        <p>
          {LEGAL.profession && (
            <>
              Berufsbezeichnung: {LEGAL.profession}
              <br />
            </>
          )}
          {LEGAL.chamber && (
            <>
              Zuständige Kammer: {LEGAL.chamber}
              <br />
            </>
          )}
          Verliehen in: Deutschland
        </p>
        <p>
          Es gilt die Handwerksordnung (HwO), abrufbar unter{' '}
          <a href="https://www.gesetze-im-internet.de/hwo/" target="_blank" rel="noopener noreferrer">
            gesetze-im-internet.de
          </a>
          .
        </p>
      </section>
      )}

      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          {LEGAL.ownerName || LEGAL.businessName}
          <br />
          {LEGAL.street}, {LEGAL.postalCity}
        </p>
      </section>

      <section>
        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section>
        <h2>Haftung für Inhalte und Links</h2>
        <p>
          Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für die Inhalte externer Websites,
          auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden
          von Rechtsverletzungen entfernen wir entsprechende Inhalte oder Links umgehend.
        </p>
      </section>

      <p>
        Informationen zum Umgang mit deinen Daten findest du in unserer{' '}
        <Link href="/datenschutz">Datenschutzerklärung</Link>.
      </p>
    </LegalPage>
  );
}
