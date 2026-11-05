import { Check, Crown, Gem } from 'lucide-react';

import type { VipPackage } from '@/components/chat/constants';

const CORNERS = [
  'left-2.5 top-2.5 rounded-tl-lg border-l border-t',
  'right-2.5 top-2.5 rounded-tr-lg border-r border-t',
  'bottom-2.5 left-2.5 rounded-bl-lg border-b border-l',
  'bottom-2.5 right-2.5 rounded-br-lg border-b border-r',
];

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
      className="group relative block w-full rounded-[28px] bg-gradient-to-br from-[#fff4d6] via-[#8d7643] to-[#f5e9cb] p-[1.5px] text-left shadow-[0_20px_55px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(229,208,160,0.28)]"
    >
      <span
        className={`relative flex flex-col items-start overflow-hidden rounded-[26.5px] px-4 py-3 text-left lg:min-h-[16rem] lg:items-center lg:px-7 lg:pb-5 lg:pt-5 lg:text-center ${
          selected
            ? 'bg-gradient-to-br from-[#f8efd6] via-[#e5d0a0] to-[#c2a56d]'
            : 'bg-[radial-gradient(circle_at_50%_0%,#2b2415,#100e09_55%,#070605)]'
        }`}
      >
        {/* Engraved security pattern */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
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
          className={`pointer-events-none absolute -bottom-8 -right-8 hidden h-40 w-40 -rotate-12 lg:block ${
            selected ? 'text-[#1f1b14]/[0.05]' : 'text-[#e5d0a0]/[0.05]'
          }`}
        />

        {/* Foil light moving across the card */}
        <span
          aria-hidden="true"
          className="vip-foil-sweep pointer-events-none absolute hidden lg:block -inset-y-10 left-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        />

        {CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden="true"
            className={`pointer-events-none absolute hidden h-4 w-4 lg:block ${corner} ${
              selected ? 'border-[#1f1b14]/50' : 'border-[#e5d0a0]/70'
            }`}
          />
        ))}

        {selected && (
          <span className="absolute right-3 top-3 flex h-6 w-6 lg:right-5 lg:top-5 items-center justify-center rounded-full bg-[#1f1b14] text-[#f5e9cb]">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}

        <span
          className={`relative hidden h-9 w-9 items-center justify-center rounded-full border lg:flex ${
            selected
              ? 'border-[#1f1b14]/40 text-[#1f1b14]'
              : 'border-[#e5d0a0]/50 text-[#e5d0a0] shadow-[0_0_24px_rgba(229,208,160,0.22)]'
          }`}
        >
          <TierIcon className="h-4 w-4" strokeWidth={1.4} />
        </span>

        <span
          className={`relative text-[10px] font-bold uppercase tracking-[0.2em] lg:mt-2 ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          {vipPackage.badge}
        </span>

        <span
          className={`relative mt-1.5 hidden text-[11px] font-bold tracking-[0.34em] lg:inline ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          VIP
        </span>

        <span
          className={`relative pb-1 mt-1 font-serif text-[1.25rem] font-bold leading-none tracking-[0.02em] lg:mt-0 lg:text-[1.8rem] ${
            selected ? DARK_TEXT : FOIL_TEXT
          }`}
        >
          <span className="lg:hidden">VIP </span>
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
          className={`relative mb-2 mt-1 text-xs font-medium leading-[1.35rem] lg:mb-3 lg:mt-2 lg:max-w-[20rem] lg:text-[13px] lg:leading-5 ${mutedText}`}
        >
          {vipPackage.description}
        </span>

        <span
          className={`relative mt-auto flex w-full items-end justify-between gap-3 border-t pt-2 ${lineColor}`}
        >
          <span className={`text-left text-[13px] font-medium leading-5 ${mutedText}`}>
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
              className={`pr-0.5 font-serif text-2xl font-bold leading-none lg:text-[2.1rem] ${
                selected ? DARK_TEXT : FOIL_TEXT
              }`}
            >
              €{vipPackage.price}
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
