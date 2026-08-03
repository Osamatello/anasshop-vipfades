'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Barbers', href: '#barbers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-950/85 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3"
          aria-label="VIP FADES BY ANAS home"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold/40">
            <img
              src="/images/VIP_FADES_LOGO.jpeg"
              alt="VIP FADES logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-lg font-semibold tracking-wide text-warm">
              VIP FADES
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
              by Anas
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-[13px] font-medium uppercase tracking-[0.18em] text-warm/70 transition-colors hover:text-gold"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('#booking')}
            className="hidden items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-950 transition-all hover:bg-gold-light sm:flex"
          >
            <Scissors className="h-4 w-4" />
            Book Appointment
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-warm lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-4">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-warm/80 transition-colors hover:bg-white/5 hover:text-gold"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#booking')}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-ink-950"
          >
            <Scissors className="h-4 w-4" />
            Book Appointment
          </button>
        </nav>
      </div>
    </header>
  );
}
