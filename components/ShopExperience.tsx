'use client';

import { BUSINESS } from '@/lib/data';

export default function ShopExperience() {
  return (
    <section id="experience" className="section-padding bg-brand-bgSecondary px-5 sm:px-8 border-y border-brand-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Image */}
          <div className="reveal relative lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-brand-border">
              <img
                src="/images/IN-SHOP_PIC.jpeg"
                alt="VIP FADES clean shop interior"
                className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/40 to-transparent" />
            </div>
            {/* accent badge */}
            <div className="absolute -bottom-5 -right-3 hidden rounded-xl border border-brand-border bg-brand-bg/90 px-5 py-4 backdrop-blur sm:block">
              <p className="font-serif text-3xl text-brand-textPrimary font-light">100%</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-textSecondary">
                Precision Focused
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-accent mb-4 block">
              The VIP Experience
            </span>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-textPrimary sm:text-5xl lg:text-6xl mb-6">
              More Than a Haircut
            </h2>
            <p className="text-lg font-light leading-relaxed text-brand-textSecondary mb-8">
              Step into an environment tailored for the modern gentleman. We combine precision craftsmanship with a refined, relaxed atmosphere, making every visit a ritual of self-care.
            </p>
            
            <div className="h-px bg-brand-border w-20 mb-8" />
            
            <div className="reveal reveal-delay-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-textSecondary">
              <span className="rounded-full border border-brand-border px-4 py-1.5 bg-brand-bg/40">
                {BUSINESS.hours.days}
              </span>
              <span className="rounded-full border border-brand-border px-4 py-1.5 bg-brand-bg/40">
                {BUSINESS.hours.time}
              </span>
              <span className="rounded-full border border-brand-accent/30 px-4 py-1.5 text-brand-accent bg-brand-accent/5">
                {BUSINESS.hours.walkins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
