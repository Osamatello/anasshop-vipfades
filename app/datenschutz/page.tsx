import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPage from '@/components/LegalPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | VIP FADES BY ANAS',
  description: 'Datenschutzerklärung von VIP FADES BY ANAS, Barbershop in Koblenz.',
  alternates: { canonical: '/datenschutz' },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" updated={LEGAL.updated}>
      <section>
        <h2>1. Verantwortlicher</h2>
        <p>
          {LEGAL.businessName}
          {LEGAL.ownerName && `, Inhaber ${LEGAL.ownerName}`}
          <br />
          {LEGAL.street}, {LEGAL.postalCity}
          <br />
          Telefon: {LEGAL.phone} · E-Mail: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </p>
        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb dieser Website, die
          Online-Terminbuchung oder mit deiner Einwilligung erforderlich ist.
        </p>
      </section>

      <section>
        <h2>2. Hosting und Server-Logfiles</h2>
        <p>
          Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet.
          Beim Aufruf der Website verarbeitet Vercel technisch notwendige Daten wie IP-Adresse,
          Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem, um die Website
          auszuliefern und abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einem sicheren und stabilen Betrieb). Die Übermittlung in die USA erfolgt auf
          Grundlage des EU-US Data Privacy Framework bzw. der EU-Standardvertragsklauseln.
        </p>
      </section>

      <section>
        <h2>3. Online-Terminbuchung</h2>
        <p>
          Wenn du online einen Termin buchst, verarbeiten wir deinen Namen, deine Telefonnummer, die
          gewählte Leistung, den Barber sowie Datum und Uhrzeit des Termins. Diese Daten benötigen
          wir, um deinen Termin zu vereinbaren, durchzuführen und dir die Stornierung zu ermöglichen.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag bzw. vorvertragliche Maßnahmen).
        </p>
        <h3>Eingesetzte Dienstleister</h3>
        <ul>
          <li>
            <strong>Supabase</strong> (Supabase Inc., USA): Speicherung der Buchungsdaten in unserer
            Datenbank.
          </li>
          <li>
            <strong>Google Kalender</strong> (Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland): Eintrag des Termins mit Name und Telefonnummer in den Terminkalender
            unserer Barber.
          </li>
        </ul>
        <p>
          Mit diesen Anbietern bestehen bzw. gelten Auftragsverarbeitungsverträge. Soweit Daten in
          die USA übermittelt werden, erfolgt dies auf Grundlage des EU-US Data Privacy Framework bzw.
          der EU-Standardvertragsklauseln.
        </p>
        {LEGAL.bookingRetention && <p>Speicherdauer: {LEGAL.bookingRetention}.</p>}
        <h3>Stornierung</h3>
        <p>
          Zur Stornierung gibst du die bei der Buchung verwendete Telefonnummer ein. Wir zeigen dir
          damit nur deine eigenen kommenden Termine an.
        </p>
      </section>

      <section>
        <h2>4. Schutz vor Missbrauch</h2>
        <p>
          Um automatisierte Massenanfragen zu verhindern, zählen wir Buchungs- und Stornoanfragen pro
          IP-Adresse für kurze Zeit über den Dienst Upstash (Upstash Inc., USA). Die Zähler laufen
          nach kurzer Zeit automatisch ab. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse am Schutz der Buchung vor Missbrauch).
        </p>
      </section>

      <section>
        <h2>5. Google Analytics (nur mit Einwilligung)</h2>
        <p>
          Wenn du im Cookie-Banner auf „Akzeptieren“ klickst, nutzen wir Google Analytics 4 der Google
          Ireland Limited, um zu verstehen, wie unsere Website genutzt wird (z. B. aufgerufene
          Seiten, Herkunft der Besucher, abgeschlossene Buchungen ohne Namen oder Telefonnummer).
          Dabei werden Cookies gesetzt und Daten an Google übermittelt, ggf. auch in die USA.
        </p>
        <p>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Du
          kannst sie jederzeit über „Cookie-Einstellungen“ im Footer widerrufen. Ohne Einwilligung
          wird Google Analytics nicht geladen.
        </p>
      </section>

      <section>
        <h2>6. Vercel Web Analytics und Speed Insights</h2>
        <p>
          Wir nutzen die Reichweiten- und Leistungsmessung von Vercel. Dabei werden keine Cookies
          gesetzt und keine Besucher über mehrere Websites hinweg verfolgt; die Daten werden
          zusammengefasst ausgewertet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einer funktionierenden und schnellen Website).
        </p>
      </section>

      <section>
        <h2>7. Google Maps</h2>
        <p>
          Im Bereich „Besuch“ können wir eine Karte von Google Maps (Google Ireland Limited)
          anzeigen. Die Karte wird erst geladen, wenn du auf „Karte laden“ klickst; erst dann wird
          u. a. deine IP-Adresse an Google übermittelt, ggf. auch in die USA. Rechtsgrundlage ist
          deine Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Weitere
          Informationen
          findest du in der{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Google
          </a>
          .
        </p>
      </section>

      <section>
        <h2>8. Instagram</h2>
        <p>
          Die Videos im Bereich „Frisch aus dem Shop“ liegen auf unserem eigenen Server. Erst wenn du
          ein Video oder den Instagram-Link anklickst, wirst du zu Instagram (Meta Platforms Ireland
          Limited) weitergeleitet; ab dann gilt die Datenschutzerklärung von Meta.
        </p>
      </section>

      <section>
        <h2>9. Schriftarten und lokale Speicherung</h2>
        <p>
          Die verwendeten Schriftarten werden von unserem eigenen Server geladen; es besteht keine
          Verbindung zu Google Fonts. Deine Auswahl im Cookie-Banner speichern wir lokal in deinem
          Browser, damit wir dich nicht bei jedem Besuch erneut fragen.
        </p>
      </section>

      <section>
        <h2>10. Kontakt per Telefon oder E-Mail</h2>
        <p>
          Wenn du uns anrufst oder schreibst, verarbeiten wir deine Angaben, um deine Anfrage zu
          beantworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO).
        </p>
      </section>

      <section>
        <h2>11. Deine Rechte</h2>
        <p>Du hast das Recht auf</p>
        <ul>
          <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung (Art. 16 DSGVO) und Löschung (Art. 17 DSGVO),</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO),</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
        </ul>
        <p>
          Wende dich dafür einfach an die oben genannten Kontaktdaten. Außerdem kannst du dich bei
          einer Datenschutz-Aufsichtsbehörde beschweren, z. B. beim Landesbeauftragten für den
          Datenschutz und die Informationsfreiheit Rheinland-Pfalz.
        </p>
      </section>

      <p>
        Angaben zum Anbieter findest du im <Link href="/impressum">Impressum</Link>.
      </p>
    </LegalPage>
  );
}
