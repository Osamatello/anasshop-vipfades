'use client';

import Services from '@/components/Services';
import { useReveal } from '@/lib/use-reveal';

export default function LeistungenContent() {
  useReveal();
  return <Services fullCatalogue />;
}
