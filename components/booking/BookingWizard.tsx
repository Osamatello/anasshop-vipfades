'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Loader2, Users } from 'lucide-react';

import { getAvailability } from '@/components/chat/booking-api';
import {
  selectionLabel,
  selectionToAvailability,
  selectionToBookingPayload,
  selectionTotalDuration,
  selectionTotalPrice,
  servicesSelection,
  vipSelection,
  type BookingSelection,
} from '@/components/chat/selection';
import { useCatalog } from '@/components/chat/useCatalog';
import { isBarberOff } from '@/lib/booking/barberSchedule';
import { BUSINESS, type Barber } from '@/lib/data';
import { getKoblenzDate } from '@/lib/timezone';
import { trackEvent } from '@/lib/analytics';
import {
  validateCustomerName,
  validatePhoneNumber,
} from '@/lib/validation/booking';

import BookingServices, {
  CREAMY_GOLD_FRAME,
  CREAMY_GOLD_FRAME_SELECTED,
} from './BookingServices';
import VipTicket, { type TicketDetails } from './VipTicket';

type BarberChoice = Barber | 'any';
type WizardStep = 1 | 2 | 3;

const STEP_TITLES: Record<WizardStep, string> = {
  1: 'Was darf es heute sein?',
  2: 'Wer schneidet dich heute?',
  3: 'Wann kommst du auf den Stuhl?',
};

const BARBER_PHOTOS: Record<string, string> = {
  anas: '/images/anas-barber.jpeg',
  abd: '/images/abd-barber.jpeg',
};

const MONTHS_BOOKABLE_AHEAD = 2;
const CREAMY_GOLD_SELECTED =
  'border-transparent bg-gradient-to-br from-[#f5e9cb] to-[#c9ad78] font-semibold text-[#1f1b14]';
const UNSELECTED =
  'border-brand-border text-brand-textPrimary hover:border-[#e5d0a0]/60';

function formatDateParts(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('de-DE', { ...options, timeZone: 'UTC' }).format(
      value,
    );

  return {
    weekday: format({ weekday: 'short' }).replace('.', ''),
    day: format({ day: 'numeric' }).replace('.', ''),
    month: format({ month: 'short' }).replace('.', ''),
    label: format({ weekday: 'short', day: 'numeric', month: 'numeric' }),
  };
}

