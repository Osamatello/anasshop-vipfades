import type { Service } from '@/lib/data';

/** Informational anchors only; these are not booking IDs or booking selection values. */
const ANCHORS: Record<string, string> = {
  haircut: 'herrenhaarschnitt', beard: 'bart-trimmen', 'haircut-beard': 'haarschnitt-bart',
  eyebrows: 'augenbrauen', facial: 'gesichtsreinigung', hotwax: 'heisswachs', 'ears-nose': 'ohren-nase',
};

// Preserve the currently rendered marketing descriptions without modifying the catalogue.
const DESCRIPTIONS: Record<string, string> = {
  'haircut-beard': 'Das komplette Grooming-Erlebnis: präziser Haarschnitt, detaillierte Bartkonturen, saubere Linien und ein perfektes Finish.',
  eyebrows: 'Saubere und präzise Augenbrauenpflege für eine natürliche, ausgeglichene und klar definierte Form.',
  'ears-nose': 'Schnelle und präzise Entfernung unerwünschter Haare an Ohren und Nase für ein sauberes, gepflegtes Finish.',
};

export const serviceAnchor = (service: Service) => ANCHORS[service.id] ?? service.id;
export const serviceDescription = (service: Service) => DESCRIPTIONS[service.id] ?? service.description;
