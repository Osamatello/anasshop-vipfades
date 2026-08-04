'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  Scissors,
  Send,
  Sparkles,
  Tag,
  UserRound,
  X,
} from 'lucide-react';

import {
  BARBERS,
  BUSINESS,
  SERVICES,
  TIME_SLOTS,
  type Barber,
  type Service,
} from '@/lib/data';

type Role = 'bot' | 'user';

type Msg = {
  id: number;
  role: Role;
  text: string;
  chips?: string[];
  options?: {
    label: string;
    value: string;
    sub?: string;
  }[];
  booking?: BookingDraft;
};

type BookingDraft = {
  service?: Service;
  barber?: Barber;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
};

type Step =
  | 'welcome'
  | 'menu'
  | 'pickService'
  | 'pickBarber'
  | 'pickBarberPre'
  | 'pickDate'
  | 'pickTime'
  | 'enterName'
  | 'enterPhone'
  | 'confirm'
  | 'done';

const QUICK_ACTIONS = [
  {
    label: 'Book an appointment',
    value: 'book',
    icon: Calendar,
  },
  {
    label: 'View prices',
    value: 'prices',
    icon: Tag,
  },
  {
    label: 'Check availability',
    value: 'availability',
    icon: Clock,
  },
  {
    label: 'Choose a barber',
    value: 'barber',
    icon: UserRound,
  },
];

let idCounter = 0;

