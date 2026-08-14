'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

const images = [
    '/images/vip-look/vip-look-01.webp',
    '/images/vip-look/vip-look-02.webp',
    '/images/vip-look/vip-look-03.webp',
    '/images/vip-look/vip-look-04.webp',
    '/images/vip-look/vip-look-05.webp',
    '/images/vip-look/vip-look-06.webp',
    '/images/vip-look/vip-look-07.webp',
];

export default function VIPLook() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goToImage = (index: number) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const safeIndex = Math.max(
            0,
            Math.min(index, images.length - 1),
        );

        const card = slider.children[safeIndex] as HTMLElement;
        if (!card) return;

        slider.scrollTo({
            left:
                card.offsetLeft -
                (slider.clientWidth - card.offsetWidth) / 2,
            behavior: 'smooth',
        });

        setActiveIndex(safeIndex);
    };

    const scroll = (direction: 'left' | 'right') => {
        goToImage(
            direction === 'left'
                ? activeIndex - 1
                : activeIndex + 1,
        );
    };

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;

        const cards = Array.from(
            slider.children,
        ) as HTMLElement[];

        if (!cards.length) return;

        const sliderRect =
            slider.getBoundingClientRect();

        const sliderCenter =
            sliderRect.left + sliderRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
            const cardRect =
                card.getBoundingClientRect();

            const cardCenter =
                cardRect.left + cardRect.width / 2;

            const distance = Math.abs(
                sliderCenter - cardCenter,
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        setActiveIndex(closestIndex);
    };

    return (
        <section className="relative overflow-hidden bg-brand-bg py-20 md:py-28">
            <div
                aria-hidden="true"
                className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.018),transparent_58%)]
        "
            />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-brand-cream">
                        DER VIP LOOK
                    </p>

                    <h2 className="font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-brand-textPrimary sm:text-5xl md:text-6xl">
                        Cuts, die für sich sprechen
                    </h2>

                    <div className="mx-auto mt-4 h-px w-12 bg-brand-cream/70" />

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-brand-textSecondary md:text-base">
                        Präzise Fades, saubere Konturen und Styles, die zu dir
                        passen. Entdecke echte Ergebnisse direkt aus unserem
                        Barbershop.
                    </p>
                </div>

                {/* Gallery */}
                <div className="relative mx-auto max-w-6xl">
                    {/* Soft edge fades */}
                    <div
                        aria-hidden="true"
                        className="
              pointer-events-none absolute inset-y-0 left-0 z-20
              hidden w-12
              bg-gradient-to-r from-brand-bg via-brand-bg/75 to-transparent
              md:block
            "
                    />

                    <div
                        aria-hidden="true"
                        className="
              pointer-events-none absolute inset-y-0 right-0 z-20
              hidden w-12
              bg-gradient-to-l from-brand-bg via-brand-bg/75 to-transparent
              md:block
            "
                    />

                    {/* Previous */}
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={activeIndex === 0}
                        className="
              absolute left-0 top-1/2 z-30 hidden
              h-11 w-11 -translate-x-1/2 -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-brand-border
              bg-brand-bg/95
              text-brand-textPrimary
              shadow-[0_8px_28px_rgba(0,0,0,0.40)]
              backdrop-blur-md
              transition-all duration-300
              hover:border-brand-cream/55
              hover:bg-brand-cream
              hover:text-black
              disabled:pointer-events-none
              disabled:opacity-30
              md:flex
            "
                        aria-label="Vorheriges Bild"
                    >
                        <ChevronLeft
                            size={18}
                            strokeWidth={1.5}
                        />
                    </button>

                    {/* Images */}
                    <div
                        ref={sliderRef}
                        onScroll={handleScroll}
                        className="
              flex snap-x snap-mandatory
              gap-3 overflow-x-auto
              scroll-smooth
              px-[1px] pb-3
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-4
              lg:gap-5
            "
                    >
                        {images.map((src, index) => (
                            <article
                                key={src}
                                data-index={index}
                                className="
                  group relative
                  aspect-[4/5]
                  w-[84%]
                  shrink-0
                  snap-center
                  overflow-hidden
                  rounded-[14px]
                  border border-brand-border
                  bg-brand-bg
                  shadow-[0_12px_32px_rgba(0,0,0,0.18)]
                  transition-all duration-500
                  hover:-translate-y-[3px]
                  hover:border-brand-cream/30
                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]
                  sm:w-[47%]
                  md:w-[31%]
                  lg:w-[22%]
                "
                            >
                                <Image
                                    src={src}
                                    alt={`VIP FADES Kundenlook ${index + 1}`}
                                    fill
                                    sizes="
                    (max-width: 640px) 84vw,
                    (max-width: 768px) 47vw,
                    (max-width: 1024px) 31vw,
                    22vw
                  "
                                    className="
                    object-cover
                    object-[center_38%]
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.015]
                  "
                                />

                                <div
                                    aria-hidden="true"
                                    className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-t
                    from-black/18
                    via-transparent
                    to-black/[0.03]
                  "
                                />

                                <div
                                    aria-hidden="true"
                                    className="
                    pointer-events-none absolute inset-0
                    rounded-[13px]
                    ring-1 ring-inset ring-white/[0.025]
                  "
                                />
                            </article>
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        disabled={
                            activeIndex === images.length - 1
                        }
                        className="
              absolute right-0 top-1/2 z-30 hidden
              h-11 w-11 translate-x-1/2 -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-brand-border
              bg-brand-bg/95
              text-brand-textPrimary
              shadow-[0_8px_28px_rgba(0,0,0,0.40)]
              backdrop-blur-md
              transition-all duration-300
              hover:border-brand-cream/55
              hover:bg-brand-cream
              hover:text-black
              disabled:pointer-events-none
              disabled:opacity-30
              md:flex
            "
                        aria-label="Nächstes Bild"
                    >
                        <ChevronRight
                            size={18}
                            strokeWidth={1.5}
                        />
                    </button>
                </div>

                {/* Progress slider */}
                <div className="mx-auto mt-6 flex max-w-[210px] items-center gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => goToImage(index)}
                            aria-label={`Bild ${index + 1} anzeigen`}
                            className={`
                h-[3px] flex-1 rounded-full
                transition-all duration-300
                ${activeIndex === index
                                    ? 'bg-brand-cream'
                                    : index < activeIndex
                                        ? 'bg-brand-cream/35'
                                        : 'bg-white/15 hover:bg-brand-cream/35'
                                }
              `}
                        />
                    ))}
                </div>

                {/* Mobile */}
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-brand-textSecondary/50 md:hidden">
                    Wischen zum Entdecken
                </p>
            </div>
        </section>
    );
}