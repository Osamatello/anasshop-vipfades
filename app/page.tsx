'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ShopExperience from '@/components/ShopExperience';
import Statistics from '@/components/Statistics';
import Barbers from '@/components/Barbers';
import ClientExperiences from '@/components/ClientExperiences';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import { useReveal } from '@/lib/use-reveal';

export default function Home() {
  useReveal();

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <Hero />
      <Services />
      <ShopExperience />
      <Statistics />
      <Barbers />
      <ClientExperiences />
      <Contact />
      <Footer />
      <FloatingChat />
    </main>
  );
}