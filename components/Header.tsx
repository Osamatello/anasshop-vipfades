'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Signature Cuts', href: '#services' },
  { label: 'The VIP Experience', href: '#experience' },
  { label: 'The Artists', href: '#barbers' },
  { label: 'Booking', href: '#booking' },
  { label: 'Visit', href: '#contact' },
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
          ? 'bg-brand-bg/90 backdrop-blur-xl border-b border-brand-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3"
          aria-label="VIP FADES BY ANAS home"
        >
          <div className="relative h-12 w-12 flex items-center justify-center rounded-full ring-1 ring-brand-cream/30">
            <img
              src="/images/logo_no_background.png"
              alt="VIP FADES logo"
              className="h-full w-full object-contain p-0.5"
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-lg font-semibold tracking-wide text-brand-textPrimary">
              VIP FADES
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-cream">
              by Anas
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="relative pb-1 text-[13px] font-medium uppercase tracking-[0.18em] text-brand-textSecondary transition-colors hover:text-brand-textPrimary after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('#booking')}
            className="hidden items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-textPrimary transition-all hover:bg-brand-hover border border-brand-accent/20 sm:flex"
          >
            <Scissors className="h-4 w-4" />
            Book Appointment
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-textPrimary lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          open ? 'max-h-96 bg-brand-bg/95 border-b border-brand-border' : 'max-h-0'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-4">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-textPrimary"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#booking')}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-textPrimary border border-brand-accent/20 hover:bg-brand-hover transition-all"
          >
            <Scissors className="h-4 w-4" />
            Book Appointment
          </button>
        </nav>
      </div>
    </header>
  );
}
