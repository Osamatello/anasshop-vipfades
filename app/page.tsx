'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ShopExperience from '@/components/ShopExperience';
import Barbers from '@/components/Barbers';
import Gallery from '@/components/Gallery';
import BookingAssistant from '@/components/BookingAssistant';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import { useReveal } from '@/lib/use-reveal';

export default function Home() {
  useReveal();

  return (
    <main className="min-h-screen bg-ink-950">
      <Header />
      <Hero />
      <Services />
      <ShopExperience />
      <Barbers />
      <Gallery />
      <BookingAssistant />
      <Contact />
      <Footer />
      <FloatingChat />
    </main>
  );
}
