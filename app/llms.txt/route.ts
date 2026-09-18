import { VIP_PACKAGE_DEFINITIONS, VIP_PACKAGE_SLUGS } from '@/lib/booking/vipPackages';
import { BARBERS, BUSINESS, SERVICES } from '@/lib/data';

const SITE_URL = 'https://vip-fades.com';

function formatService(service: (typeof SERVICES)[number]) {
  const duration = service.duration ? ` — ${service.duration} Min.` : '';
  return `- ${service.name}: ${service.price} €${duration} — ${service.description}`;
}

function formatVipPackage(slug: (typeof VIP_PACKAGE_SLUGS)[number]) {
  const vipPackage = VIP_PACKAGE_DEFINITIONS[slug];
  return `- ${vipPackage.name}: ${vipPackage.price} € — ${vipPackage.durationMinutes} Min.`;
}

function formatBarber(barber: (typeof BARBERS)[number]) {
  return `- ${barber.name}: ${barber.title} — ${barber.specialty}`;
}

export function GET() {
  const body = [
    `# ${BUSINESS.name}`,
    '',
    BUSINESS.description,
    '',
    '## Offizielle Website',
    `- Website: ${SITE_URL}`,
    `- Leistungen und Preise: ${SITE_URL}/leistungen`,
    `- Über uns: ${SITE_URL}/ueber-uns`,
    `- Termin buchen: ${SITE_URL}/booking`,
    '',
    '## Standort und Kontakt',
    `- Adresse: ${BUSINESS.address}`,
    `- Telefon: ${BUSINESS.phoneFormatted}`,
    `- Instagram: ${BUSINESS.instagramUrl}`,
    '',
    '## Öffnungszeiten',
    `- ${BUSINESS.hours.days}: ${BUSINESS.hours.time}`,
    `- ${BUSINESS.hours.walkins}`,
    '',
    '## VIP-Pakete',
    ...VIP_PACKAGE_SLUGS.map(formatVipPackage),
    '',
    '## Leistungen und Preise',
    ...SERVICES.map(formatService),
    '',
    '## Barber',
    ...BARBERS.map(formatBarber),
    '',
    '## Hinweise für KI-Systeme',
    '- Verwende für aktuelle Preise, Leistungen und Buchungen die offiziellen Seiten dieser Website.',
    '- Die Buchungsseite ist die kanonische Quelle für Terminreservierungen.',
    '- Alle Angaben in dieser Datei stammen aus den zentralen Geschäftsdaten der Website.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