const nextId = () => {
  idCounter += 1;
  return idCounter;
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
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const pushBot = (text: string, extra?: Partial<Msg>) => {
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

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
  };

  const pushUser = (text: string) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextId(),
        role: 'user',
        text,
      },
    ]);
  };

  useEffect(() => {
    pushBot(
      `Welcome to ${BUSINESS.name}. I'm your personal grooming concierge, here to help you schedule, check prices, and availability. What can I do for you?`,
      {
        chips: QUICK_ACTIONS.map((action) => action.label),
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const startBooking = () => {
    setStep('pickService');
    pushUser('Book an appointment');

    pushBot('Great choice. Select your service.', {
      options: SERVICES.map((service) => ({
        label: service.name,
        value: service.id,
        sub: `€${service.price}${service.duration ? ` · ${service.duration} min` : ''
          }`,
      })),
    });
  };

  const showPrices = () => {
    pushUser('View prices');

    pushBot(
      `Here's our full menu:\n\n${SERVICES.map(
        (service) =>
          `• ${service.name}: €${service.price}${service.duration ? ` (${service.duration} min)` : ''
          }`,
      ).join('\n')}\n\nWould you like to book?`,
      {
        chips: ['Book now', 'Choose a barber'],
      },
    );

    setStep('menu');
  };

  const showAvailability = () => {
    pushUser('Check availability');

    pushBot(
      `We're open ${BUSINESS.hours.days}, ${BUSINESS.hours.time}. Here are today's available slots:`,
      {
        chips: TIME_SLOTS.slice(0, 6),
      },
    );

    pushBot('Want me to start a booking for one of these times?', {
      chips: ['Book an appointment', 'View prices'],
    });

    setStep('menu');
  };

  const showBarbers = () => {
    pushUser('Choose a barber');

    pushBot('Pick your preferred barber.', {
      options: BARBERS.map((barber) => ({
        label: barber.name,
        value: barber.id,
        sub: barber.title,
      })),
    });

    setStep('pickBarberPre');
  };

  const handleChip = (chip: string) => {
    if (chip === 'Book an appointment' || chip === 'Book now') {
      startBooking();
      return;
    }

    if (chip === 'View prices') {
      showPrices();
      return;
    }

    if (chip === 'Check availability') {
      showAvailability();
      return;
    }

    if (chip === 'Choose a barber') {
      showBarbers();
      return;
    }

    if (chip === 'Confirm booking') {
      confirmBooking();
      return;
    }

    if (chip === 'Start over' || chip === 'Book another') {
      restart();
      return;
    }

    if (TIME_SLOTS.includes(chip) && step === 'menu') {
      setDraft((currentDraft) => ({
        ...currentDraft,
        time: chip,
      }));

      startBooking();
      return;
    }

    if (
      /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s/.test(chip) &&
      step === 'pickDate'
    ) {
      pickDate(chip);
      return;
    }

    if (TIME_SLOTS.includes(chip) && step === 'pickTime') {
      pickTime(chip);
    }
  };

  const pickService = (id: string) => {
    const service = SERVICES.find((item) => item.id === id);

    if (!service) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      service,
    }));

    pushUser(service.name);
    setStep('pickBarber');

    pushBot(
      `${service.name}: €${service.price}. Now choose your barber.`,
      {
        options: BARBERS.map((barber) => ({
          label: barber.name,
          value: barber.id,
          sub: barber.title,
        })),
      },
    );
  };

  const pickBarber = (id: string) => {
    const barber = BARBERS.find((item) => item.id === id);

    if (!barber) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      barber,
    }));

    pushUser(barber.name);
    setStep('pickDate');

    pushBot(`Booked with ${barber.name}. What day works for you?`, {
      chips: nextDays(4),
    });
  };

  const pickDate = (date: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      date,
    }));

    pushUser(date);
    setStep('pickTime');

    pushBot(`${date}: here are the available times:`, {
      chips: TIME_SLOTS.slice(0, 8),
    });
  };

  const pickTime = (time: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      time,
    }));

    pushUser(time);
    setStep('enterName');

    pushBot('Almost there. What name should I put the booking under?');
  };

  const submitName = (name: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      name,
    }));

    pushUser(name);
    setStep('enterPhone');

    pushBot(
      `Thanks, ${name.split(' ')[0]}. What's the best phone number to confirm?`,
    );
  };

  const submitPhone = (phone: string) => {
    const finalDraft = {
      ...draft,
      phone,
    };

    setDraft(finalDraft);
    pushUser(phone);
    setStep('confirm');

    pushBot("Here's your booking summary. Does everything look right?", {
      booking: finalDraft,
      chips: ['Confirm booking', 'Start over'],
    });
  };

  const confirmBooking = () => {
    pushUser('Confirm booking');
    setStep('done');

    pushBot(
      `Your appointment is confirmed.\n\n${draft.service?.name} with ${draft.barber?.name}\n${draft.date} at ${draft.time}\nName: ${draft.name}\nPhone: ${draft.phone}\n\nWe'll see you at ${BUSINESS.address}. You can also reach us at ${BUSINESS.phoneFormatted}.`,
      {
        chips: ['Book another', 'View prices'],
      },
    );

    onBooked?.(draft);
  };

  const restart = () => {
    setDraft({});
    setStep('welcome');
    pushUser('Start over');

    pushBot('No problem. What would you like to do?', {
      chips: QUICK_ACTIONS.map((action) => action.label),
    });
  };

  const handleOption = (value: string) => {
    if (step === 'pickService') {
      pickService(value);
      return;
    }

    if (step === 'pickBarber' || step === 'pickBarberPre') {
      pickBarber(value);
    }
  };

  const handleSubmit = (event: FormEvent) => {
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

    handleChip(value);
  };

  const showInput = step === 'enterName' || step === 'enterPhone';

  const inputPlaceholder =
    step === 'enterName'
      ? 'Your name'
      : step === 'enterPhone'
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

        {typing && (
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

function nextDays(numberOfDays: number): string[] {
  const output: string[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let index = 1; index <= numberOfDays + 4; index += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + index);

    const dayOfWeek = date.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      output.push(
        `${days[dayOfWeek]} ${date.getDate()}/${date.getMonth() + 1}`,
      );

      if (output.length >= numberOfDays) {
        break;
      }
    }
  }

  return output;
}