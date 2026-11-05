'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Scissors } from 'lucide-react';
import ChatInterface from './chat/ChatInterface';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Keeps the end of the page clear of the sticky booking bar */}
      <div aria-hidden="true" className="h-20 lg:hidden" />

      {/* Sticky booking bar on phones and tablets */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-brand-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <Link
          href="/booking"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-cream px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cream"
        >
          <Scissors className="h-4 w-4" />
          Jetzt Termin buchen
        </Link>
      </div>

      {/* Launcher — hidden while chat is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-brand-textPrimary shadow-2xl shadow-brand-accent/20 transition-all hover:scale-105 hover:bg-brand-hover sm:h-16 sm:w-16 lg:bottom-6"
          aria-label="Buchungsassistent öffnen"
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-brand-bg" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end sm:bottom-6 sm:right-6 sm:inset-auto">
          {/* Backdrop on mobile */}
          <div
            className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-[88vh] w-full flex-col sm:h-[620px] sm:w-[400px]">
            <div className="h-full overflow-hidden rounded-3xl sm:rounded-3xl">
              <ChatInterface onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}