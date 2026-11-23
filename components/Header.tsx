'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ARTICLES } from '@/lib/articles';
import { scrollToElement, scrollToTop } from '@/lib/smooth-scroll';

const NAV_LINKS = [
  { label: 'Leistungen', href: '/leistungen' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Erlebnis', href: '#experience' },
  { label: 'Reels', href: '#reels' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Besuch', href: '#contact' },
];

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [articlesOpen, setArticlesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);

    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section links are real links ("/#faq"), so crawlers can follow them.
  // On the home page they still scroll smoothly instead of jumping.
  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setOpen(false);
    if (pathname !== '/') return;
    event.preventDefault();
    scrollToElement(document.querySelector(hash));
  };

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== '/') return;
    event.preventDefault();
    scrollToTop();
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${open
        ? 'border-b border-brand-border bg-brand-bg py-5'
        : scrolled
          ? 'border-b border-brand-border bg-brand-bg/90 py-3 backdrop-blur-xl'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        {/* Brand */}
        <Link
          href="/"
          onClick={handleBrandClick}
          className="flex items-center gap-3"
          aria-label="VIP FADES BY ANAS Startseite"
        >
          <Image
            src="/images/favicon.png"
            alt="VIP FADES"
            width={48}
            height={48}
            sizes="48px"
            quality={90}
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
        </Link>

        {/* Desktop navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 whitespace-nowrap xl:gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                className="relative pb-1 text-[13px] font-medium uppercase tracking-[0.12em] xl:text-[15px] xl:tracking-[0.16em] text-brand-textSecondary transition-colors hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={(event) => handleSectionClick(event, link.href)}
                className="relative pb-1 text-[13px] font-medium uppercase tracking-[0.12em] xl:text-[15px] xl:tracking-[0.16em] text-brand-textSecondary transition-colors hover:text-brand-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brand-cream after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            )
          ))}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="group relative inline-flex items-center gap-1.5 pb-1 text-[13px] font-medium uppercase tracking-[0.12em] xl:text-[15px] xl:tracking-[0.16em] text-brand-textSecondary outline-none transition-colors hover:text-brand-cream focus-visible:text-brand-cream data-[state=open]:text-brand-cream">
              Artikel
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              sideOffset={14}
              className="max-h-[min(70vh,var(--radix-dropdown-menu-content-available-height))] w-[24rem] overflow-y-auto rounded-2xl border-brand-border/80 bg-brand-bg/95 p-2 text-brand-textPrimary shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-cream focus:bg-brand-cream/10 focus:text-brand-cream"
              >
                <Link href="/artikel">Alle Artikel ansehen</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-brand-border/70" />
              {ARTICLES.map((article) => (
                <DropdownMenuItem
                  key={article.slug}
                  asChild
                  className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-brand-cream/10 focus:text-brand-textPrimary"
                >
                  <Link href={`/artikel/${article.slug}`} className="flex w-full flex-col items-start gap-1 text-left">
                    <span className="text-sm font-light leading-snug">{article.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-brand-cream/75">
                      {article.category}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop booking CTA */}
          <Link
            href="/booking"
            className="hidden rounded-full border border-brand-cream bg-brand-cream px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary lg:inline-flex"
          >
            Termin buchen
          </Link>

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

      {/* Booking page: the shop is open every day, online slots are Mon–Thu only. */}
      {pathname === '/booking' && (
        <div
          role="note"
          className={`relative mt-3 flex h-[4.25rem] flex-col items-center justify-center gap-1 border-y border-red-500/25 bg-[#0a0808]/95 px-3 text-center backdrop-blur-xl ${open ? '-mb-5' : scrolled ? '-mb-3' : '-mb-5'}`}
        >
          {/* Soft red glow behind the text */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.16),transparent_65%)]"
          />

          <p className="relative flex items-center gap-2 text-[13px] font-semibold leading-5 tracking-[0.01em] text-red-500 sm:text-[15px]">
            <span aria-hidden className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Wir sind täglich für euch da – mit &amp; ohne Termin!
          </p>

          <div className="relative flex flex-col items-center text-[11px] leading-4 sm:flex-row sm:gap-3 sm:text-xs">
            <p>
              <span className="font-semibold text-red-400">Online-Termine:</span>{' '}
              <span className="text-red-200/85">Mo–Do (empfohlen)</span>
            </p>
            <span aria-hidden className="hidden h-3 w-px bg-red-500/40 sm:block" />
            <p>
              <span className="font-semibold text-red-400">Fr &amp; Sa:</span>{' '}
              <span className="text-red-200/85">Einfach vorbeikommen!</span>
            </p>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${open
          ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-brand-border bg-brand-bg'
          : 'max-h-0'
          }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-6 pt-4">
          {NAV_LINKS.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cream"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={(event) => handleSectionClick(event, link.href)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream"
              >
                {link.label}
              </Link>
            )
          ))}

          <button
            type="button"
            onClick={() => setArticlesOpen((value) => !value)}
            aria-expanded={articlesOpen}
            className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream"
          >
            Artikel
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${articlesOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {articlesOpen && (
            <div className="ml-4 flex flex-col gap-0.5 border-l border-brand-border/70 pl-3">
              <Link
                href="/artikel"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream hover:bg-white/5"
              >
                Alle Artikel ansehen
              </Link>
              {ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/artikel/${article.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-light leading-snug text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-full text-center border border-brand-cream bg-brand-cream px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-brand-bg transition-all duration-300 hover:border-brand-textPrimary hover:bg-brand-textPrimary"
          >
            Termin buchen
          </Link>
        </nav>
      </div>
    </header>
  );
}
