import { Check, Clock, Crown } from 'lucide-react';

export type VipPackageCardDetails = {
  id: string;
  tier: 'koenigsklasse' | 'exklusiv';
  name: string;
  badge: string;
  price: number;
  durationMinutes: number;
  description: string;
  includes: string;
  originalPrice?: number;
  discountLabel?: string;
};

type VipPackageCardProps = {
  vipPackage: VipPackageCardDetails;
  selected?: boolean;
  onToggle?: () => void;
  size?: 'compact' | 'large';
};

export const LARGE_CARD_LAYOUT =
  'h-full min-h-[220px] justify-between rounded-xl border p-7';
export const COMPACT_CARD_LAYOUT = 'gap-2 rounded-2xl border p-3.5';

/** Shared VIP package presentation used on the homepage and in booking. */
export default function VipPackageCard({
  vipPackage,
  selected = false,
  onToggle,
  size = 'compact',
}: VipPackageCardProps) {
  const isTopTier = vipPackage.tier === 'koenigsklasse';

  const containerClass = [
    'flex w-full flex-col text-left transition-all',
    size === 'large'
      ? LARGE_CARD_LAYOUT
      : isTopTier
        ? 'gap-2.5 rounded-[20px] border p-4'
        : COMPACT_CARD_LAYOUT,
    selected
      ? isTopTier
        ? 'border-brand-cream bg-gradient-to-br from-brand-cream/[0.20] to-transparent shadow-[0_0_0_1px_rgba(232,220,200,0.45),0_18px_44px_-18px_rgba(232,220,200,0.5)] ring-1 ring-inset ring-brand-cream/25'
        : 'border-brand-cream bg-gradient-to-br from-brand-cream/[0.14] to-transparent shadow-[0_0_0_1px_rgba(232,220,200,0.35),0_14px_34px_-16px_rgba(232,220,200,0.4)]'
      : isTopTier
        ? 'border-brand-cream/45 bg-gradient-to-br from-brand-cream/[0.11] to-transparent shadow-[0_10px_30px_-18px_rgba(232,220,200,0.35)] ring-1 ring-inset ring-brand-cream/15 hover:border-brand-cream/70'
        : 'border-brand-cream/30 bg-gradient-to-br from-brand-cream/[0.06] to-transparent hover:border-brand-cream/55',
  ].join(' ');

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {onToggle ? (
            <span
              className={`mt-0.5 flex flex-shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                isTopTier ? 'h-[18px] w-[18px]' : 'h-4 w-4'
              } ${
                selected
                  ? 'border-brand-cream bg-brand-cream text-brand-bg'
                  : 'border-brand-cream/50'
              }`}
            >
              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
          ) : null}

          <span>
            <span className="flex flex-wrap items-center gap-2">
              {isTopTier && (
                <Crown className="h-4 w-4 flex-shrink-0 text-brand-cream" />
              )}

              <span
                className={`font-serif text-brand-textPrimary ${
                  isTopTier ? 'text-[17px]' : 'text-[15px]'
                }`}
              >
                {vipPackage.name}
              </span>

              <span className="rounded-full bg-brand-cream px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-bg">
                {vipPackage.badge}
              </span>
            </span>

            <span className="mt-1 flex items-center gap-1.5 text-[11px] font-light text-brand-textSecondary">
              <Clock className="h-3 w-3" />
              {vipPackage.durationMinutes} Min.
            </span>
          </span>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end">
          {vipPackage.originalPrice ? (
            <span className="text-[11px] font-light text-brand-textSecondary line-through">
              {vipPackage.originalPrice} €
            </span>
          ) : null}

          <span
            className={`font-serif leading-tight text-brand-cream ${
              isTopTier ? 'text-2xl' : 'text-xl'
            }`}
          >
            {vipPackage.price} €
          </span>

          {vipPackage.discountLabel ? (
            <span className="mt-0.5 rounded bg-brand-cream/15 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-brand-cream">
              {vipPackage.discountLabel}
            </span>
          ) : null}
        </div>
      </div>

      <p
        className={`font-light leading-relaxed text-brand-textPrimary/75 ${
          isTopTier ? 'text-[12px]' : 'text-[11px]'
        }`}
      >
        {vipPackage.description}
      </p>

      <p className="text-[10px] font-light leading-relaxed text-brand-textSecondary">
        {vipPackage.includes}
      </p>
    </>
  );

  if (!onToggle) {
    return <article className={containerClass}>{content}</article>;
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={containerClass}
    >
      {content}
    </button>
  );
}
