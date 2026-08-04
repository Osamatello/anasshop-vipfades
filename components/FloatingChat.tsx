'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './chat/ChatInterface';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Launcher — hidden while chat is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-brand-textPrimary shadow-2xl shadow-brand-accent/20 transition-all hover:scale-105 hover:bg-brand-hover sm:h-16 sm:w-16"
          aria-label="Open booking concierge"
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
