'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  Scissors,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

import {
  BUSINESS,
} from '@/lib/data';

import { QUICK_ACTIONS } from './constants';
import {
  parseBookingIntent,
  type SlotPreference,
  type SpecificDate,
  type TimeOfDay,
  type Weekday,
} from './intentParser';
import { useAvailability } from './useAvailability';
import { useCatalog } from './useCatalog';

import {
  validateCustomerName,
  validatePhoneNumber,
} from '@/lib/validation/booking';

import type { BookingDraft, Msg, Step } from './types';

import {
  getBarberDayOff,
} from '@/lib/booking/barberSchedule';


let idCounter = 0;

const nextId = () => {
  idCounter += 1;
  return idCounter;
};

const BUSINESS_TIME_ZONE = 'Europe/Berlin';

type BookingPreference = {
  relativeDate?: 'today' | 'tomorrow';
  specificDate?: SpecificDate;
  weekday?: Weekday;
  timeOfDay?: TimeOfDay;
  slotPreference?: SlotPreference;
};

const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: 'Vormittag',
  afternoon: 'Nachmittag',
  evening: 'Abend',
};

const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
};

export default function ChatInterface({
  onBooked,
  onClose,
  initialBarber,
}: {
  onBooked?: (booking: BookingDraft) => void;
  onClose?: () => void;
  initialBarber?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>('welcome');
  const [draft, setDraft] = useState<BookingDraft>({});
  const [bookingPreference, setBookingPreference] =
    useState<BookingPreference>({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [cancellationBookings, setCancellationBookings] = useState<{
    id: string;
    barberId: string;
    serviceId: string;
    bookingDate: string;
    startTime: string;
    barberName?: string;
    serviceName?: string;
  }[]>([]);
  const [selectedCancellationBookingId, setSelectedCancellationBookingId] =
    useState<string | null>(null);
  const [cancellationPhone, setCancellationPhone] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState(false);

  const {
    slots,
    loading: availabilityLoading,
    error: availabilityError,
    loadAvailability,
    resetAvailability,
  } = useAvailability();

  const {
    barbers,
    services,
    loading: catalogLoading,
    error: catalogError,
  } = useCatalog();


  const scrollRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const pendingBotMessagesRef = useRef(0);
  const initialBarberHandledRef = useRef(false);

  const pushBot = useCallback((text: string, extra?: Partial<Msg>) => {
    if (!mountedRef.current) {
      return;
    }

    pendingBotMessagesRef.current += 1;
    setTyping(true);

    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId);
      pendingBotMessagesRef.current = Math.max(
        0,
        pendingBotMessagesRef.current - 1,
      );

      if (!mountedRef.current) {
        return;
      }

      setTyping(pendingBotMessagesRef.current > 0);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextId(),
          role: 'bot',
          text,
          ...extra,
        },
      ]);
    }, 550);

    timeoutIdsRef.current.add(timeoutId);
  }, []);

  const pushUser = useCallback((text: string) => {
    if (!mountedRef.current) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextId(),
        role: 'user',
        text,
      },
    ]);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    pushBot(
      `Willkommen bei ${BUSINESS.name}. Ich bin dein persönlicher Buchungsassistent. Ich helfe dir bei der Auswahl deiner Leistung, deines Barbers und des passenden Termins. Wie kann ich dir helfen?`,
    );

    return () => {
      mountedRef.current = false;
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current.clear();
      pendingBotMessagesRef.current = 0;
    };
  }, [pushBot]);

  useEffect(() => {
    if (
      initialBarberHandledRef.current ||
      !initialBarber ||
      catalogLoading
    ) {
      return;
    }

    initialBarberHandledRef.current = true;

    if (catalogError || barbers.length === 0) {
      return;
    }

    const selectedBarber = barbers.find(
      (barber) =>
        barber.name.trim().toLowerCase() ===
        initialBarber.trim().toLowerCase(),
    );

    if (!selectedBarber) {
      return;
    }

    setDraft({
      barber: selectedBarber,
    });
    setBookingPreference({});
    resetAvailability();
    setStep('pickService');

    pushBot(
      `Perfekt. ${selectedBarber.name} ist ausgewählt. Welche Leistung möchtest du?`,
      {
        options: serviceOptions(),
        chips: ['Zurück'],
      },
    );
  }, [
    initialBarber,
    catalogLoading,
    catalogError,
    barbers,
    pushBot,
    resetAvailability,
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const serviceOptions = () =>
    services.map((service) => ({
      label: service.name,
      value: service.id,
      sub: `€${service.price}${service.duration ? ` · ${service.duration} Min.` : ''
        }`,
    }));

  const barberOptions = () =>
    barbers.map((barber) => ({
      label: barber.name,
      value: barber.id,
      sub: barber.title,
    }));

  const getKoblenzDateValue = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('de-DE', {
      timeZone: BUSINESS_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  };

  const formatUtcDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const dateOptions = (
    barber?: BookingDraft['barber'],
  ) => {
    const todayValue = getKoblenzDateValue();
    const [year, month, day] = todayValue.split('-').map(Number);

    const cursor = new Date(
      Date.UTC(year, month - 1, day),
    );

    const options: {
      label: string;
      value: string;
    }[] = [];

    while (options.length < 4) {
      const weekday = cursor.getUTCDay();

      // Online booking is available Monday - Thursday only.
      if (weekday >= 1 && weekday <= 4) {
        const value = formatUtcDate(cursor);

        const baseLabel = new Intl.DateTimeFormat('de-DE', {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
          timeZone: 'UTC',
        }).format(cursor);

        const dayOff = barber
          ? getBarberDayOff(barber.id, value)
          : null;

        options.push({
          label: dayOff
            ? `${baseLabel} · ${barber?.name ?? dayOff.barberName} frei`
            : baseLabel,
          value,
        });
      }

      cursor.setUTCDate(
        cursor.getUTCDate() + 1,
      );
    }

    return options;
  };

  const isPastInKoblenz = (date: string) => {
    return date < getKoblenzDateValue();
  };

  const formatLocalDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatSpecificDate = (
    specificDate: SpecificDate,
  ) => {
    return `${String(specificDate.day).padStart(2, '0')}.${String(
      specificDate.month,
    ).padStart(2, '0')}`;
  };

  const filterSlotsByTimeOfDay = (
    availableSlots: string[],
    timeOfDay?: TimeOfDay,
  ) => {
    if (!timeOfDay) {
      return availableSlots;
    }

    return availableSlots.filter((slot) => {
      const hour = Number.parseInt(
        slot.split(':')[0],
        10,
      );

      if (Number.isNaN(hour)) {
        return false;
      }

      if (timeOfDay === 'morning') {
        return hour < 12;
      }

      if (timeOfDay === 'afternoon') {
        return hour >= 12 && hour < 17;
      }

      return hour >= 17;
    });
  };

  const resolveRelativeDate = (
    relativeDate?: BookingPreference['relativeDate'],
  ) => {
    if (!relativeDate) {
      return undefined;
    }

    const todayValue = getKoblenzDateValue();

    if (relativeDate === 'today') {
      return dateOptions().find(
        (option) =>
          option.value === todayValue,
      )?.value;
    }

    const [year, month, day] = todayValue.split('-').map(Number);

    const tomorrow = new Date(
      Date.UTC(year, month - 1, day + 1),
    );

    const tomorrowValue =
      formatLocalDate(tomorrow);

    return dateOptions().find(
      (option) =>
        option.value === tomorrowValue,
    )?.value;
  };

  const resolveSpecificDate = (
    specificDate?: SpecificDate,
  ) => {
    if (!specificDate) {
      return undefined;
    }

    const todayValue = getKoblenzDateValue();
    const [currentYear] = todayValue.split('-').map(Number);

    let year =
      specificDate.year ??
      currentYear;

    let candidate = new Date(
      Date.UTC(
        year,
        specificDate.month - 1,
        specificDate.day,
      ),
    );

    if (
      candidate.getUTCDate() !== specificDate.day ||
      candidate.getUTCMonth() !==
      specificDate.month - 1
    ) {
      return undefined;
    }

    let value =
      formatLocalDate(candidate);

    if (
      specificDate.year === undefined &&
      value < todayValue
    ) {
      year += 1;

      candidate = new Date(
        Date.UTC(
          year,
          specificDate.month - 1,
          specificDate.day,
        ),
      );

      value =
        formatLocalDate(candidate);
    }

    return dateOptions().find(
      (option) =>
        option.value === value,
    )?.value;
  };

  const resolveWeekday = (
    weekday?: Weekday,
  ) => {
    if (!weekday) {
      return undefined;
    }

    return dateOptions().find((option) => {
      const [year, month, day] =
        option.value.split('-').map(Number);

      const date = new Date(
        Date.UTC(year, month - 1, day),
      );

      const optionWeekday =
        new Intl.DateTimeFormat(
          'de-DE',
          {
            weekday: 'long',
            timeZone: 'UTC',
          },
        )
          .format(date)
          .toLowerCase();

      return optionWeekday === weekday;
    })?.value;
  };

  const describePreference = (
    preference: BookingPreference,
    barberName?: string,
  ) => {
    const parts: string[] = [];

    if (preference.specificDate) {
      parts.push(
        `am ${formatSpecificDate(
          preference.specificDate,
        )}`,
      );
    } else if (preference.relativeDate) {
      parts.push(
        preference.relativeDate === 'today' ? 'heute' : 'morgen',
      );
    } else if (preference.weekday) {
      parts.push(
        `am ${WEEKDAY_LABELS[preference.weekday]}`,
      );
    }

    if (preference.timeOfDay) {
      parts.push(
        `am ${TIME_OF_DAY_LABELS[preference.timeOfDay]}`,
      );
    }

    if (barberName) {
      parts.push(
        `bei ${barberName}`,
      );
    }

    if (
      preference.slotPreference === 'last'
    ) {
      parts.push(
        'zum spätesten verfügbaren Termin',
      );
    }

    if (
      preference.slotPreference === 'first'
    ) {
      parts.push(
        'zum frühesten verfügbaren Termin',
      );
    }

    return parts.join(' ');
  };

  const loadDateAvailability = async ({
    service,
    barber,
    date,
    timeOfDay,
    slotPreference,
    pushDateAsUser = true,
  }: {
    service: NonNullable<BookingDraft['service']>;
    barber: NonNullable<BookingDraft['barber']>;
    date: string;
    timeOfDay?: TimeOfDay;
    slotPreference?: SlotPreference;
    pushDateAsUser?: boolean;
  }) => {
    if (pushDateAsUser) {
      pushUser(date);
    }

    const barberDayOff =
      getBarberDayOff(
        barber.id,
        date,
      );

    if (barberDayOff) {
      setDraft((currentDraft) => ({
        ...currentDraft,
        service,
        barber,
        date: undefined,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      resetAvailability();
      setStep('pickDate');

      pushBot(
        `${barber.name} hat an diesem Wochentag frei. Bitte wähle einen anderen Tag:`,
        {
          options: dateOptions(barber),
          chips: ['Zurück'],
        },
      );

      return;
    }

    if (isPastInKoblenz(date)) {
      setDraft((currentDraft) => ({
        ...currentDraft,
        service,
        barber,
        date: undefined,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      resetAvailability();
      setStep('pickDate');

      pushBot(
        'Dieses Datum ist bereits vorbei. Bitte wähle einen verfügbaren Buchungstag:',
        {
          options: dateOptions(barber),
          chips: ['Zurück'],
        },
      );

      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      service,
      barber,
      date,
      time: undefined,
      name: undefined,
      phone: undefined,
    }));

    setStep('pickTime');

    pushBot(
      timeOfDay
        ? `Einen Moment – ich prüfe die Verfügbarkeit am ${TIME_OF_DAY_LABELS[timeOfDay]} für dich.`
        : 'Einen Moment – ich prüfe die verfügbaren Zeiten für dich.',
    );

    const availableSlots =
      await loadAvailability({
        barberId: barber.id,
        serviceId: service.id,
        date,
      });

    if (availabilityError) {
      pushBot(
        'Ich konnte die Verfügbarkeit gerade nicht prüfen. Wähle bitte einen anderen Tag oder versuche es gleich noch einmal.',
        {
          chips: ['Zurück'],
        },
      );

      return;
    }

    if (availableSlots.length === 0) {
      pushBot(
        'Dieser Tag ist aktuell ausgebucht. Versuch es bitte mit einem anderen Tag.',
        {
          chips: ['Zurück'],
        },
      );

      return;
    }

    const preferredSlots =
      filterSlotsByTimeOfDay(
        availableSlots,
        timeOfDay,
      );

    if (
      timeOfDay &&
      preferredSlots.length === 0
    ) {
      pushBot(
        `An diesem Tag habe ich am ${TIME_OF_DAY_LABELS[timeOfDay]} nichts gefunden. Diese Zeiten sind aber noch verfügbar:`,
        {
          chips: [
            ...availableSlots,
            'Zurück',
          ],
        },
      );

      return;
    }

    const usableSlots =
      timeOfDay
        ? preferredSlots
        : availableSlots;

    if (
      slotPreference &&
      usableSlots.length > 0
    ) {
      const preferredTime =
        slotPreference === 'last'
          ? usableSlots[
          usableSlots.length - 1
          ]
          : usableSlots[0];

      setDraft((currentDraft) => ({
        ...currentDraft,
        time: preferredTime,
      }));

      setStep('enterName');

      const positionText =
        slotPreference === 'last'
          ? 'späteste verfügbare Termin'
          : 'früheste verfügbare Termin';

      pushBot(
        `Perfekt. Der ${positionText}${timeOfDay ? ` am ${TIME_OF_DAY_LABELS[timeOfDay]}` : ''
        } ist um ${preferredTime}. Ich habe ihn für dich ausgewählt. Auf welchen Namen soll ich den Termin eintragen?`,
        {
          chips: ['Zurück'],
        },
      );

      return;
    }

    pushBot(
      timeOfDay
        ? `Perfekt. Hier sind die verfügbaren Zeiten am ${TIME_OF_DAY_LABELS[timeOfDay]}. Welche passt dir am besten?`
        : `Hier sind die verfügbaren Zeiten für den ${date}. Welche passt dir am besten?`,
      {
        chips: [
          ...usableSlots,
          'Zurück',
        ],
      },
    );
  };

  const continueWithPreferredDate = async ({
    service,
    barber,
    preference = bookingPreference,
  }: {
    service: NonNullable<BookingDraft['service']>;
    barber: NonNullable<BookingDraft['barber']>;
    preference?: BookingPreference;
  }) => {
    let preferredDate: string | undefined;

    if (preference.specificDate) {
      preferredDate =
        resolveSpecificDate(
          preference.specificDate,
        );

      if (!preferredDate) {
        setStep('pickDate');

        pushBot(
          `${formatSpecificDate(
            preference.specificDate,
          )} ist online nicht verfügbar. Hier sind die nächsten verfügbaren Buchungstage:`,
          {
            options: dateOptions(barber),
            chips: ['Zurück'],
          },
        );

        return;
      }
    } else if (preference.relativeDate) {
      preferredDate =
        resolveRelativeDate(
          preference.relativeDate,
        );

      if (!preferredDate) {
        setStep('pickDate');

        pushBot(
          preference.relativeDate === 'today'
            ? 'Heute sind keine Online-Termine verfügbar. Hier sind die nächsten verfügbaren Buchungstage:'
            : 'Morgen sind keine Online-Termine verfügbar. Hier sind die nächsten verfügbaren Buchungstage:',
          {
            options: dateOptions(barber),
            chips: ['Zurück'],
          },
        );

        return;
      }
    } else if (preference.weekday) {
      preferredDate =
        resolveWeekday(
          preference.weekday,
        );

      if (!preferredDate) {
        setStep('pickDate');

        pushBot(
          `${WEEKDAY_LABELS[preference.weekday]} ist aktuell kein verfügbarer Online-Buchungstag. Hier sind die nächsten Optionen:`,
          {
            options: dateOptions(barber),
            chips: ['Zurück'],
          },
        );

        return;
      }
    }

    if (!preferredDate) {
      setStep('pickDate');

      pushBot(
        `Perfekt. Dein Termin ist bei ${barber.name}. Welcher Tag passt dir?`,
        {
          options: dateOptions(barber),
          chips: ['Zurück'],
        },
      );

      return;
    }

    await loadDateAvailability({
      service,
      barber,
      date: preferredDate,
      timeOfDay:
        preference.timeOfDay,
      slotPreference:
        preference.slotPreference,
      pushDateAsUser: false,
    });
  };

  const startBooking = () => {
    pushUser('Termin buchen');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('pickService');

    pushBot('Perfekt. Welche Leistung möchtest du buchen?', {
      options: serviceOptions(),
      chips: ['Zurück'],
    });
  };

  const ensureCatalogReady = ({
    requireServices = false,
    requireBarbers = false,
  }: {
    requireServices?: boolean;
    requireBarbers?: boolean;
  }) => {
    if (catalogLoading) {
      pushBot('Einen Moment – ich bereite die Buchung für dich vor.');
      return false;
    }

    if (catalogError) {
      pushBot('Die Buchungsdaten konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.');
      return false;
    }

    if (requireServices && services.length === 0) {
      pushBot('Aktuell sind keine Leistungen online buchbar. Bitte versuche es später erneut.');
      return false;
    }

    if (requireBarbers && barbers.length === 0) {
      pushBot('Aktuell sind keine Barber online verfügbar. Bitte versuche es später erneut.');
      return false;
    }

    return true;
  };

  const showPrices = () => {
    pushUser('Preise ansehen');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    pushBot(
      `Klar. Hier ist unsere komplette Preisliste:\n\n${services
        .map(
          (service) =>
            `• ${service.name}: €${service.price}${service.duration ? ` (${service.duration} Min.)` : ''
            }`,
        )
        .join('\n')}\n\nWenn du möchtest, können wir direkt mit der Buchung starten.`,
      {
        chips: ['Jetzt buchen', 'Barber wählen'],
      },
    );

    setStep('menu');
  };

  const showAvailability = () => {
    pushUser('Verfügbarkeit prüfen');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('pickService');

    pushBot(
      `Online-Termine sind ${BUSINESS.hours.days} von ${BUSINESS.hours.time} verfügbar. Wähle zuerst deine Leistung und ich zeige dir die freien Zeiten.`,
      {
        options: serviceOptions(),
        chips: ['Zurück'],
      },
    );
  };

  const showBarbers = () => {
    pushUser('Barber wählen');

    if (!ensureCatalogReady({
      requireServices: true,
      requireBarbers: true,
    })) {
      return;
    }

    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('pickBarberPre');

    pushBot('Klar. Bei welchem Barber möchtest du deinen Termin buchen?', {
      options: barberOptions(),
      chips: ['Zurück'],
    });
  };

  const startCancellation = () => {
    pushUser('Termin stornieren');
    setCancellationBookings([]);
    setSelectedCancellationBookingId(null);
    setCancellationPhone(null);
    setStep('cancelEnterPhone');

    pushBot(
      'Klar. Gib bitte dieselbe Telefonnummer ein, die du bei der Buchung verwendet hast.',
      {
        chips: ['Zurück'],
      },
    );
  };

  const submitCancellationPhone = async (phone: string) => {
    const result = validatePhoneNumber(phone);

    pushUser(phone);

    if (!result.valid) {
      pushBot(
        `${result.error} Bitte gib dieselbe Telefonnummer ein, die du bei der Buchung verwendet hast.`,
        {
          chips: ['Zurück'],
        },
      );
      return;
    }

    try {
      pushBot('Einen Moment – ich suche deine kommenden Termine.');

      const response = await fetch(
        `/api/bookings/cancel?phone=${encodeURIComponent(result.value)}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Termine konnten nicht gefunden werden.',
        );
      }

      if (!Array.isArray(data.bookings) || data.bookings.length === 0) {
        setStep('welcome');

        pushBot(
          'Ich konnte unter dieser Telefonnummer keine kommenden Termine finden. Prüfe bitte die Nummer oder kontaktiere uns, wenn du Hilfe brauchst.',
        );
        return;
      }

      setCancellationPhone(result.value);
      setCancellationBookings(data.bookings);
      setStep('cancelPickBooking');

      pushBot(
        data.bookings.length === 1
          ? 'Ich habe deinen kommenden Termin gefunden. Wähle ihn unten aus, um mit der Stornierung fortzufahren.'
          : 'Ich habe deine kommenden Termine gefunden. Welchen möchtest du stornieren?',
        {
          options: data.bookings.map(
            (booking: {
              id: string;
              barberId: string;
              serviceId: string;
              barberName: string;
              serviceName: string;
              bookingDate: string;
              startTime: string;
            }) => {
              const localizedService =
                services.find(
                  (service) =>
                    service.id === booking.serviceId,
                );

              return {
                label: `${localizedService?.name ?? booking.serviceName} bei ${booking.barberName}`,
                value: booking.id,
                sub: `${booking.bookingDate} · ${booking.startTime}`,
              };
            },
          ),
          chips: ['Zurück'],
        },
      );
    } catch (error) {
      console.error('Find booking error:', error);

      pushBot(
        'Deine Termine konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.',
        {
          chips: ['Zurück'],
        },
      );
    }
  };

  const selectCancellationBooking = (bookingId: string) => {
    const booking = cancellationBookings.find(
      (item) => item.id === bookingId,
    );

    if (!booking) {
      return;
    }

    setSelectedCancellationBookingId(bookingId);
    setStep('cancelConfirm');
    pushUser('Termin auswählen');

    pushBot(
      `Möchtest du deinen Termin am ${booking.bookingDate} um ${booking.startTime} wirklich stornieren?`,
      {
        chips: ['Stornierung bestätigen', 'Zurück'],
      },
    );
  };

  const confirmCancellation = async () => {
    if (!selectedCancellationBookingId || cancellingBooking) {
      return;
    }

    pushUser('Stornierung bestätigen');
    setCancellingBooking(true);

    try {
      pushBot('Einen Moment – ich storniere deinen Termin.');

      const response = await fetch(
        `/api/bookings/${selectedCancellationBookingId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: cancellationPhone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Termin konnte nicht storniert werden.',
        );
      }

      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setCancellationPhone(null);
      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot(
        'Dein Termin wurde erfolgreich storniert.',
      );
    } catch (error) {
      console.error('Cancellation error:', error);

      pushBot(
        'Der Termin konnte gerade nicht storniert werden. Bitte versuche es gleich noch einmal.',
        {
          chips: ['Stornierung bestätigen', 'Zurück'],
        },
      );
    } finally {
      setCancellingBooking(false);
    }
  };

  const handleBack = () => {
    pushUser('Zurück');

    if (step === 'cancelEnterPhone') {
      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setStep('welcome');

      pushBot('Kein Problem. Was möchtest du machen?');

      return;
    }

    if (step === 'cancelPickBooking') {
      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setStep('cancelEnterPhone');

      pushBot(
        'Kein Problem. Gib bitte die Telefonnummer ein, die du bei der Buchung verwendet hast.',
        {
          chips: ['Zurück'],
        },
      );

      return;
    }

    if (step === 'cancelConfirm') {
      setSelectedCancellationBookingId(null);
      setStep('cancelPickBooking');

      pushBot('Kein Problem. Wähle den Termin aus, den du stornieren möchtest.', {
        options: cancellationBookings.map((booking) => {
          const barber = barbers.find((item) => item.id === booking.barberId);
          const service = services.find((item) => item.id === booking.serviceId);

          return {
            label: `${service?.name ?? 'Termin'} bei ${barber?.name ?? 'deinem Barber'}`,
            value: booking.id,
            sub: `${booking.bookingDate} · ${booking.startTime}`,
          };
        }),
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'pickService') {
      if (draft.barber) {
        setDraft({});
        resetAvailability();
        setStep('pickBarberPre');

        pushBot('Klar. Gehen wir zurück zur Barber-Auswahl.', {
          options: barberOptions(),
          chips: ['Zurück'],
        });

        return;
      }

      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot('Klar. Was möchtest du machen?');

      return;
    }

    if (step === 'pickBarberPre') {
      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot('Kein Problem. Was möchtest du machen?');

      return;
    }

    if (step === 'pickBarber') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        service: undefined,
        barber: undefined,
        date: undefined,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      resetAvailability();
      setStep('pickService');

      pushBot('Klar. Wähle deine Leistung noch einmal.', {
        options: serviceOptions(),
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'pickDate') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        barber: undefined,
        date: undefined,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      resetAvailability();
      setStep('pickBarber');

      pushBot('Kein Problem. Wähle den Barber, bei dem du buchen möchtest.', {
        options: barberOptions(),
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'pickTime') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        date: undefined,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      resetAvailability();
      setStep('pickDate');

      pushBot('Klar. Wähle einen anderen Tag.', {
        options: dateOptions(draft.barber),
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'enterName') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        time: undefined,
        name: undefined,
        phone: undefined,
      }));

      setStep('pickTime');

      if (slots.length > 0) {
        const preferredSlots =
          filterSlotsByTimeOfDay(
            slots,
            bookingPreference.timeOfDay,
          );

        pushBot('Kein Problem. Wähle die Zeit, die dir am besten passt.', {
          chips: [
            ...(preferredSlots.length > 0
              ? preferredSlots
              : slots),
            'Zurück',
          ],
        });

        return;
      }

      setDraft((currentDraft) => ({
        ...currentDraft,
        date: undefined,
      }));

      resetAvailability();
      setStep('pickDate');

      pushBot('Kein Problem. Wähle deinen Tag noch einmal.', {
        options: dateOptions(draft.barber),
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'enterPhone') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        name: undefined,
        phone: undefined,
      }));

      setStep('enterName');

      pushBot('Klar. Auf welchen Namen soll ich den Termin eintragen?', {
        chips: ['Zurück'],
      });

      return;
    }

    if (step === 'confirm') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        phone: undefined,
      }));

      setStep('enterPhone');

      pushBot('Kein Problem. Welche Telefonnummer sollen wir für deine Buchung verwenden?', {
        chips: ['Zurück'],
      });

      return;
    }

    pushBot('Du bist bereits am Anfang.');

    setStep('welcome');
  };

  const handleChip = (chip: string) => {
    if (chip === 'Zurück') {
      handleBack();
      return true;
    }

    if (chip === 'Termin buchen' || chip === 'Jetzt buchen') {
      startBooking();
      return true;
    }

    if (chip === 'Preise ansehen') {
      showPrices();
      return true;
    }

    if (chip === 'Verfügbarkeit prüfen') {
      showAvailability();
      return true;
    }

    if (chip === 'Barber wählen') {
      showBarbers();
      return true;
    }

    if (chip === 'Termin stornieren') {
      startCancellation();
      return true;
    }

    if (chip === 'Buchung bestätigen') {
      confirmBooking();
      return true;
    }

    if (chip === 'Stornierung bestätigen') {
      void confirmCancellation();
      return true;
    }

    if (chip === 'Neu starten' || chip === 'Weiteren Termin buchen') {
      restart();
      return true;
    }

    if (slots.includes(chip) && step === 'pickTime') {
      pickTime(chip);
      return true;
    }

    return false;
  };

  const pickService = async (id: string) => {
    const service = services.find((item) => item.id === id);

    if (!service) {
      return;
    }

    const selectedBarber = draft.barber;

    setDraft((currentDraft) => ({
      ...currentDraft,
      service,
      date: undefined,
      time: undefined,
      name: undefined,
      phone: undefined,
    }));

    resetAvailability();
    pushUser(service.name);

    if (selectedBarber) {
      await continueWithPreferredDate({
        service,
        barber: selectedBarber,
      });

      return;
    }

    setStep('pickBarber');

    const preferenceText =
      describePreference(
        bookingPreference,
      );

    pushBot(
      preferenceText
        ? `Gute Wahl. ${service.name} kostet €${service.price}. Deine Auswahl ${preferenceText} habe ich übernommen. Jetzt wählst du deinen Barber.`
        : `Gute Wahl. ${service.name} kostet €${service.price}. Jetzt wählst du deinen Barber.`,
      {
        options: barberOptions(),
        chips: ['Zurück'],
      },
    );
  };

  const preselectBarber = (id: string) => {
    const barber = barbers.find((item) => item.id === id);

    if (!barber) {
      pushBot('Dieser Barber ist aktuell nicht buchbar. Bitte wähle einen anderen.');
      return;
    }

    setDraft({ barber });
    resetAvailability();
    pushUser(barber.name);
    setStep('pickService');

    pushBot(
      `Perfekt. ${barber.name} ist ausgewählt. Welche Leistung möchtest du?`,
      {
        options: serviceOptions(),
        chips: ['Zurück'],
      },
    );
  };

  const pickBarber = async (id: string) => {
    const barber = barbers.find((item) => item.id === id);

    if (!barber) {
      return;
    }

    const selectedService = draft.service;

    setDraft((currentDraft) => ({
      ...currentDraft,
      barber,
      date: undefined,
      time: undefined,
      name: undefined,
      phone: undefined,
    }));

    resetAvailability();

    pushUser(barber.name);

    if (selectedService) {
      await continueWithPreferredDate({
        service: selectedService,
        barber,
      });

      return;
    }

    setStep('pickService');

    pushBot(
      `Perfekt. ${barber.name} ist ausgewählt. Welche Leistung möchtest du?`,
      {
        options: serviceOptions(),
        chips: ['Zurück'],
      },
    );
  };

  const pickDate = async (date: string) => {
    if (!draft.service || !draft.barber) {
      pushBot(
        'Ich brauche noch deine Leistung und deinen Barber, bevor ich die verfügbaren Zeiten prüfen kann.',
        {
          chips: ['Zurück'],
        },
      );
      return;
    }

    await loadDateAvailability({
      service: draft.service,
      barber: draft.barber,
      date,
      timeOfDay:
        bookingPreference.timeOfDay,
      slotPreference:
        bookingPreference.slotPreference,
    });
  };

  const pickTime = (time: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      time,
    }));

    pushUser(time);
    setStep('enterName');

    pushBot('Super. Deine Zeit ist ausgewählt. Auf welchen Namen soll ich den Termin eintragen?', {
      chips: ['Zurück'],
    });
  };

  const submitName = (name: string) => {
    const result = validateCustomerName(name);

    pushUser(name);

    if (!result.valid) {
      pushBot(result.error);
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      name: result.value,
    }));

    setStep('enterPhone');

    pushBot(
      `Danke, ${result.value.split(' ')[0]}. Noch eine letzte Angabe: Welche Telefonnummer sollen wir für deine Buchung verwenden?`,
      {
        chips: ['Zurück'],
      },
    );
  };

  const submitPhone = (phone: string) => {
    const result = validatePhoneNumber(phone);

    pushUser(phone);

    if (!result.valid) {
      pushBot(
        `${result.error} Du kannst sie z. B. so eingeben: 0176 12345678 oder +49 176 12345678.`,
      );
      return;
    }

    const finalDraft = {
      ...draft,
      phone: result.value,
    };

    setDraft(finalDraft);
    setStep('confirm');

    pushBot('Alles ist bereit. Prüfe bitte kurz deine Termindaten, bevor du die Buchung bestätigst.', {
      booking: finalDraft,
      chips: ['Buchung bestätigen', 'Zurück', 'Neu starten'],
    });
  };

  const confirmBooking = async () => {
    pushUser('Buchung bestätigen');

    if (
      !draft.service ||
      !draft.barber ||
      !draft.date ||
      !draft.time ||
      !draft.name ||
      !draft.phone
    ) {
      pushBot('Einige Buchungsdaten fehlen noch. Bitte starte neu, damit ich deinen Termin korrekt abschließen kann.');
      return;
    }

    try {
      pushBot('Perfekt. Ich reserviere deinen Termin jetzt.');

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barberId: draft.barber.id,
          serviceId: draft.service.id,
          customerName: draft.name,
          customerPhone: draft.phone,
          bookingDate: draft.date,
          startTime: draft.time,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Buchung konnte nicht erstellt werden.',
        );
      }

      setStep('done');

      pushBot(
        `Dein Termin ist bestätigt.\n\n${draft.service.name} bei ${draft.barber.name}\n${draft.date} um ${draft.time}\nName: ${draft.name}\nTelefon: ${draft.phone}\n\nWir freuen uns auf dich bei ${BUSINESS.address}. Wenn du vorher etwas brauchst, erreichst du uns unter ${BUSINESS.phoneFormatted}.`,
      );

      onBooked?.(draft);

    } catch (error) {
      console.error('Booking error:', error);

      pushBot(
        'Die Buchung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut.',
        {
          chips: ['Neu starten'],
        },
      );
    }
  };

  const restart = () => {
    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('welcome');
    pushUser('Neu starten');

    pushBot('Klar. Starten wir neu. Was möchtest du machen?');
  };

  const handleSmallTalk = (
    smallTalk: 'greeting' | 'howAreYou' | 'thanks' | 'goodbye',
  ) => {
    if (smallTalk === 'howAreYou') {
      pushBot(
        "Mir geht’s gut, danke! Ich hoffe, dir auch. Wie kann ich dir helfen?",
      );
      return;
    }

    if (smallTalk === 'thanks') {
      pushBot(
        "Sehr gerne!",
      );
      return;
    }

    if (smallTalk === 'goodbye') {
      pushBot(
        'Mach’s gut. Wir freuen uns auf dich bei VIP FADES.',
      );
      return;
    }

    pushBot(
      'Hallo und willkommen bei VIP FADES. Wie kann ich dir helfen?',
    );
  };

  const isActiveBookingStep = () =>
    step === 'pickService' ||
    step === 'pickBarberPre' ||
    step === 'pickBarber' ||
    step === 'pickDate' ||
    step === 'pickTime' ||
    step === 'enterName' ||
    step === 'enterPhone' ||
    step === 'confirm';

  const handleNaturalInput = async (value: string) => {
    const parsed = parseBookingIntent(value, {
      barbers,
      services,
    });

    if (parsed.smallTalk && !parsed.wantsBooking) {
      pushUser(value);
      handleSmallTalk(parsed.smallTalk);
      return true;
    }

    if (!parsed.wantsBooking) {
      return false;
    }

    pushUser(value);

    if (!ensureCatalogReady({
      requireServices: true,
      requireBarbers: true,
    })) {
      return true;
    }

    const activeBooking = isActiveBookingStep();

    const parsedService = parsed.serviceName
      ? services.find(
        (service) =>
          service.name.toLowerCase() === parsed.serviceName?.toLowerCase(),
      )
      : undefined;

    const parsedBarber = parsed.barberName
      ? barbers.find(
        (barber) =>
          barber.name.toLowerCase() === parsed.barberName?.toLowerCase(),
      )
      : undefined;

    const hasParsedDate = Boolean(
      parsed.specificDate ||
      parsed.relativeDate ||
      parsed.weekday,
    );

    const hasParsedTimePreference = Boolean(
      parsed.timeOfDay ||
      parsed.slotPreference,
    );

    const changingService =
      activeBooking &&
      Boolean(parsedService) &&
      parsedService?.id !== draft.service?.id;

    const changingBarber =
      activeBooking &&
      Boolean(parsedBarber) &&
      parsedBarber?.id !== draft.barber?.id;

    const changingDate =
      activeBooking && hasParsedDate;

    const changingTime =
      activeBooking && hasParsedTimePreference;

    const nextPreference: BookingPreference = {
      relativeDate:
        parsed.relativeDate ?? bookingPreference.relativeDate,
      specificDate:
        parsed.specificDate ?? bookingPreference.specificDate,
      weekday:
        parsed.weekday ?? bookingPreference.weekday,
      timeOfDay:
        parsed.timeOfDay ?? bookingPreference.timeOfDay,
      slotPreference:
        parsed.slotPreference ?? bookingPreference.slotPreference,
    };

    if (parsed.specificDate) {
      nextPreference.relativeDate = undefined;
      nextPreference.weekday = undefined;
    } else if (parsed.relativeDate) {
      nextPreference.specificDate = undefined;
      nextPreference.weekday = undefined;
    } else if (parsed.weekday) {
      nextPreference.specificDate = undefined;
      nextPreference.relativeDate = undefined;
    }

    setBookingPreference(nextPreference);

    const existingDraft = activeBooking ? draft : {};

    const selectedService =
      parsedService ?? existingDraft.service;

    const selectedBarber =
      parsedBarber ?? existingDraft.barber;

    if (
      activeBooking &&
      (changingService ||
        changingBarber ||
        changingDate ||
        changingTime)
    ) {
      setDraft({
        ...existingDraft,
        service: selectedService,
        barber: selectedBarber,
        date:
          changingService || changingBarber || changingDate
            ? undefined
            : existingDraft.date,
        time: undefined,
        name: undefined,
        phone: undefined,
      });

      resetAvailability();

      if (!selectedService) {
        setStep('pickService');
        pushBot('Kein Problem. Welche Leistung möchtest du stattdessen?', {
          options: serviceOptions(),
          chips: ['Zurück'],
        });
        return true;
      }

      if (!selectedBarber) {
        setStep('pickBarber');
        pushBot('Kein Problem. Bei welchem Barber möchtest du stattdessen buchen?', {
          options: barberOptions(),
          chips: ['Zurück'],
        });
        return true;
      }

      if (
        changingTime &&
        !changingService &&
        !changingBarber &&
        !changingDate &&
        existingDraft.date
      ) {
        await loadDateAvailability({
          service: selectedService,
          barber: selectedBarber,
          date: existingDraft.date,
          timeOfDay: nextPreference.timeOfDay,
          slotPreference: nextPreference.slotPreference,
          pushDateAsUser: false,
        });
        return true;
      }

      if (
        (changingService || changingBarber) &&
        existingDraft.date &&
        !changingDate
      ) {
        await loadDateAvailability({
          service: selectedService,
          barber: selectedBarber,
          date: existingDraft.date,
          timeOfDay: nextPreference.timeOfDay,
          slotPreference: nextPreference.slotPreference,
          pushDateAsUser: false,
        });
        return true;
      }

      await continueWithPreferredDate({
        service: selectedService,
        barber: selectedBarber,
        preference: nextPreference,
      });

      return true;
    }

    setDraft({
      ...existingDraft,
      service: selectedService,
      barber: selectedBarber,
      date: undefined,
      time: undefined,
      name: undefined,
      phone: undefined,
    });

    resetAvailability();

    if (!selectedService) {
      setStep('pickService');

      const preferenceText = describePreference(
        nextPreference,
        selectedBarber?.name,
      );

      pushBot(
        preferenceText
          ? `Klar. Ich habe deine Auswahl ${preferenceText}. Welche Leistung möchtest du?`
          : 'Klar. Welche Leistung möchtest du?',
        {
          options: serviceOptions(),
          chips: ['Zurück'],
        },
      );

      return true;
    }

    if (!selectedBarber) {
      setStep('pickBarber');

      const preferenceText = describePreference(nextPreference);

      pushBot(
        preferenceText
          ? `Perfekt. ${selectedService.name} ist ausgewählt und deine Auswahl ${preferenceText} habe ich übernommen. Bei welchem Barber möchtest du buchen?`
          : `Perfekt. ${selectedService.name} ist ausgewählt. Bei welchem Barber möchtest du buchen?`,
        {
          options: barberOptions(),
          chips: ['Zurück'],
        },
      );

      return true;
    }

    await continueWithPreferredDate({
      service: selectedService,
      barber: selectedBarber,
      preference: nextPreference,
    });

    return true;
  };

  const handleOption = (value: string) => {
    if (step === 'pickService') {
      void pickService(value);
      return;
    }

    if (step === 'pickBarber') {
      void pickBarber(value);
      return;
    }

    if (step === 'pickBarberPre') {
      preselectBarber(value);
      return;
    }

    if (step === 'pickDate') {
      void pickDate(value);
      return;
    }

    if (step === 'cancelPickBooking') {
      selectCancellationBooking(value);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const value = input.trim();

    if (!value) {
      return;
    }

    setInput('');

    if (step === 'enterName') {
      submitName(value);
      return;
    }

    if (step === 'enterPhone') {
      submitPhone(value);
      return;
    }

    if (step === 'cancelEnterPhone') {
      await submitCancellationPhone(value);
      return;
    }

    const handled = handleChip(value);

    if (handled) {
      return;
    }

    const naturallyHandled =
      await handleNaturalInput(value);

    if (naturallyHandled) {
      return;
    }

    pushUser(value);

    pushBot(
      "Ich bin nicht ganz sicher, was du meinst. Wähle unten eine Option und ich helfe dir weiter.",
    );

    setStep('welcome');
  };

  const showInput =
    step === 'enterName' ||
    step === 'enterPhone' ||
    step === 'cancelEnterPhone';

  const inputPlaceholder =
    step === 'enterName'
      ? 'Dein Name'
      : step === 'enterPhone' || step === 'cancelEnterPhone'
        ? 'Telefonnummer'
        : 'Nachricht…';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-[#111214]/95 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brand-border bg-[#0e0f11] px-5 py-4">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream/5 ring-1 ring-brand-cream/25">
            <Sparkles className="h-5 w-5 text-brand-cream" />
          </div>

          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0e0f11]" />
        </div>

        <div className="flex-1">
          <p className="font-serif text-lg leading-none text-brand-textPrimary">
            Buchungsassistent
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-cream">
            Online · KI-gestützt
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-brand-cream/70" />

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-colors hover:border-brand-cream hover:text-brand-cream"
              aria-label="Chat schließen"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            msg={message}
            onChip={handleChip}
            onOption={handleOption}
          />
        ))}

        {(typing || availabilityLoading) && (
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm border border-brand-border/50 bg-[#1a1b1e] px-4 py-3">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-cream" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-cream" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-cream" />
          </div>
        )}
      </div>

      {/* Quick actions */}
      {(step === 'welcome' || step === 'done') && (
        <div className="border-t border-brand-border/40 px-4 pb-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.icon;

              return (
                <button
                  type="button"
                  key={action.value}
                  onClick={() => handleChip(action.label)}
                  disabled={catalogLoading}
                  className="group flex items-center gap-2 rounded-xl border border-brand-border bg-[#1a1b1e] px-3 py-2.5 text-left text-[13px] font-medium text-brand-textPrimary/90 transition-all hover:border-brand-cream/40 hover:bg-brand-cream/5"
                >
                  <ActionIcon className="h-4 w-4 flex-shrink-0 text-brand-cream transition-colors" />

                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-brand-border bg-[#0e0f11] px-4 py-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={showInput ? inputPlaceholder : 'Nachricht…'}
          className="flex-1 rounded-full bg-[#1a1b1e] px-4 py-2.5 text-sm text-brand-textPrimary outline-none ring-1 ring-brand-border placeholder:text-brand-textSecondary focus:ring-brand-cream/35"
        />

        <button
          type="submit"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-bg transition-colors hover:bg-brand-textPrimary"
          aria-label="Senden"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({
  msg,
  onChip,
  onOption,
}: {
  msg: Msg;
  onChip: (chip: string) => void;
  onOption: (value: string) => void;
}) {
  const isBot = msg.role === 'bot';

  return (
    <div
      className={`message-in flex ${isBot ? 'justify-start' : 'justify-end'
        }`}
    >
      <div className="max-w-[85%]">
        <div
          className={`whitespace-pre-line rounded-2xl border px-4 py-3 text-sm leading-relaxed ${isBot
            ? 'rounded-tl-sm border-brand-border/50 bg-[#1a1b1e] text-brand-textPrimary/95'
            : 'rounded-tr-sm border-brand-cream/30 bg-brand-cream font-medium text-brand-bg'
            }`}
        >
          {msg.text}
        </div>

        {msg.options && (
          <div className="mt-3 grid gap-2">
            {msg.options.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => onOption(option.value)}
                className="flex items-center justify-between rounded-xl border border-brand-border bg-[#1a1b1e] px-4 py-3 text-left transition-all hover:border-brand-cream/40 hover:bg-brand-cream/5"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-brand-textPrimary">
                    {option.label}
                  </span>

                  {option.sub && (
                    <span className="text-xs font-light text-brand-textSecondary">
                      {option.sub}
                    </span>
                  )}
                </span>

                <span className="text-brand-cream">→</span>
              </button>
            ))}
          </div>
        )}

        {msg.chips && (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg.chips.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => onChip(chip)}
                className="rounded-full border border-brand-cream/30 bg-brand-cream/5 px-3.5 py-1.5 text-xs font-medium text-brand-cream transition-all hover:bg-brand-cream hover:text-brand-bg"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {msg.booking && (
          <div className="mt-3 rounded-2xl border border-brand-cream/20 bg-[#1a1b1e] p-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <SummaryItem
                label="Leistung"
                value={msg.booking.service?.name}
              />

              <SummaryItem
                label="Barber"
                value={msg.booking.barber?.name}
              />

              <SummaryItem label="Datum" value={msg.booking.date} />

              <SummaryItem label="Uhrzeit" value={msg.booking.time} />

              <SummaryItem label="Name" value={msg.booking.name} />

              <SummaryItem label="Telefon" value={msg.booking.phone} />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
              <span className="text-xs uppercase tracking-[0.18em] text-brand-textSecondary">
                Gesamt
              </span>

              <span className="font-serif text-xl text-brand-cream">
                €{msg.booking.service?.price}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-brand-textSecondary">
        {label}
      </p>

      <p className="mt-0.5 font-medium text-brand-textPrimary">
        {value || '—'}
      </p>
    </div>
  );
}