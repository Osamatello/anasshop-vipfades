'use client';

import Link from 'next/link';
import { BookOpen, ChevronDown, Clock3 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ArticleSummary } from '@/lib/articles';

export default function ArticlesDropdown({ articles }: { articles: ArticleSummary[] }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="group inline-flex items-center gap-3 rounded-full border border-brand-cream/60 bg-brand-cream/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream outline-none transition-colors hover:bg-brand-cream hover:text-brand-bg focus-visible:ring-2 focus-visible:ring-brand-cream/60 data-[state=open]:bg-brand-cream data-[state=open]:text-brand-bg">
        <BookOpen className="h-4 w-4" />
        Artikel wählen
        <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] tracking-normal">
          {articles.length}
        </span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="max-h-[min(70vh,var(--radix-dropdown-menu-content-available-height))] w-[min(92vw,26rem)] overflow-y-auto rounded-2xl border-brand-border/80 bg-brand-bg/95 p-2 text-brand-textPrimary shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-md"
      >
        <DropdownMenuLabel className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
          Alle Artikel
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-brand-border/70" />

        {articles.map((article) => (
          <DropdownMenuItem
            key={article.slug}
            asChild
            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-brand-cream/10 focus:text-brand-textPrimary"
          >
            <Link href={`/artikel/${article.slug}`} className="flex w-full flex-col items-start gap-1.5 text-left">
              <span className="text-sm font-light leading-snug">{article.title}</span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-cream/75">
                {article.category}
                <span className="h-1 w-1 rounded-full bg-brand-cream/40" />
                <Clock3 className="h-3 w-3" />
                {article.readingTime}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
