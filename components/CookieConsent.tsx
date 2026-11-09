'use client';

import { useEffect, useState } from 'react';

import {
  disableGoogleAnalytics,
  loadGoogleAnalytics,
  OPEN_CONSENT_EVENT,
  readConsent,
  saveConsent,
  type AnalyticsConsent,
} from '@/lib/analytics';

/** Asks before Google Analytics runs; the choice can be changed from the footer. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = readConsent();

    if (consent === 'granted') {
      loadGoogleAnalytics();
    } else if (consent === null) {
      setOpen(true);
    }

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const choose = (consent: AnalyticsConsent) => {
    saveConsent(consent);

    if (consent === 'granted') {
      loadGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-xl rounded-2xl border border-brand-border bg-[#0c0c0c]/95 p-4 shadow-2xl backdrop-blur sm:p-5 lg:bottom-6"
    >
      <p className="text-sm font-medium text-brand-textPrimary">Cookies &amp; Statistik</p>
      <p className="mt-1.5 text-xs leading-5 text-brand-textSecondary">
        Mit deiner Zustimmung nutzen wir Google Analytics, um zu verstehen, wie unsere Website
        genutzt wird, und sie zu verbessern. Du kannst deine Wahl jederzeit über
        „Cookie-Einstellungen“ unten auf der Seite ändern. Mehr dazu in der{' '}
        <a href="/datenschutz" className="text-brand-cream underline underline-offset-4">
          Datenschutzerklärung
        </a>
        .
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="rounded-full border border-brand-border px-4 py-2.5 text-sm font-medium text-brand-textPrimary transition-colors hover:border-brand-cream/60"
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="rounded-full bg-[#e5d0a0] px-4 py-2.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary"
        >
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
