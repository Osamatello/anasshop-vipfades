'use client';

export default function Statistics() {
  const stats = [
    { value: '2', label: 'Professional Barbers' },
    { value: '7', label: 'Signature Services' },
    { value: 'Weekday', label: 'Booking' },
    { value: 'Walk-ins', label: 'Welcome' },
  ];

  return (
    <section className="bg-brand-bg px-5 py-16 sm:px-8 border-b border-brand-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, idx) => (
            <div key={idx} className="reveal text-center flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-textPrimary block mb-2">
                {s.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-textSecondary block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
