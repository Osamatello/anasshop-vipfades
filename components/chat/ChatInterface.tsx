'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Calendar,
  Tag,
  Clock,
  UserRound,
  Send,
  Scissors,
  Sparkles,
  X,
} from 'lucide-react';
import {
  SERVICES,
  BARBERS,
  TIME_SLOTS,
  BUSINESS,
  type Service,
  type Barber,
} from '@/lib/data';

type Role = 'bot' | 'user';
type Msg = {
  id: number;
  role: Role;
  text: string;
  chips?: string[];
  options?: { label: string; value: string; sub?: string }[];
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
  { label: 'Book an appointment', value: 'book', icon: Calendar },
  { label: 'View prices', value: 'prices', icon: Tag },
  { label: 'Check availability', value: 'availability', icon: Clock },
  { label: 'Choose a barber', value: 'barber', icon: UserRound },
];

let idc = 0;
const nid = () => ++idc;

export default function ChatInterface({
  onBooked,
  onClose,
}: {
  onBooked?: (b: BookingDraft) => void;
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
      setMessages((m) => [...m, { id: nid(), role: 'bot', text, ...extra }]);
    }, 550);
  };
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { id: nid(), role: 'user', text }]);

  useEffect(() => {
    pushBot(
      `Welcome to ${BUSINESS.name}. I'm your personal grooming concierge, here to help you schedule, check prices, and availability. What can I do for you?`,
      { chips: QUICK_ACTIONS.map((q) => q.label) }
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
      options: SERVICES.map((s) => ({
        label: s.name,
        value: s.id,
        sub: `€${s.price}${s.duration ? ` · ${s.duration} min` : ''}`,
      })),
    });
  };

  const showPrices = () => {
    pushUser('View prices');
    pushBot(
      `Here's our full menu:\n\n${SERVICES.map(
        (s) => `• ${s.name}: €${s.price}${s.duration ? ` (${s.duration} min)` : ''}`
      ).join('\n')}\n\nWould you like to book?`,
      { chips: ['Book now', 'Choose a barber'] }
    );
    setStep('menu');
  };

  const showAvailability = () => {
    pushUser('Check availability');
    pushBot(
      `We're open ${BUSINESS.hours.days}, ${BUSINESS.hours.time}. Here are today's available slots:`,
      { chips: TIME_SLOTS.slice(0, 6).map((t) => t) }
    );
    pushBot('Want me to start a booking for one of these times?', {
      chips: ['Book an appointment', 'View prices'],
    });
    setStep('menu');
  };

  const showBarbers = () => {
    pushUser('Choose a barber');
    pushBot('Pick your preferred barber.', {
      options: BARBERS.map((b) => ({
        label: b.name,
        value: b.id,
        sub: b.title,
      })),
    });
    setStep('pickBarberPre');
  };

  const handleChip = (chip: string) => {
    if (chip === 'Book an appointment' || chip === 'Book now') return startBooking();
    if (chip === 'View prices') return showPrices();
    if (chip === 'Check availability') return showAvailability();
    if (chip === 'Choose a barber') return showBarbers();

    if (chip === 'Confirm booking') return confirmBooking();
    if (chip === 'Start over' || chip === 'Book another') return restart();

    if (TIME_SLOTS.includes(chip) && step === 'menu') {
      setDraft((d) => ({ ...d, time: chip }));
      return startBooking();
    }

    if (/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s/.test(chip) && step === 'pickDate') {
      return pickDate(chip);
    }
    if (TIME_SLOTS.includes(chip) && step === 'pickTime') {
      return pickTime(chip);
    }
  };

  const pickService = (id: string) => {
    const svc = SERVICES.find((s) => s.id === id)!;
    setDraft((d) => ({ ...d, service: svc }));
    pushUser(svc.name);
    setStep('pickBarber');
    pushBot(`${svc.name}: €${svc.price}. Now choose your barber.`, {
      options: BARBERS.map((b) => ({ label: b.name, value: b.id, sub: b.title })),
    });
  };

  const pickBarber = (id: string) => {
    const b = BARBERS.find((x) => x.id === id)!;
    setDraft((d) => ({ ...d, barber: b }));
    pushUser(b.name);
    setStep('pickDate');
    pushBot(`Booked with ${b.name}. What day works for you?`, {
      chips: nextDays(4),
    });
  };

  const pickDate = (date: string) => {
    setDraft((d) => ({ ...d, date }));
    pushUser(date);
    setStep('pickTime');
    pushBot(`${date}: here are the available times:`, {
      chips: TIME_SLOTS.slice(0, 8),
    });
  };

  const pickTime = (time: string) => {
    setDraft((d) => ({ ...d, time }));
    pushUser(time);
    setStep('enterName');
    pushBot('Almost there. What name should I put the booking under?');
  };

  const submitName = (name: string) => {
    setDraft((d) => ({ ...d, name }));
    pushUser(name);
    setStep('enterPhone');
    pushBot(`Thanks, ${name.split(' ')[0]}. What's the best phone number to confirm?`);
  };

  const submitPhone = (phone: string) => {
    const final = { ...draft, phone };
    setDraft(final);
    pushUser(phone);
    setStep('confirm');
    pushBot("Here's your booking summary. Does everything look right?", {
      booking: final,
      chips: ['Confirm booking', 'Start over'],
    });
  };

  const confirmBooking = () => {
    pushUser('Confirm booking');
    setStep('done');
    pushBot(
      `Your appointment is confirmed.\n\n${draft.service?.name} with ${draft.barber?.name}\n${draft.date} at ${draft.time}\nName: ${draft.name}\nPhone: ${draft.phone}\n\nWe'll see you at ${BUSINESS.address}. You can also reach us at ${BUSINESS.phoneFormatted}.`,
      { chips: ['Book another', 'View prices'] }
    );
    onBooked?.(draft);
  };

  const restart = () => {
    setDraft({});
    setStep('welcome');
    pushUser('Start over');
    pushBot('No problem. What would you like to do?', {
      chips: QUICK_ACTIONS.map((q) => q.label),
    });
  };

  const handleOption = (value: string) => {
    if (step === 'pickService') return pickService(value);
    if (step === 'pickBarber' || step === 'pickBarberPre') return pickBarber(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setInput('');
    if (step === 'enterName') return submitName(v);
    if (step === 'enterPhone') return submitPhone(v);
    handleChip(v);
  };

  const showInput = step === 'enterName' || step === 'enterPhone';
  const inputPlaceholder =
    step === 'enterName' ? 'Your name' : step === 'enterPhone' ? 'Phone number' : 'Message…';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-[#111214]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brand-border bg-[#0e0f11] px-5 py-4">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/10 ring-1 ring-brand-accent/30">
            <Sparkles className="h-5 w-5 text-brand-accent" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0e0f11]" />
        </div>
        <div className="flex-1">
          <p className="font-serif text-lg leading-none text-brand-textPrimary">
            Grooming Concierge
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brand-accent">
            Online · AI Powered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-brand-textSecondary/60" />
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-textSecondary transition-colors hover:border-brand-accent hover:text-brand-accent"
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
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} onChip={handleChip} onOption={handleOption} />
        ))}

        {typing && (
          <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#1a1b1e] px-4 py-3 w-fit">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-accent" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-accent" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-accent" />
          </div>
        )}
      </div>

      {/* Quick actions (when idle) */}
      {step === 'welcome' && (
        <div className="border-t border-brand-border/40 px-4 pb-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.value}
                onClick={() => handleChip(q.label)}
                className="flex items-center gap-2 rounded-xl border border-brand-border bg-[#1a1b1e] px-3 py-2.5 text-left text-[13px] font-medium text-brand-textPrimary/85 transition-all hover:border-brand-accent/40 hover:bg-brand-accent/5"
              >
                <q.icon className="h-4 w-4 flex-shrink-0 text-brand-accent" />
                {q.label}
              </button>
            ))}
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
          onChange={(e) => setInput(e.target.value)}
          placeholder={showInput ? inputPlaceholder : 'Message…'}
          className="flex-1 rounded-full bg-[#1a1b1e] px-4 py-2.5 text-sm text-brand-textPrimary placeholder:text-brand-textSecondary outline-none ring-1 ring-brand-border focus:ring-brand-accent/40"
        />
        <button
          type="submit"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-textPrimary hover:bg-brand-hover transition-colors"
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
  onChip: (c: string) => void;
  onOption: (v: string) => void;
}) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} message-in`}>
      <div className="max-w-[85%]">
        <div
          className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isBot
              ? 'rounded-tl-sm bg-[#1a1b1e] text-brand-textPrimary/95 border border-brand-border/50'
              : 'rounded-tr-sm bg-brand-accent text-brand-textPrimary font-medium border border-brand-accent/20'
          }`}
        >
          {msg.text}
        </div>

        {msg.options && (
          <div className="mt-3 grid gap-2">
            {msg.options.map((o) => (
              <button
                key={o.value}
                onClick={() => onOption(o.value)}
                className="flex items-center justify-between rounded-xl border border-brand-border bg-[#1a1b1e] px-4 py-3 text-left transition-all hover:border-brand-accent/40 hover:bg-brand-accent/5"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-brand-textPrimary">{o.label}</span>
                  {o.sub && (
                    <span className="text-xs font-light text-brand-textSecondary">{o.sub}</span>
                  )}
                </span>
                <span className="text-brand-accent">→</span>
              </button>
            ))}
          </div>
        )}

        {msg.chips && (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg.chips.map((c) => (
              <button
                key={c}
                onClick={() => onChip(c)}
                className="rounded-full border border-brand-accent/30 bg-brand-accent/5 px-3.5 py-1.5 text-xs font-medium text-brand-accent transition-all hover:bg-brand-accent hover:text-brand-textPrimary"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {msg.booking && (
          <div className="mt-3 rounded-2xl border border-brand-accent/20 bg-[#1a1b1e] p-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <SummaryItem label="Service" value={msg.booking.service?.name} />
              <SummaryItem label="Barber" value={msg.booking.barber?.name} />
              <SummaryItem label="Date" value={msg.booking.date} />
              <SummaryItem label="Time" value={msg.booking.time} />
              <SummaryItem label="Name" value={msg.booking.name} />
              <SummaryItem label="Phone" value={msg.booking.phone} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
              <span className="text-xs uppercase tracking-[0.18em] text-brand-textSecondary">
                Total
              </span>
              <span className="font-serif text-xl text-brand-accent">
                €{msg.booking.service?.price}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-brand-textSecondary">{label}</p>
      <p className="mt-0.5 font-medium text-brand-textPrimary">{value || '—'}</p>
    </div>
  );
}

function nextDays(n: number): string[] {
  const out: string[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  for (let i = 1; i <= n + 4; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 4) {
      out.push(`${days[dow]} ${d.getDate()}/${d.getMonth() + 1}`);
      if (out.length >= n) break;
    }
  }
  return out;
}
