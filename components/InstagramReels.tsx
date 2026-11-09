'use client';

import { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';

import { BUSINESS } from '@/lib/data';

const REELS_URL = 'https://www.instagram.com/vipfades.kob/reels/';

/** Short silent clips in /public/reels. Set `href` to a reel's own link when known. */
const REELS: { video: string; poster: string; href?: string }[] = Array.from(
  { length: 8 },
  (_, index) => ({
    video: `/reels/reel-${index + 1}.mp4`,
    poster: `/reels/reel-${index + 1}.jpg`,
  }),
);

/** Plays a clip only while it is on screen, so the page stays light. */
function ReelVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== 'auto') video.preload = 'auto';
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}

export default function InstagramReels() {
  return (
    <section id="reels" className="scroll-mt-24 overflow-hidden border-t border-brand-border py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="font-serif text-4xl font-light tracking-tight text-brand-textPrimary sm:text-5xl lg:text-6xl">
              Frisch aus dem Shop
            </h2>
            <div className="mt-4 h-px w-12 bg-brand-cream max-sm:mx-auto" />
            <p className="mt-5 max-w-md text-sm font-light leading-6 text-brand-textSecondary sm:text-base">
              Echte Cuts, echte Kunden – direkt aus unserem Barbershop in Koblenz.
            </p>
          </div>

          <a
            href={REELS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#e5d0a0]/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-cream transition-colors hover:border-[#e5d0a0] hover:bg-[#e5d0a0] hover:text-brand-bg"
          >
            <Instagram className="h-4 w-4" />
            {BUSINESS.instagram}
          </a>
        </div>
      </div>

      {/* Staggered row: every second reel sits lower. */}
      <div
        data-lenis-prevent-horizontal
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-14 pt-2 [scrollbar-width:none] sm:gap-5 lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] [&::-webkit-scrollbar]:hidden"
      >
        {REELS.map((reel, index) => (
          <a
            key={reel.video}
            href={reel.href ?? REELS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Reel ${index + 1} auf Instagram ansehen`}
            className={`group relative block w-[46vw] max-w-[230px] flex-shrink-0 self-start snap-start rounded-[22px] bg-gradient-to-br from-[#fff4d6] via-[#8d7643] to-[#f5e9cb] p-[1.5px] shadow-[0_18px_45px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(229,208,160,0.22)] sm:w-[210px] lg:w-[230px] ${
              index % 2 === 1 ? 'mt-10 sm:mt-14' : ''
            }`}
          >
            <span className="relative block aspect-[9/16] overflow-hidden rounded-[20.5px] bg-[#0c0b08]">
              <ReelVideo src={reel.video} poster={reel.poster} />

              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

              <span className="absolute left-3 top-3 rounded-full border border-[#e5d0a0]/50 bg-black/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f5e9cb] backdrop-blur">
                Reel
              </span>

              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] font-medium text-white/90">
                <span>{BUSINESS.instagram}</span>
                <Instagram className="h-4 w-4 text-[#f5e9cb]" />
              </span>

              <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-[#e5d0a0] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f1b14]">
                  Auf Instagram ansehen
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>

      <p className="-mt-6 px-5 text-center text-[11px] font-light tracking-wide text-brand-textSecondary">
        Wischen für mehr · Tippen zum Ansehen auf Instagram
      </p>
    </section>
  );
}
