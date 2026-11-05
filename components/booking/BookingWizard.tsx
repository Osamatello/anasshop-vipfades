'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Loader2, UserRound, Users } from 'lucide-react';

import ServicesPicker, {
  type ServicesSelection,
} from '@/components/chat/ServicesPicker';
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
import {
  validateCustomerName,
  validatePhoneNumber,
} from '@/lib/validation/booking';

type BarberChoice = Barber | 'any';
type WizardStep = 1 | 2 | 3;

type ConfirmedBooking = {
  label: string;
  barberName: string;
  dateLabel: string;
  time: string;
  price: number;
  duration: number;
};

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Service',
  2: 'Barber',
  3: 'Termin',
};

const NUMBER_OF_DATES = 12;

function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

/** The next online-bookable days: Monday to Thursday, without the barber's day off. */
function getBookableDates(barber: BarberChoice | null): string[] {
  const [year, month, day] = getKoblenzDate().split('-').map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  const dates: string[] = [];

  while (dates.length < NUMBER_OF_DATES) {
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
  onCancelBooking,
}: {
  initialBarber?: string;
  initialServiceSlug?: string;
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
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const [slotsVersion, setSlotsVersion] = useState(0);

  const topRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const initialBarberApplied = useRef(false);

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

  const handleServicesContinue = (picked: ServicesSelection) => {
    const vipPackage = vipPackages.find(
      (item) => item.id === picked.vipPackageId,
    );
    const pickedServices = picked.serviceIds.flatMap((id) => {
      const service = services.find((item) => item.id === id);
      return service ? [service] : [];
    });

    setSelection(
      vipPackage ? vipSelection(vipPackage) : servicesSelection(pickedServices),
    );
    setDate(null);
    setTime(null);
    goToStep(2);
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

    const nameResult = validateCustomerName(name);

    if (!nameResult.valid) {
      setFormError('Bitte gib deinen Namen ein.');
      return;
    }

    const phoneResult = validatePhoneNumber(phone);

    if (!phoneResult.valid) {
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

      setConfirmed({
        label: selectionLabel(selection),
        barberName: barber.name,
        dateLabel: formatDateLabel(date),
        time,
        price: selectionTotalPrice(selection),
        duration: selectionTotalDuration(selection),
      });
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
      <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center sm:px-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-brand-bg">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>

        <h2 className="mt-6 font-serif text-3xl text-brand-textPrimary">
          Dein Termin ist bestätigt
        </h2>

        <dl className="mt-6 w-full max-w-sm space-y-2 rounded-2xl border border-brand-border p-5 text-left text-sm">
          <SummaryRow label="Leistung" value={confirmed.label} />
          <SummaryRow label="Barber" value={confirmed.barberName} />
          <SummaryRow
            label="Termin"
            value={`${confirmed.dateLabel} um ${confirmed.time}`}
          />
          <SummaryRow
            label="Gesamt"
            value={`€${confirmed.price} · ${confirmed.duration} Min.`}
          />
          <SummaryRow label="Adresse" value={BUSINESS.address} />
        </dl>

        <button
          type="button"
          onClick={restart}
          className="mt-6 text-sm text-brand-cream underline underline-offset-4"
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
      {/* Progress */}
      <ol className="flex items-center gap-2 border-b border-brand-border/50 px-5 py-4 sm:px-8">
        {([1, 2, 3] as WizardStep[]).map((number) => {
          const reached = step >= number;

          return (
            <li
              key={number}
              aria-current={step === number ? 'step' : undefined}
              className="flex flex-1 items-center gap-2"
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  reached
                    ? 'border-brand-cream bg-brand-cream text-brand-bg'
                    : 'border-brand-border text-brand-textSecondary'
                }`}
              >
                {step > number ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  number
                )}
              </span>
              <span
                className={`text-xs font-medium ${
                  reached ? 'text-brand-textPrimary' : 'text-brand-textSecondary'
                }`}
              >
                {STEP_LABELS[number]}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Selection summary */}
      {step > 1 && selection && (
        <div className="flex items-center justify-between gap-3 border-b border-brand-border/50 px-5 py-3 text-xs sm:px-8">
          <span className="min-w-0 truncate text-brand-textPrimary">
            {selectionLabel(selection)}
          </span>
          <span className="flex-shrink-0 text-brand-textSecondary">
            {selectionTotalDuration(selection)} Min. ·{' '}
            <span className="text-brand-cream">
              €{selectionTotalPrice(selection)}
            </span>
          </span>
        </div>
      )}

      {/* Step 1 stays mounted so going back keeps the customer's selection. */}
      <div className={step === 1 ? '' : 'hidden'}>
        <ServicesPicker
          services={services}
          vipPackages={vipPackages}
          onContinue={handleServicesContinue}
          initialServiceSlug={initialServiceSlug}
          listClassName="max-h-[min(58dvh,560px)]"
        />
      </div>

      {step === 2 && (
        <div className="px-5 py-5 sm:px-8">
          <h2 className="text-sm font-medium text-brand-textPrimary">
            Wähle deinen Barber
          </h2>

          <div className="mt-4 space-y-2">
            {barbers.map((barber) => (
              <ChoiceButton
                key={barber.id}
                icon={<UserRound className="h-5 w-5" />}
                title={barber.name}
                subtitle={barber.title}
                selected={
                  barberChoice !== 'any' && barberChoice?.id === barber.id
                }
                onClick={() => handleBarberSelect(barber)}
              />
            ))}

            {barbers.length > 1 && (
              <ChoiceButton
                icon={<Users className="h-5 w-5" />}
                title="Egal / Nächster freier Stuhl"
                subtitle="Wir wählen den Barber, der zu deiner Zeit frei ist."
                selected={barberChoice === 'any'}
                onClick={() => handleBarberSelect('any')}
              />
            )}
          </div>

          <BackButton onClick={() => goToStep(1)} />
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate className="px-5 py-5 sm:px-8">
          <h2 className="text-sm font-medium text-brand-textPrimary">
            Wähle Tag und Uhrzeit
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
            {dates.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={date === item}
                onClick={() => handleDateSelect(item)}
                className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                  date === item
                    ? 'border-brand-cream bg-brand-cream text-brand-bg'
                    : 'border-brand-border text-brand-textPrimary hover:border-brand-cream/50'
                }`}
              >
                {formatDateLabel(item)}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-24">
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
                {Array.from(slotBarbers.keys()).sort().map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={time === slot}
                    onClick={() => {
                      setTime(slot);
                      setFormError(null);
                    }}
                    className={`min-h-11 rounded-xl border text-sm tabular-nums transition-colors ${
                      time === slot
                        ? 'border-brand-cream bg-brand-cream text-brand-bg'
                        : 'border-brand-border text-brand-textPrimary hover:border-brand-cream/50'
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
              className="mt-6 space-y-3 border-t border-brand-border/50 pt-5"
            >
              {barberChoice === 'any' && (
                <p className="text-xs text-brand-textSecondary">
                  Dein Barber um {time}:{' '}
                  <span className="text-brand-cream">
                    {slotBarbers.get(time)?.name}
                  </span>
                </p>
              )}

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
                  className="mt-1 w-full rounded-xl border border-brand-border bg-[#111214] px-4 py-3 text-base text-brand-textPrimary outline-none focus:border-brand-cream"
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
                  className="mt-1 w-full rounded-xl border border-brand-border bg-[#111214] px-4 py-3 text-base text-brand-textPrimary outline-none focus:border-brand-cream"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-cream px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Wird gebucht …' : 'Termin buchen'}
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

function ChoiceButton({
  icon,
  title,
  subtitle,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? 'border-brand-cream bg-brand-cream/5'
          : 'border-brand-border bg-[#1a1b1e] hover:border-brand-cream/40'
      }`}
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brand-cream/30 text-brand-cream">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-medium text-brand-textPrimary">
          {title}
        </span>
        <span className="mt-0.5 block text-xs font-light text-brand-textSecondary">
          {subtitle}
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="flex-shrink-0 text-brand-textSecondary">{label}</dt>
      <dd className="text-right text-brand-textPrimary">{value}</dd>
    </div>
  );
}
