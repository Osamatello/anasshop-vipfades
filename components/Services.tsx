'use client';

import { Clock, Scissors } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/data';

export default function Services() {
  const featuredService = SERVICES.find((s) => s.id === 'haircut-beard') || SERVICES[2];
  const supportingServices = SERVICES.filter((s) => s.id !== 'haircut-beard');

  return (
    <section id="services" className="section-padding bg-brand-bg px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-accent block mb-3">
            The Menu
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
            Signature Cuts
          </h2>
          <div className="mt-4 gold-divider" />
          <p className="mt-6 mx-auto max-w-lg text-base font-light text-brand-textSecondary">
            Considered craftsmanship at transparent prices. Select a grooming package tailored to your routine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Featured Service Card */}
          {featuredService && (
            <div className="reveal lg:col-span-1 lg:row-span-3 flex flex-col justify-between p-8 bg-brand-bgSecondary/60 border-2 border-brand-accent/40 rounded-2xl shadow-2xl relative overflow-hidden group">
              {/* Highlight background elements */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-brand-accent/10 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-colors duration-500" />
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-accent border border-brand-accent/20">
                    Featured Service
                  </span>
                  {featuredService.duration && (
                    <span className="flex items-center gap-1.5 text-xs font-light text-brand-textSecondary">
                      <Clock className="h-3.5 w-3.5 text-brand-accent" />
                      {featuredService.duration} min
                    </span>
                  )}
                </div>
                
                <span className="mt-8 text-xs uppercase tracking-[0.2em] text-brand-textSecondary block">
                  Complete Grooming
                </span>
                <h3 className="font-serif text-3xl font-light text-brand-textPrimary mt-2 group-hover:text-brand-accent transition-colors duration-300">
                  {featuredService.name}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-brand-textSecondary">
                  {featuredService.description}
                </p>
              </div>

              <div className="mt-12 flex items-baseline justify-between pt-6 border-t border-brand-border/40">
                <span className="text-xs uppercase tracking-[0.16em] text-brand-textSecondary">Investment</span>
                <span className="font-serif text-4xl font-light text-brand-textPrimary">
                  €{featuredService.price}
                </span>
              </div>
            </div>
          )}

          {/* Supporting Services Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {supportingServices.map((s: Service, i: number) => (
              <div
                key={s.id}
                className={`reveal reveal-delay-${(i % 3) + 1} flex flex-col justify-between p-7 bg-brand-card/30 border border-brand-border rounded-xl hover:border-brand-accent/30 transition-all duration-300 group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl font-light text-brand-textPrimary group-hover:text-brand-accent transition-colors duration-300">
                      {s.name}
                    </h3>
                    <span className="font-serif text-2xl font-light text-brand-textPrimary">
                      €{s.price}
                    </span>
                  </div>
                  {s.duration && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-light text-brand-textSecondary">
                      <Clock className="h-3 w-3 text-brand-accent/70" />
                      {s.duration} min
                    </span>
                  )}
                  <p className="mt-4 text-sm font-light text-brand-textSecondary leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="reveal reveal-delay-3 mt-14 text-center text-xs font-light tracking-wide text-brand-textSecondary/80">
          Walk-ins welcome during opening hours · Cash &amp; card accepted
        </p>
      </div>
    </section>
  );
}
