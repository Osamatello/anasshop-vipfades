'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Leistungen', href: '#services' },
  { label: 'Erlebnis', href: '#experience' },
  { label: 'VIP Look', href: '#vip-look' },
  { label: 'Barber', href: '#barbers' },
  { label: 'Besuch', href: '#contact' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

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

    if (href.startsWith('/')) {
      router.push(href);
      return;
    }

    if (pathname === '/') {
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: 'smooth' });

      return;
    }

    router.push(`/${href}`);
  };

  const handleBrandClick = () => {
    setOpen(false);

    if (pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    router.push('/');
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled
        ? 'border-b border-brand-border bg-brand-bg/90 py-3 backdrop-blur-xl'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        {/* Brand */}
        <button
          type="button"
          onClick={handleBrandClick}
          className="flex items-center gap-3"
          aria-label="VIP FADES BY ANAS Startseite"
        >
          <Image
            src="/images/favicon.png"
            alt="VIP FADES"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="flex flex-col items-start">
            <span className="font-serif text-[22px] font-semibold leading-none tracking-[0.04em] text-brand-textPrimary">
              VIP FADES
            </span>

            <span className="mt-1 text-[10px] uppercase tracking-[0.32em] text-brand-cream">
              BY ANAS
            </span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="relative pb-1 text-[15px] font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:text-brand-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brand-cream after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop booking CTA */}
          <button
            type="button"
            onClick={() => handleNav('/booking')}
            className="hidden rounded-full border border-brand-cream bg-brand-cream px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary lg:inline-flex"
          >
            Termin buchen
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-cream/40 text-brand-cream transition-colors hover:border-brand-cream hover:text-brand-textPrimary lg:hidden"
            aria-label="Menü öffnen oder schließen"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${open
          ? 'max-h-96 border-b border-brand-border bg-brand-bg/95'
          : 'max-h-0'
          }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-4">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream"
            >
              {link.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleNav('/booking')}
            className="mt-3 rounded-full border border-brand-cream bg-brand-cream px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary"
          >
            Termin buchen
          </button>

        </nav>
      </div>
    </header>
  );
}