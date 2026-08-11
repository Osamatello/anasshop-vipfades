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

export default function ChatInterface({
  onBooked,
  onClose,
}: {
  onBooked?: (booking: BookingDraft) => void;
  onClose?: () => void;
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
      `Welcome to ${BUSINESS.name}. I'm your personal grooming concierge. I can help you choose your service, find your preferred barber, and reserve the best available time. How can I help you today?`,
      {
        chips: QUICK_ACTIONS.map((action) => action.label),
      },
    );

    return () => {
      mountedRef.current = false;
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current.clear();
      pendingBotMessagesRef.current = 0;
    };
  }, [pushBot]);

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
      sub: `€${service.price}${service.duration ? ` · ${service.duration} min` : ''
        }`,
    }));

  const barberOptions = () =>
    barbers.map((barber) => ({
      label: barber.name,
      value: barber.id,
      sub: barber.title,
    }));

  const getKoblenzDateValue = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
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

  const dateOptions = () => {
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

        const label = new Intl.DateTimeFormat('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
          timeZone: 'UTC',
        }).format(cursor);

        options.push({
          label,
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
          'en-US',
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
        `on ${formatSpecificDate(
          preference.specificDate,
        )}`,
      );
    } else if (preference.relativeDate) {
      parts.push(
        preference.relativeDate,
      );
    } else if (preference.weekday) {
      parts.push(
        `on ${preference.weekday}`,
      );
    }

    if (preference.timeOfDay) {
      parts.push(
        `in the ${preference.timeOfDay}`,
      );
    }

    if (barberName) {
      parts.push(
        `with ${barberName}`,
      );
    }

    if (
      preference.slotPreference === 'last'
    ) {
      parts.push(
        'for the last available appointment',
      );
    }

    if (
      preference.slotPreference === 'first'
    ) {
      parts.push(
        'for the first available appointment',
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
        'That date has already passed. Please choose one of the available booking days:',
        {
          options: dateOptions(),
          chips: ['Back'],
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
        ? `One moment — I’m checking ${timeOfDay} availability for you.`
        : 'One moment — I’m checking the available times for you.',
    );

    const availableSlots =
      await loadAvailability({
        barberId: barber.id,
        serviceId: service.id,
        date,
      });

    if (availabilityError) {
      pushBot(
        'I couldn’t check the availability right now. Please choose another day or try again shortly.',
        {
          chips: ['Back'],
        },
      );

      return;
    }

    if (availableSlots.length === 0) {
      pushBot(
        'That day is fully booked at the moment. Let’s try another day.',
        {
          chips: ['Back'],
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
        `I couldn’t find any ${timeOfDay} appointments on that day, but these times are still available:`,
        {
          chips: [
            ...availableSlots,
            'Back',
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
          ? 'last available'
          : 'first available';

      pushBot(
        `Perfect. The ${positionText}${timeOfDay ? ` ${timeOfDay}` : ''
        } appointment is ${preferredTime}. I’ve selected it for you. What name should I put the appointment under?`,
        {
          chips: ['Back'],
        },
      );

      return;
    }

    pushBot(
      timeOfDay
        ? `Perfect. Here are the available ${timeOfDay} times. Which one works best for you?`
        : `Here are the available times for ${date}. Which one works best for you?`,
      {
        chips: [
          ...usableSlots,
          'Back',
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
          )} isn’t available for online booking. Here are the next available booking days:`,
          {
            options: dateOptions(),
            chips: ['Back'],
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
            ? 'Today isn’t available for online appointments. Here are the next available booking days:'
            : 'Tomorrow isn’t available for online appointments. Here are the next available booking days:',
          {
            options: dateOptions(),
            chips: ['Back'],
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
          `${preference.weekday} isn’t one of the currently available online booking days. Here are the next available options:`,
          {
            options: dateOptions(),
            chips: ['Back'],
          },
        );

        return;
      }
    }

    if (!preferredDate) {
      setStep('pickDate');

      pushBot(
        `Perfect. You’ll be with ${barber.name}. Which day would you prefer?`,
        {
          options: dateOptions(),
          chips: ['Back'],
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
    pushUser('Book an appointment');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('pickService');

    pushBot('Perfect. Let’s tailor your appointment. Which service would you like today?', {
      options: serviceOptions(),
      chips: ['Back'],
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
      pushBot('Just a moment — I’m preparing the booking menu for you.');
      return false;
    }

    if (catalogError) {
      pushBot('I’m having trouble loading the booking menu right now. Please try again shortly.');
      return false;
    }

    if (requireServices && services.length === 0) {
      pushBot('There are no services available for online booking right now. Please try again later.');
      return false;
    }

    if (requireBarbers && barbers.length === 0) {
      pushBot('There are no barbers available for online booking right now. Please try again later.');
      return false;
    }

    return true;
  };

  const showPrices = () => {
    pushUser('View prices');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    pushBot(
      `Of course. Here’s our full service menu:\n\n${services
        .map(
          (service) =>
            `• ${service.name}: €${service.price}${service.duration ? ` (${service.duration} min)` : ''
            }`,
        )
        .join('\n')}\n\nIf you’re ready, I can take you straight into booking.`,
      {
        chips: ['Book now', 'Choose a barber'],
      },
    );

    setStep('menu');
  };

  const showAvailability = () => {
    pushUser('Check availability');

    if (!ensureCatalogReady({ requireServices: true })) {
      return;
    }

    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('pickService');

    pushBot(
      `Online appointments are available ${BUSINESS.hours.days}, ${BUSINESS.hours.time}. Choose your service first and I’ll find the available times for you.`,
      {
        options: serviceOptions(),
        chips: ['Back'],
      },
    );
  };

  const showBarbers = () => {
    pushUser('Choose a barber');

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

    pushBot('Absolutely. Who would you like to book with?', {
      options: barberOptions(),
      chips: ['Back'],
    });
  };

  const startCancellation = () => {
    pushUser('Cancel my appointment');
    setCancellationBookings([]);
    setSelectedCancellationBookingId(null);
    setStep('cancelEnterPhone');

    pushBot(
      'Of course. Please enter the same phone number you used when you booked your appointment.',
      {
        chips: ['Back'],
      },
    );
  };

  const submitCancellationPhone = async (phone: string) => {
    const result = validatePhoneNumber(phone);

    pushUser(phone);

    if (!result.valid) {
      pushBot(
        `${result.error} Please enter the same phone number you used for the booking.`,
        {
          chips: ['Back'],
        },
      );
      return;
    }

    try {
      pushBot('One moment — I’m looking for your upcoming appointments.');

      const response = await fetch(
        `/api/bookings/cancel?phone=${encodeURIComponent(result.value)}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Failed to find bookings.',
        );
      }

      if (!Array.isArray(data.bookings) || data.bookings.length === 0) {
        setStep('welcome');

        pushBot(
          'I couldn’t find any upcoming appointments with that phone number. Please check the number or contact us if you need help.',
          {
            chips: QUICK_ACTIONS.map((action) => action.label),
          },
        );
        return;
      }

      setCancellationBookings(data.bookings);
      setStep('cancelPickBooking');

      pushBot(
        data.bookings.length === 1
          ? 'I found your upcoming appointment. Select it below to continue with the cancellation.'
          : 'I found your upcoming appointments. Which one would you like to cancel?',
        {
          options: data.bookings.map(
            (booking: {
              id: string;
              barberName: string;
              serviceName: string;
              bookingDate: string;
              startTime: string;
            }) => ({
              label: `${booking.serviceName} with ${booking.barberName}`,
              value: booking.id,
              sub: `${booking.bookingDate} · ${booking.startTime}`,
            }),
          ),
          chips: ['Back'],
        },
      );
    } catch (error) {
      console.error('Find booking error:', error);

      pushBot(
        'I’m sorry, I couldn’t find your appointments right now. Please try again shortly.',
        {
          chips: ['Back'],
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
    pushUser('Select appointment');

    pushBot(
      `Are you sure you want to cancel your appointment on ${booking.bookingDate} at ${booking.startTime}?`,
      {
        chips: ['Confirm cancellation', 'Back'],
      },
    );
  };

  const confirmCancellation = async () => {
    if (!selectedCancellationBookingId || cancellingBooking) {
      return;
    }

    pushUser('Confirm cancellation');
    setCancellingBooking(true);

    try {
      pushBot('One moment — I’m cancelling your appointment now.');

      const response = await fetch(
        `/api/bookings/${selectedCancellationBookingId}/cancel`,
        {
          method: 'POST',
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Failed to cancel booking.',
        );
      }

      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot(
        'Your appointment has been cancelled successfully.',
        {
          chips: QUICK_ACTIONS.map((action) => action.label),
        },
      );
    } catch (error) {
      console.error('Cancellation error:', error);

      pushBot(
        'I’m sorry, I couldn’t cancel the appointment right now. Please try again shortly.',
        {
          chips: ['Confirm cancellation', 'Back'],
        },
      );
    } finally {
      setCancellingBooking(false);
    }
  };

  const handleBack = () => {
    pushUser('Back');

    if (step === 'cancelEnterPhone') {
      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setStep('welcome');

      pushBot('No problem. What would you like to do?', {
        chips: QUICK_ACTIONS.map((action) => action.label),
      });

      return;
    }

    if (step === 'cancelPickBooking') {
      setCancellationBookings([]);
      setSelectedCancellationBookingId(null);
      setStep('cancelEnterPhone');

      pushBot(
        'No problem. Please enter the phone number used for the booking.',
        {
          chips: ['Back'],
        },
      );

      return;
    }

    if (step === 'cancelConfirm') {
      setSelectedCancellationBookingId(null);
      setStep('cancelPickBooking');

      pushBot('No problem. Choose the appointment you want to cancel.', {
        options: cancellationBookings.map((booking) => {
          const barber = barbers.find((item) => item.id === booking.barberId);
          const service = services.find((item) => item.id === booking.serviceId);

          return {
            label: `${service?.name ?? 'Appointment'} with ${barber?.name ?? 'your barber'}`,
            value: booking.id,
            sub: `${booking.bookingDate} · ${booking.startTime}`,
          };
        }),
        chips: ['Back'],
      });

      return;
    }

    if (step === 'pickService') {
      if (draft.barber) {
        setDraft({});
        resetAvailability();
        setStep('pickBarberPre');

        pushBot('Of course. Let’s go back to your barber selection.', {
          options: barberOptions(),
          chips: ['Back'],
        });

        return;
      }

      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot('Of course. What would you like to do?', {
        chips: QUICK_ACTIONS.map((action) => action.label),
      });

      return;
    }

    if (step === 'pickBarberPre') {
      setDraft({});
      setBookingPreference({});
      resetAvailability();
      setStep('welcome');

      pushBot('No problem. What would you like to do?', {
        chips: QUICK_ACTIONS.map((action) => action.label),
      });

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

      pushBot('Of course. Let’s choose your service again.', {
        options: serviceOptions(),
        chips: ['Back'],
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

      pushBot('No problem. Choose the barber you’d like to book with.', {
        options: barberOptions(),
        chips: ['Back'],
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

      pushBot('Of course. Let’s choose another day.', {
        options: dateOptions(),
        chips: ['Back'],
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

        pushBot('No problem. Choose the time that works best for you.', {
          chips: [
            ...(preferredSlots.length > 0
              ? preferredSlots
              : slots),
            'Back',
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

      pushBot('No problem. Let’s choose your day again.', {
        options: dateOptions(),
        chips: ['Back'],
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

      pushBot('Of course. What name should I put the appointment under?', {
        chips: ['Back'],
      });

      return;
    }

    if (step === 'confirm') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        phone: undefined,
      }));

      setStep('enterPhone');

      pushBot('No problem. What’s the best phone number for your booking?', {
        chips: ['Back'],
      });

      return;
    }

    pushBot('You’re already at the beginning.', {
      chips: QUICK_ACTIONS.map((action) => action.label),
    });

    setStep('welcome');
  };

  const handleChip = (chip: string) => {
    if (chip === 'Back') {
      handleBack();
      return true;
    }

    if (chip === 'Book an appointment' || chip === 'Book now') {
      startBooking();
      return true;
    }

    if (chip === 'View prices') {
      showPrices();
      return true;
    }

    if (chip === 'Check availability') {
      showAvailability();
      return true;
    }

    if (chip === 'Choose a barber') {
      showBarbers();
      return true;
    }

    if (chip === 'Cancel my appointment') {
      startCancellation();
      return true;
    }

    if (chip === 'Confirm booking') {
      confirmBooking();
      return true;
    }

    if (chip === 'Confirm cancellation') {
      void confirmCancellation();
      return true;
    }

    if (chip === 'Start over' || chip === 'Book another') {
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
        ? `Great choice. ${service.name} is €${service.price}. I’ve kept your preference ${preferenceText}. Now let’s choose your barber.`
        : `Great choice. ${service.name} is €${service.price}. Now let’s choose your barber.`,
      {
        options: barberOptions(),
        chips: ['Back'],
      },
    );
  };

  const preselectBarber = (id: string) => {
    const barber = barbers.find((item) => item.id === id);

    if (!barber) {
      pushBot('That barber is no longer available for booking. Please choose another one.');
      return;
    }

    setDraft({ barber });
    resetAvailability();
    pushUser(barber.name);
    setStep('pickService');

    pushBot(
      `Perfect. ${barber.name} is selected. Which service would you like?`,
      {
        options: serviceOptions(),
        chips: ['Back'],
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
      `Perfect. ${barber.name} is selected. Which service would you like?`,
      {
        options: serviceOptions(),
        chips: ['Back'],
      },
    );
  };

  const pickDate = async (date: string) => {
    if (!draft.service || !draft.barber) {
      pushBot(
        'I still need your service and barber before I can check the available times.',
        {
          chips: ['Back'],
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

    pushBot('Great. Your time is selected. What name should I put the appointment under?', {
      chips: ['Back'],
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
      `Thanks, ${result.value.split(' ')[0]}. Just one final detail — what’s the best phone number for your booking?`,
      {
        chips: ['Back'],
      },
    );
  };

  const submitPhone = (phone: string) => {
    const result = validatePhoneNumber(phone);

    pushUser(phone);

    if (!result.valid) {
      pushBot(
        `${result.error} You can enter it like 0176 12345678 or +49 176 12345678.`,
      );
      return;
    }

    const finalDraft = {
      ...draft,
      phone: result.value,
    };

    setDraft(finalDraft);
    setStep('confirm');

    pushBot('Everything is ready. Please take a quick look at your appointment details before I confirm it.', {
      booking: finalDraft,
      chips: ['Confirm booking', 'Back', 'Start over'],
    });
  };

  const confirmBooking = async () => {
    pushUser('Confirm booking');

    if (
      !draft.service ||
      !draft.barber ||
      !draft.date ||
      !draft.time ||
      !draft.name ||
      !draft.phone
    ) {
      pushBot('Some booking details are still missing. Please start again so I can complete the appointment correctly.');
      return;
    }

    try {
      pushBot('Perfect. I’m reserving your appointment now.');

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
          data.error || 'Failed to create booking.',
        );
      }

      setStep('done');

      pushBot(
        `You're all set.\n\n${draft.service.name} with ${draft.barber.name}\n${draft.date} at ${draft.time}\nName: ${draft.name}\nPhone: ${draft.phone}\n\nWe look forward to seeing you at ${BUSINESS.address}. If you need us before your appointment, you can reach us at ${BUSINESS.phoneFormatted}.`,
        {
          chips: ['Book another', 'View prices'],
        },
      );

      onBooked?.(draft);

    } catch (error) {
      console.error('Booking error:', error);

      pushBot(
        'I’m sorry, I couldn’t complete the booking right now. Please try again and I’ll take you through it.',
        {
          chips: ['Start over'],
        },
      );
    }
  };

  const restart = () => {
    setDraft({});
    setBookingPreference({});
    resetAvailability();
    setStep('welcome');
    pushUser('Start over');

    pushBot('Of course. Let’s start fresh. What would you like to do?', {
      chips: QUICK_ACTIONS.map((action) => action.label),
    });
  };

  const handleSmallTalk = (
    smallTalk: 'greeting' | 'howAreYou' | 'thanks' | 'goodbye',
  ) => {
    if (smallTalk === 'howAreYou') {
      pushBot(
        "I'm doing great, thank you for asking. I hope you're having a great day too. How can I help you?",
      );
      return;
    }

    if (smallTalk === 'thanks') {
      pushBot(
        "You're very welcome. It's my pleasure to help.",
      );
      return;
    }

    if (smallTalk === 'goodbye') {
      pushBot(
        'Take care. We look forward to seeing you at VIP FADES.',
      );
      return;
    }

    pushBot(
      'Hello and welcome to VIP FADES. How can I help you today?',
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
        pushBot('No problem. Which service would you like instead?', {
          options: serviceOptions(),
          chips: ['Back'],
        });
        return true;
      }

      if (!selectedBarber) {
        setStep('pickBarber');
        pushBot('No problem. Who would you like to book with instead?', {
          options: barberOptions(),
          chips: ['Back'],
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
          ? `Absolutely. I’ve got you ${preferenceText}. Which service would you like?`
          : 'Absolutely. Which service would you like?',
        {
          options: serviceOptions(),
          chips: ['Back'],
        },
      );

      return true;
    }

    if (!selectedBarber) {
      setStep('pickBarber');

      const preferenceText = describePreference(nextPreference);

      pushBot(
        preferenceText
          ? `Perfect. ${selectedService.name} is selected, and I’ve kept your preference ${preferenceText}. Who would you like to book with?`
          : `Perfect. ${selectedService.name} is selected. Who would you like to book with?`,
        {
          options: barberOptions(),
          chips: ['Back'],
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
      "I’m not quite sure what you mean. Choose one of the options below and I’ll guide you from there.",
      {
        chips: QUICK_ACTIONS.map((action) => action.label),
      },
    );

    setStep('welcome');
  };

  const showInput =
    step === 'enterName' ||
    step === 'enterPhone' ||
    step === 'cancelEnterPhone';

  const inputPlaceholder =
    step === 'enterName'
      ? 'Your name'
      : step === 'enterPhone' || step === 'cancelEnterPhone'
        ? 'Phone number'
        : 'Message…';

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
            Grooming Concierge
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-cream">
            Online · AI Powered
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-brand-cream/70" />

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-colors hover:border-brand-cream hover:text-brand-cream"
              aria-label="Close chat"
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
      {step === 'welcome' && (
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
          placeholder={showInput ? inputPlaceholder : 'Message…'}
          className="flex-1 rounded-full bg-[#1a1b1e] px-4 py-2.5 text-sm text-brand-textPrimary outline-none ring-1 ring-brand-border placeholder:text-brand-textSecondary focus:ring-brand-cream/35"
        />

        <button
          type="submit"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-bg transition-colors hover:bg-brand-textPrimary"
          aria-label="Send"
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
                label="Service"
                value={msg.booking.service?.name}
              />

              <SummaryItem
                label="Barber"
                value={msg.booking.barber?.name}
              />

              <SummaryItem label="Date" value={msg.booking.date} />

              <SummaryItem label="Time" value={msg.booking.time} />

              <SummaryItem label="Name" value={msg.booking.name} />

              <SummaryItem label="Phone" value={msg.booking.phone} />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
              <span className="text-xs uppercase tracking-[0.18em] text-brand-textSecondary">
                Total
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