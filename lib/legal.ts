import { BUSINESS } from '@/lib/data';

/**
 * Owner details for the Impressum and Datenschutzerklärung.
 * Empty values are not shown on the pages; fill them in once the owner confirms them.
 */
export const LEGAL = {
  ownerName: '', // TODO: Vor- und Nachname des Inhabers
  businessName: BUSINESS.name,
  legalForm: '', // TODO: Rechtsform, z. B. Einzelunternehmen
  street: 'An der Moselbrücke 9',
  postalCity: '56068 Koblenz',
  country: 'Deutschland',
  phone: BUSINESS.phoneFormatted,
  email: 'vipfadeskoplenz@gmail.com',
  vatId: '', // TODO: USt-IdNr. eintragen, falls vorhanden; leer lassen, wenn keine
  chamber: '', // TODO: zuständige Handwerkskammer
  profession: '', // TODO: Berufsbezeichnung
  bookingRetention: '', // TODO: Speicherdauer der Buchungsdaten
  updated: 'November 2026',
};

/** True while any owner detail is still missing. */
export const LEGAL_HAS_TODOS = Object.values(LEGAL).some((value) => value === '');
