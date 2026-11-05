'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import { useCatalog } from '@/components/chat/useCatalog';
import { BUSINESS } from '@/lib/data';
import { validatePhoneNumber } from '@/lib/validation/booking';

type UpcomingBooking = {
  id: string;
  barberName: string;
  serviceName: string;
  serviceIds?: string[];
  bookingDate: string;
  startTime: string;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function CancelBooking({ onBook }: { onBook: () => void }) {
  const { services } = useCatalog();

  const [phone, setPhone] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [bookings, setBookings] = useState<UpcomingBooking[] | null>(null);
  const [selected, setSelected] = useState<UpcomingBooking | null>(null);
  const [cancelled, setCancelled] = useState<UpcomingBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceLabel = (booking: UpcomingBooking) => {
    const names = (booking.serviceIds ?? []).map(
      (id) => services.find((service) => service.id === id)?.name,
    );

    return names.length > 0 && names.every(Boolean)
      ? names.join(' + ')
      : booking.serviceName;
  };

  const findBookings = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validatePhoneNumber(phone);

    if (!result.valid) {
      setError('Bitte gib eine gültige Telefonnummer ein.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bookings/cancel?phone=${encodeURIComponent(result.value)}`,
      );
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        bookings?: UpcomingBooking[];
      };

      if (!response.ok || !data.success) {
        setError(
          response.status === 429 && data.error
            ? data.error
            : 'Deine Termine konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.',
        );
        return;
      }

      setVerifiedPhone(result.value);
      setBookings(data.bookings ?? []);
    } catch {
      setError(
        'Deine Termine konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.',
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmCancellation = async () => {
    if (!selected || !verifiedPhone) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${selected.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: verifiedPhone }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            'Der Termin konnte gerade nicht storniert werden. Bitte versuche es erneut.',
        );
        return;
      }

      setCancelled(selected);
    } catch {
      setError(
        'Der Termin konnte gerade nicht storniert werden. Bitte versuche es erneut.',
      );
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setPhone('');
    setVerifiedPhone(null);
    setBookings(null);
    setSelected(null);
    setCancelled(null);
    setError(null);
  };

  if (cancelled) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center sm:px-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5d0a0] text-brand-bg">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>

        <h2 className="mt-6 font-serif text-3xl text-brand-textPrimary">
          Dein Termin wurde storniert
        </h2>

        <p className="mt-3 text-sm text-brand-textSecondary">
          {formatDate(cancelled.bookingDate)} um {cancelled.startTime} ·{' '}
          {cancelled.barberName}
        </p>

        <button
          type="button"
          onClick={onBook}
          className="mt-7 rounded-full bg-[#e5d0a0] px-6 py-3 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary"
        >
          Neuen Termin buchen
        </button>

        <button
          type="button"
          onClick={startOver}
          className="mt-4 text-xs text-brand-textSecondary underline underline-offset-4 transition-colors hover:text-brand-cream"
        >
          Weiteren Termin stornieren
        </button>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="px-5 py-6 sm:px-8">
        <h2 className="text-sm font-medium text-brand-textPrimary">
          Möchtest du diesen Termin wirklich stornieren?
        </h2>

        <div className="mt-4 rounded-2xl border border-brand-border p-5">
          <p className="text-base text-brand-textPrimary">
            {formatDate(selected.bookingDate)} um {selected.startTime}
          </p>
          <p className="mt-1 text-sm text-brand-textSecondary">
            {serviceLabel(selected)} · {selected.barberName}
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={confirmCancellation}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#e5d0a0] px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Wird storniert …' : 'Ja, Termin stornieren'}
        </button>

        <BackButton
          label="Nein, zurück"
          onClick={() => {
            setSelected(null);
            setError(null);
          }}
        />
      </div>
    );
  }

  if (bookings) {
    return (
      <div className="px-5 py-6 sm:px-8">
        {bookings.length === 0 ? (
          <>
            <h2 className="text-sm font-medium text-brand-textPrimary">
              Keine kommenden Termine gefunden
            </h2>
            <p className="mt-2 text-sm font-light leading-6 text-brand-textSecondary">
              Prüfe bitte die Nummer oder ruf uns an:{' '}
              <a
                href={`tel:${BUSINESS.phone}`}
                className="text-brand-cream underline underline-offset-4"
              >
                {BUSINESS.phoneFormatted}
              </a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-sm font-medium text-brand-textPrimary">
              Wähle den Termin, den du stornieren möchtest
            </h2>

            <div className="mt-4 space-y-2">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => setSelected(booking)}
                  className="w-full rounded-xl border border-brand-border bg-[#1a1b1e] px-4 py-3 text-left transition-colors hover:border-brand-cream/40"
                >
                  <span className="block text-sm font-medium text-brand-textPrimary">
                    {formatDate(booking.bookingDate)} um {booking.startTime}
                  </span>
                  <span className="mt-0.5 block text-xs font-light text-brand-textSecondary">
                    {serviceLabel(booking)} · {booking.barberName}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <BackButton label="Andere Nummer eingeben" onClick={startOver} />
      </div>
    );
  }

  return (
    <form onSubmit={findBookings} noValidate className="px-5 py-6 sm:px-8">
      <label
        htmlFor="cancel-phone"
        className="text-sm font-medium text-brand-textPrimary"
      >
        Telefonnummer deiner Buchung
      </label>

      <input
        id="cancel-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="mt-3 w-full rounded-xl border border-brand-border bg-[#111214] px-4 py-3 text-base text-brand-textPrimary outline-none focus:border-brand-cream"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#e5d0a0] px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Wird gesucht …' : 'Meine Termine anzeigen'}
      </button>

      <p className="mt-4 text-xs font-light leading-5 text-brand-textSecondary">
        Bitte storniere deinen Termin mindestens 2 Stunden vorher.
      </p>
    </form>
  );
}

function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-xs font-medium text-brand-textSecondary transition-colors hover:border-brand-cream/40 hover:text-brand-cream"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
