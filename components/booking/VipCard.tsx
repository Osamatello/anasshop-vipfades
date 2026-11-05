import { Check, Crown, Gem } from 'lucide-react';

import type { VipPackage } from '@/components/chat/constants';

const FOIL_TEXT =
  'bg-gradient-to-br from-[#fff8e6] to-[#f0dfb8] bg-clip-text text-transparent';
const DARK_TEXT = 'text-[#1f1b14]';

/** A luxury members-card treatment for the VIP packages. */
export default function VipCard({
  vipPackage,
  selected,
  onClick,
}: {
  vipPackage: VipPackage;
  selected: boolean;
  onClick: () => void;
}) {
  const TierIcon = vipPackage.slug === 'vip-koenigsklasse' ? Crown : Gem;
  const title = vipPackage.name.replace(/^VIP\s+/i, '');
  const lineColor = selected ? 'border-[#1f1b14]/30' : 'border-[#e5d0a0]/30';
  const mutedText = selected ? 'text-[#1f1b14]' : 'text-[#ece8df]';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group relative block w-full rounded-[28px] p-[1.5px] text-left shadow-[0_20px_55px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(229,208,160,0.28)] ${
        selected
          ? 'bg-gradient-to-br from-[#fff4d6] via-[#8d7643] to-[#f5e9cb]'
          : '[@media(hover:hover)]:hover:[background:linear-gradient(135deg,#fff4d6,#8d7643,#f5e9cb)] active:[background:linear-gradient(135deg,#fff4d6,#8d7643,#f5e9cb)]'
      }`}
    >
      <span
        className={`relative flex items-center gap-4 overflow-hidden rounded-[26.5px] px-5 py-3 text-right lg:min-h-[16rem] lg:flex-col lg:gap-0 lg:px-7 lg:pb-5 lg:pt-5 lg:text-center ${
          selected
            ? 'bg-gradient-to-br from-[#f8efd6] via-[#e5d0a0] to-[#c2a56d]'
            : 'bg-[radial-gradient(circle_at_50%_0%,#2b2415,#100e09_55%,#070605)]'
        }`}
      >
        {/* Engraved security pattern */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: selected
              ? 'repeating-linear-gradient(118deg,rgba(31,27,20,.025) 0 1px,transparent 1px 7px),repeating-linear-gradient(62deg,rgba(31,27,20,.015) 0 1px,transparent 1px 7px)'
              : 'repeating-linear-gradient(118deg,rgba(229,208,160,.02) 0 1px,transparent 1px 7px),repeating-linear-gradient(62deg,rgba(229,208,160,.015) 0 1px,transparent 1px 7px)',
          }}
        />

        {/* Oversized emblem */}
        <TierIcon
          aria-hidden="true"
          strokeWidth={0.6}
          className={`pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 -rotate-12 lg:h-40 lg:w-40 ${
            selected ? 'text-[#1f1b14]/[0.05]' : 'text-[#e5d0a0]/[0.05]'
          }`}
        />

        {/* Foil light moving across the card */}
        <span
          aria-hidden="true"
          className="vip-foil-sweep pointer-events-none absolute -inset-y-10 left-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        />

        <span
          className={`relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border lg:static lg:h-9 lg:w-9 ${
            selected
              ? 'border-[#1f1b14]/40 text-[#1f1b14]'
              : 'border-[#e5d0a0]/50 text-[#e5d0a0] shadow-[0_0_24px_rgba(229,208,160,0.22)]'
          }`}
        >
          <TierIcon className="h-10 w-10 lg:h-4 lg:w-4 lg:[stroke-width:1.4]" strokeWidth={1.2} />

          {selected && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1b14] text-[#f5e9cb] lg:bottom-auto lg:right-5 lg:top-5">
              <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" strokeWidth={3} />
            </span>
          )}
        </span>

        <span className="relative flex min-w-0 flex-1 flex-col items-end self-stretch lg:items-center">

        <span
          className={`relative mt-2 hidden font-bold uppercase lg:block lg:text-[10px] lg:tracking-[0.24em] ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          {vipPackage.badge}
        </span>

        <span
          className={`relative text-[10px] font-bold tracking-[0.3em] lg:mt-1.5 lg:text-[11px] lg:tracking-[0.34em] ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          VIP
        </span>

        <span
          className={`relative pb-1 font-serif text-[1.2rem] font-bold leading-none tracking-[0.02em] lg:text-[1.8rem] ${
            selected ? DARK_TEXT : FOIL_TEXT
          }`}
        >
          {title}
        </span>

        <span aria-hidden="true" className="relative mt-2 hidden items-center gap-2 lg:flex">
          <span className={`w-10 border-t ${lineColor}`} />
          <span
            className={`h-1.5 w-1.5 rotate-45 ${
              selected ? 'bg-[#1f1b14]' : 'bg-[#e5d0a0]'
            }`}
          />
          <span className={`w-10 border-t ${lineColor}`} />
        </span>

        <span
          className={`relative mb-3 mt-2 hidden max-w-[20rem] text-[13px] font-medium leading-5 lg:block ${mutedText}`}
        >
          {vipPackage.description}
        </span>

        <span
          className={`relative mt-1 flex w-full items-end justify-between gap-3 border-t pt-1.5 lg:mt-auto lg:pt-2.5 ${lineColor}`}
        >
          <span className={`text-left text-[11px] font-medium leading-4 lg:text-[13px] lg:leading-5 ${mutedText}`}>
            {vipPackage.durationMinutes} Min.
            {vipPackage.discountLabel && (
              <span className="block font-bold tracking-[0.04em]">
                {vipPackage.discountLabel}
              </span>
            )}
          </span>

          <span className="flex items-baseline gap-2">
            {vipPackage.originalPrice && (
              <span
                className={`text-sm line-through opacity-60 ${
                  selected ? DARK_TEXT : 'text-brand-textPrimary'
                }`}
              >
                €{vipPackage.originalPrice}
              </span>
            )}
            <span
              className={`pr-0.5 font-serif text-[1.3rem] font-bold leading-none lg:text-[2.1rem] ${
                selected ? DARK_TEXT : FOIL_TEXT
              }`}
            >
              €{vipPackage.price}
            </span>
          </span>
        </span>
        </span>
      </span>

      <style>{`
        @keyframes vipFoilSweep {
          0%, 62% { transform: translateX(-160%) rotate(12deg); }
          100% { transform: translateX(460%) rotate(12deg); }
        }

        .vip-foil-sweep {
          animation: vipFoilSweep 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .vip-foil-sweep {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
