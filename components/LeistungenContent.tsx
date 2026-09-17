'use client';

import LeistungenCatalogue from '@/components/LeistungenCatalogue';
import { useReveal } from '@/lib/use-reveal';

export default function LeistungenContent() {
  useReveal();
  return <LeistungenCatalogue />;
}
