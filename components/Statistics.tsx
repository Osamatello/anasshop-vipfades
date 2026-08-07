'use client';

export default function Statistics() {
  const stats = [
    {
      eyebrow: 'OUR TEAM',
      value: '2',
      label: 'Professional Barbers',
    },
    {
      eyebrow: 'THE MENU',
      value: '7',
      label: 'Signature Services',
    },
    {
      eyebrow: 'BOOKING',
      value: 'Mon–Thu',
      label: 'Appointments',
    },
    {
      eyebrow: 'FLEXIBILITY',
      value: 'Walk-ins',
      label: 'Welcome Daily',
    },
  ];

  return (
    <section className="border-b border-brand-border bg-brand-bg px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`reveal group relative flex flex-col items-center justify-center px-6 py-6 text-center ${index !== stats.length - 1
                  ? 'md:border-r md:border-brand-border/60'
                  : ''
                }`}
            >
              {/* Small heading */}
              <span className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-cream/80">
                {stat.eyebrow}
              </span>

              {/* Main value */}
              <span className="font-serif text-4xl font-light leading-none text-brand-textPrimary transition-all duration-300 group-hover:text-brand-cream sm:text-5xl">
                {stat.value}
              </span>

              {/* Accent line */}
              <div className="mt-5 h-px w-8 bg-brand-cream/30 transition-all duration-300 group-hover:w-14 group-hover:bg-brand-cream" />

              {/* Label */}
              <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-textSecondary">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}