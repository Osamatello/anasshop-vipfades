import type { Metadata } from 'next';
import Header from '@/components/Header';
import PageAtmosphere from '@/components/PageAtmosphere';
import Footer from '@/components/Footer';
import LeistungenContent from '@/components/LeistungenContent';
import FloatingChat from '@/components/FloatingChat';

export const metadata: Metadata = {
  title: 'Leistungen & Preise | VIP FADES BY ANAS',
  description: 'Alle Leistungen und aktuellen Preise bei VIP FADES: VIP-Pakete, Haarschnitt, Bartpflege und Gesichtsreinigung in Koblenz.',
  alternates: { canonical: '/leistungen' },
  openGraph: {
    title: 'Leistungen & Preise | VIP FADES BY ANAS',
    description:
      'Entdecke alle Leistungen und Preise von VIP FADES BY ANAS in Koblenz – von Haarschnitt und Skin Fade bis Bartpflege, Gesichtsreinigung und VIP-Paketen.',
    url: '/leistungen',
    type: 'website',
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leistungen & Preise | VIP FADES BY ANAS',
    description:
      'Alle Leistungen und Preise von VIP FADES BY ANAS in Koblenz – Haarschnitt, Fade, Bartpflege und VIP-Pakete.',
    images: ['/images/og-image.png'],
  },
};

export default function LeistungenPage() {
  return <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg pt-12">
    <PageAtmosphere showRings />
    <div className="relative z-10">
    <Header />
    <LeistungenContent />
    <Footer />
    <FloatingChat />
    </div>
  </main>;
}
