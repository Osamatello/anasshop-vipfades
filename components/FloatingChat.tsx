'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatInterface from './chat/ChatInterface';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink-950 shadow-2xl shadow-gold/20 transition-all hover:scale-105 hover:bg-gold-light sm:h-16 sm:w-16"
        aria-label="Open booking assistant"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-ink-950" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end sm:bottom-6 sm:right-6 sm:inset-auto">
          {/* backdrop on mobile */}
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-[88vh] w-full flex-col sm:h-[620px] sm:w-[400px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-ink-800 text-warm ring-1 ring-white/10 transition-colors hover:text-gold sm:-top-1 sm:-left-12 sm:right-auto"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full overflow-hidden rounded-3xl sm:rounded-3xl">
              <ChatInterface />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