/** Online-bookable days for the next two months: Monday to Thursday, without the barber's day off. */
function getBookableDates(barber: BarberChoice | null): string[] {
  const [year, month, day] = getKoblenzDate().split('-').map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  const lastDay = new Date(Date.UTC(year, month - 1 + MONTHS_BOOKABLE_AHEAD, day));
  const dates: string[] = [];

  while (cursor <= lastDay) {
    const weekday = cursor.getUTCDay();
    const date = cursor.toISOString().slice(0, 10);
    const barberIsOff =
      barber && barber !== 'any' ? isBarberOff(barber.id, date) : false;

    if (weekday >= 1 && weekday <= 4 && !barberIsOff) {
      dates.push(date);
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export default function BookingWizard({
  initialBarber,
  initialServiceSlug,
  onTicketChange,
  onCancelBooking,
}: {
  initialBarber?: string;
  initialServiceSlug?: string;
  /** Live pass details, or null once the confirmed pass replaces it. */
  onTicketChange: (details: TicketDetails | null) => void;
  onCancelBooking: () => void;
}) {
  const { barbers, services, vipPackages, loading, error } = useCatalog();

  const [step, setStep] = useState<WizardStep>(1);
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [barberChoice, setBarberChoice] = useState<BarberChoice | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slotBarbers, setSlotBarbers] = useState<Map<string, Barber>>(new Map());
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<TicketDetails | null>(null);
  const [slotsVersion, setSlotsVersion] = useState(0);

  const topRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const initialBarberApplied = useRef(false);
  const initialServiceApplied = useRef(false);

  useEffect(() => {
    if (
      initialServiceApplied.current ||
      !initialServiceSlug ||
      (services.length === 0 && vipPackages.length === 0)
    ) {
      return;
    }

    initialServiceApplied.current = true;

    const vipPackage = vipPackages.find(
      (item) => item.slug === initialServiceSlug,
    );
    const service = services.find((item) => item.slug === initialServiceSlug);

    if (vipPackage) {
      setSelection(vipSelection(vipPackage));
    } else if (service) {
      setSelection(servicesSelection([service]));
    }
  }, [initialServiceSlug, services, vipPackages]);

  // The slot list can be long on phones, so bring the name and phone fields into view.
  useEffect(() => {
    if (time) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [time]);

  useEffect(() => {
    if (initialBarberApplied.current || !initialBarber || barbers.length === 0) {
      return;
    }

    initialBarberApplied.current = true;

    const match = barbers.find(
      (barber) => barber.name.trim().toLowerCase() === initialBarber,
    );

    if (match) {
      setBarberChoice(match);
    }
  }, [barbers, initialBarber]);

  const dates = useMemo(() => getBookableDates(barberChoice), [barberChoice]);

  const assignedBarber = time ? slotBarbers.get(time) : undefined;

  const barberLabel =
    assignedBarber?.name ??
    (barberChoice === 'any' ? 'Nächster freier Stuhl' : barberChoice?.name);

  const ticket = useMemo<TicketDetails>(
    () => ({
      service: selection ? selectionLabel(selection) : undefined,
      duration: selection ? selectionTotalDuration(selection) : undefined,
      price: selection ? selectionTotalPrice(selection) : undefined,
      barber: barberLabel,
      date: date ? formatDateParts(date).label : undefined,
      time: time ?? undefined,
      customerName: name || undefined,
      customerPhone: phone || undefined,
    }),
    [selection, barberLabel, date, time, name, phone],
  );

  useEffect(() => {
    onTicketChange(confirmed ? null : ticket);
  }, [confirmed, ticket, onTicketChange]);

  useEffect(() => {
    if (step !== 3 || !selection || !barberChoice || !date) {
      return;
    }

    let cancelled = false;
    const barbersToCheck = barberChoice === 'any' ? barbers : [barberChoice];
    const availability = selectionToAvailability(selection);

    setSlotsLoading(true);
    setSlotsError(false);

    Promise.all(
      barbersToCheck.map((barber) =>
        getAvailability({ barberId: barber.id, date, selection: availability }),
      ),
    )
      .then((results) => {
        if (cancelled) {
          return;
        }

        const nextSlots = new Map<string, Barber>();

        results.forEach((slots, index) => {
          slots.forEach((slot) => {
            if (!nextSlots.has(slot)) {
              nextSlots.set(slot, barbersToCheck[index]);
            }
          });
        });

        setSlotBarbers(nextSlots);
      })
      .catch(() => {
        if (!cancelled) {
          setSlotBarbers(new Map());
          setSlotsError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [step, selection, barberChoice, date, barbers, slotsVersion]);

  const goToStep = (nextStep: WizardStep) => {
    setStep(nextStep);
    setFormError(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSelectionChange = (next: BookingSelection | null) => {
    setSelection(next);
    setDate(null);
    setTime(null);
  };

  const handleBarberSelect = (choice: BarberChoice) => {
    setBarberChoice(choice);
    setDate(getBookableDates(choice)[0]);
    setTime(null);
    goToStep(3);
  };

  const handleDateSelect = (nextDate: string) => {
    setDate(nextDate);
    setTime(null);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selection || !date || !time) {
      setFormError('Bitte wähle zuerst Tag und Uhrzeit.');
      return;
    }

    const barber = slotBarbers.get(time);

    if (!barber) {
      setFormError('Bitte wähle eine freie Uhrzeit.');
      return;
    }

    if (!validateCustomerName(name).valid) {
      setFormError('Bitte gib deinen Namen ein.');
      return;
    }

    if (!validatePhoneNumber(phone).valid) {
      setFormError('Bitte gib eine gültige Handynummer ein.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: barber.id,
          selection: selectionToBookingPayload(selection),
          customerName: name,
          customerPhone: phone,
          bookingDate: date,
          startTime: time,
        }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        code?: string;
      };

      if (!response.ok || !data.success) {
        if (data.code === 'slot_unavailable') {
          setTime(null);
          setSlotsVersion((version) => version + 1);
        }

        setFormError(
          data.error || 'Die Buchung konnte gerade nicht abgeschlossen werden.',
        );
        return;
      }

      trackEvent('booking_completed', {
        value: selectionTotalPrice(selection),
        currency: 'EUR',
        barber: barber.name,
      });
      setConfirmed({ ...ticket, barber: barber.name });
    } catch {
      setFormError(
        'Die Buchung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setConfirmed(null);
    setStep(1);
    setSelection(null);
    setBarberChoice(null);
    setDate(null);
    setTime(null);
    setName('');
    setPhone('');
    setFormError(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-brand-textSecondary">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Leistungen werden geladen …
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-16 text-center text-sm text-brand-textSecondary sm:px-8">
        <p>Die Online-Buchung konnte gerade nicht geladen werden.</p>
        <a
          href={`tel:${BUSINESS.phone}`}
          className="mt-3 inline-block text-brand-cream underline underline-offset-4"
        >
          Ruf uns an: {BUSINESS.phoneFormatted}
        </a>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
        <h2 className="font-serif text-4xl text-brand-textPrimary">
          Dein VIP Pass ist bereit
        </h2>
        <p className="mt-2 text-sm font-light text-brand-textSecondary">
          Dein Termin ist bestätigt. Wir freuen uns auf dich.
        </p>

        <div className="mt-8 w-full max-w-[380px] text-left">
          <VipTicket details={confirmed} confirmed />
        </div>

        <button
          type="button"
          onClick={restart}
          className="mt-8 text-sm text-brand-cream underline underline-offset-4"
        >
          Weiteren Termin buchen
        </button>

        <button
          type="button"
          onClick={() => {
            restart();
            onCancelBooking();
          }}
          className="mt-3 text-xs text-brand-textSecondary underline underline-offset-4 transition-colors hover:text-brand-cream"
        >
          Termin stornieren
        </button>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* On phones the pass joins the page after the services are chosen. */}
      {step > 1 && (
        <div className="sticky top-[5.5rem] z-20 px-3 pt-3 lg:hidden">
          <VipTicket details={ticket} mini />
        </div>
      )}

      {/* Step heading and progress */}
      <div className="px-4 pt-4 sm:px-8 lg:pt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#e5d0a0]">
          Schritt {step} von 3
        </p>
        <h2 className="mt-1 font-serif text-[1.65rem] font-medium leading-[1.12] text-brand-textPrimary lg:mt-2 lg:text-5xl">
          {STEP_TITLES[step]}
        </h2>

        <div className="mt-3 flex gap-2 lg:mt-5" aria-hidden="true">
          {([1, 2, 3] as WizardStep[]).map((number) => (
            <span
              key={number}
              className={`h-[3px] flex-1 rounded-full ${
                step >= number
                  ? 'bg-gradient-to-r from-[#e5d0a0] to-[#f5e9cb]'
                  : 'bg-brand-border'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <BookingServices
          services={services}
          vipPackages={vipPackages}
          selection={selection}
          onChange={handleSelectionChange}
          onContinue={() => goToStep(2)}
        />
      )}

      {step === 2 && (
        <div className="px-4 py-4 sm:px-8 lg:py-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                selected={
                  barberChoice !== 'any' && barberChoice?.id === barber.id
                }
                onClick={() => handleBarberSelect(barber)}
              />
            ))}
          </div>

          {barbers.length > 1 && (
            <button
              type="button"
              aria-pressed={barberChoice === 'any'}
              onClick={() => handleBarberSelect('any')}
              className={`mt-2.5 flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-2 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(229,208,160,0.16)] sm:mt-4 ${
                barberChoice === 'any'
                  ? CREAMY_GOLD_FRAME_SELECTED
                  : CREAMY_GOLD_FRAME
              }`}
            >
              <Users className="h-5 w-5 flex-shrink-0 text-[#e5d0a0]" />
              <span>
                <span className="block font-serif text-base font-semibold text-brand-textPrimary lg:text-xl">
                  Egal, nächster freier Stuhl
                </span>
                <span className="mt-0.5 block text-xs font-light text-brand-textSecondary">
                  Wir wählen den Barber, der zu deiner Zeit frei ist.
                </span>
              </span>
            </button>
          )}

          <BackButton onClick={() => goToStep(1)} />
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate className="px-4 py-4 sm:px-8 lg:py-6">
          <p className="text-xs text-brand-textSecondary">Wähle deinen Tag</p>

          <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-6 sm:px-0 lg:mt-3">
            {dates.map((item) => {
              const parts = formatDateParts(item);

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={date === item}
                  aria-label={parts.label}
                  onClick={() => handleDateSelect(item)}
                  className={`w-16 flex-shrink-0 rounded-2xl border py-1.5 text-center text-[11px] transition-colors sm:w-auto lg:py-2.5 ${
                    date === item ? CREAMY_GOLD_SELECTED : UNSELECTED
                  }`}
                >
                  {parts.weekday}
                  <span className="block font-serif text-xl font-medium leading-tight lg:text-2xl">
                    {parts.day}
                  </span>
                  {parts.month}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-brand-textSecondary lg:mt-6">Freie Zeiten</p>

          <div className="mt-2 min-h-24 lg:mt-3">
            {slotsLoading ? (
              <p className="flex items-center text-sm text-brand-textSecondary">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Freie Zeiten werden geladen …
              </p>
            ) : slotsError ? (
              <p className="text-sm text-brand-textSecondary">
                Die freien Zeiten konnten nicht geladen werden. Bitte versuche
                es erneut.
              </p>
            ) : slotBarbers.size === 0 ? (
              <p className="text-sm text-brand-textSecondary">
                An diesem Tag sind keine Zeiten frei. Bitte wähle einen anderen
                Tag.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {Array.from(slotBarbers.keys())
                  .sort()
                  .map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={time === slot}
                      onClick={() => {
                        setTime(slot);
                        setFormError(null);
                      }}
                      className={`min-h-10 rounded-xl border text-[13px] tabular-nums lg:min-h-11 lg:text-sm transition-colors ${
                        time === slot ? CREAMY_GOLD_SELECTED : UNSELECTED
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {time && (
            <div
              ref={detailsRef}
              className="mt-6 border-t border-brand-border/50 pt-5"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="text-xs text-brand-textSecondary"
                  >
                    Name
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-border bg-[#111214] px-4 py-3 text-base text-brand-textPrimary outline-none focus:border-[#e5d0a0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="text-xs text-brand-textSecondary"
                  >
                    Handynummer
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-border bg-[#111214] px-4 py-3 text-base text-brand-textPrimary outline-none focus:border-[#e5d0a0]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-textPrimary px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-[#f5e9cb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Wird gebucht …' : 'Pass sichern · Termin buchen'}
              </button>
            </div>
          )}

          {formError && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {formError}
            </p>
          )}

          <BackButton onClick={() => goToStep(2)} />
        </form>
      )}
    </div>
  );
}

function BarberCard({
  barber,
  selected,
  onClick,
}: {
  barber: Barber;
  selected: boolean;
  onClick: () => void;
}) {
  const photo = BARBER_PHOTOS[barber.name.trim().toLowerCase()];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group relative h-48 overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(229,208,160,0.2)] lg:h-[23rem] ${
        selected ? CREAMY_GOLD_FRAME_SELECTED : CREAMY_GOLD_FRAME
      }`}
    >
      {photo && (
        <Image
          src={photo}
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 30vw"
          className={`object-cover object-top transition-[filter] duration-300 ${
            selected ? '' : 'grayscale group-hover:grayscale-0'
          }`}
        />
      )}

      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

      <span className="absolute inset-x-4 bottom-4">
        <span className="block font-serif text-2xl leading-none text-white lg:text-4xl">
          {barber.name}
        </span>
        <span className="mt-1.5 block text-[11px] font-light leading-4 text-white/80 sm:text-xs">
          {barber.title}
        </span>
      </span>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-xs font-medium text-brand-textSecondary transition-colors hover:border-brand-cream/40 hover:text-brand-cream"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Zurück
    </button>
  );
}
