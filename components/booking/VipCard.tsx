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
        className={`relative flex min-h-[16rem] flex-col items-center overflow-hidden rounded-[26.5px] px-7 pb-5 pt-5 text-center ${
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
          className={`pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 -rotate-12 ${
            selected ? 'text-[#1f1b14]/[0.05]' : 'text-[#e5d0a0]/[0.05]'
          }`}
        />

        {/* Foil light moving across the card */}
        <span
          aria-hidden="true"
          className="vip-foil-sweep pointer-events-none absolute -inset-y-10 left-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        />

        {CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden="true"
            className={`pointer-events-none absolute h-4 w-4 ${corner} ${
              selected ? 'border-[#1f1b14]/50' : 'border-[#e5d0a0]/70'
            }`}
          />
        ))}

        {selected && (
          <span className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f1b14] text-[#f5e9cb]">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}

        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border ${
            selected
              ? 'border-[#1f1b14]/40 text-[#1f1b14]'
              : 'border-[#e5d0a0]/50 text-[#e5d0a0] shadow-[0_0_24px_rgba(229,208,160,0.22)]'
          }`}
        >
          <TierIcon className="h-4 w-4" strokeWidth={1.4} />
        </span>

        <span
          className={`relative mt-2 text-[10px] font-bold uppercase tracking-[0.24em] ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          {vipPackage.badge}
        </span>

        <span
          className={`relative mt-1.5 text-[11px] font-bold tracking-[0.34em] ${
            selected ? DARK_TEXT : 'text-[#e5d0a0]'
          }`}
        >
          VIP
        </span>

        <span
          className={`relative pb-1 font-serif text-[1.6rem] font-bold leading-none tracking-[0.02em] sm:text-[1.8rem] ${
            selected ? DARK_TEXT : FOIL_TEXT
          }`}
        >
          {title}
        </span>

        <span aria-hidden="true" className="relative mt-2 flex items-center gap-2">
          <span className={`w-10 border-t ${lineColor}`} />
          <span
            className={`h-1.5 w-1.5 rotate-45 ${
              selected ? 'bg-[#1f1b14]' : 'bg-[#e5d0a0]'
            }`}
          />
          <span className={`w-10 border-t ${lineColor}`} />
        </span>

        <span
          className={`relative mb-3 mt-2 max-w-[20rem] text-[13px] font-medium leading-5 ${mutedText}`}
        >
          {vipPackage.description}
        </span>

        <span
          className={`relative mt-auto flex w-full items-end justify-between gap-3 border-t pt-2.5 ${lineColor}`}
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
              className={`pr-0.5 font-serif text-[2.1rem] font-bold leading-none ${
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
