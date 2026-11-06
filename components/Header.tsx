'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  { label: 'FAQ', href: '#faq' },
  { label: 'Besuch', href: '#contact' },
];

export default function Header() {
  const router = useRouter();
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

  const handleNav = (href: string) => {
    setOpen(false);

    if (href.startsWith('/')) {
      router.push(href);
      return;
    }

    if (pathname === '/') {
      scrollToElement(document.querySelector(href));

      return;
    }

    router.push(`/${href}`);
  };

  const handleBrandClick = () => {
    setOpen(false);

    if (pathname === '/') {
      scrollToTop();

      return;
    }

    router.push('/');
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
        </button>

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
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="relative pb-1 text-[13px] font-medium uppercase tracking-[0.12em] xl:text-[15px] xl:tracking-[0.16em] text-brand-textSecondary transition-colors hover:text-brand-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brand-cream after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </button>
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
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.16em] text-brand-textSecondary transition-colors hover:bg-white/5 hover:text-brand-cream"
              >
                {link.label}
              </button>
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
