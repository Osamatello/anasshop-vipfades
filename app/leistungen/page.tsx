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
  openGraph: { title: 'Leistungen & Preise | VIP FADES BY ANAS', url: '/leistungen' },
};

export default function LeistungenPage() {
  return <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg pt-12">
    <PageAtmosphere />
    <div className="relative z-10">
    <Header />
    <LeistungenContent />
    <Footer />
    <FloatingChat />
    </div>
  </main>;
}
