'use client';

import { BUSINESS } from '@/lib/data';

export default function ShopExperience() {
  return (
    <section
      id="experience"
      className="section-padding border-y border-brand-border bg-brand-bgSecondary px-5 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image */}
          <div className="reveal lg:col-span-7">
            <div className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card">
              <img
                src="/images/vip-experience-shop.png"
                alt="VIP FADES premium barbershop interior"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] sm:aspect-[16/10]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-bg/35 via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-cream">
              The VIP Experience
            </span>

            <h2 className="mb-6 font-serif text-4xl font-light leading-[0.98] text-brand-textPrimary sm:text-5xl lg:text-6xl">
              More Than
              <br />
              a Haircut
            </h2>

            <p className="max-w-xl text-base font-light leading-relaxed text-brand-textPrimary/85 sm:text-lg">
              Precision grooming in a refined, relaxed environment designed
              around your style and your time.
            </p>

            <div className="my-8 h-px w-20 bg-brand-cream/40" />

            <div className="reveal reveal-delay-2">
              <div className="mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-cream">
                  Online Appointments
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-brand-cream/40 bg-brand-cream/5 px-4 py-2 text-xs font-medium text-brand-cream">
                  Monday to Thursday
                </span>

                <span className="rounded-full border border-brand-cream/40 bg-brand-cream/5 px-4 py-2 text-xs font-medium text-brand-cream">
                  10:00 – 19:00
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-brand-border bg-brand-bg/50 px-4 py-2 text-xs font-medium text-brand-textPrimary">
                  Open Daily
                </span>

                <span className="rounded-full border border-brand-border bg-brand-bg/50 px-4 py-2 text-xs font-medium text-brand-textPrimary">
                  Walk-ins Welcome Every Day
                </span>
              </div>

              <p className="mt-8 text-sm font-light leading-relaxed text-brand-textPrimary/70">
                Online appointments are available Monday to Thursday only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}