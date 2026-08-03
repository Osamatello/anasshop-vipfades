type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: Props) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center' : 'items-start text-left'
      } reveal ${isCenter ? 'reveal-delay-1' : ''}`}
    >
      {eyebrow && (
        <span
          className={`text-[11px] font-medium uppercase tracking-[0.32em] ${
            light ? 'text-warm/50' : 'text-gold'
          } mb-4`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight ${
          light ? 'text-warm' : 'text-ink-50'
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-6 h-px w-12 bg-gold ${isCenter ? 'mx-auto' : ''}`}
      />
      {description && (
        <p
          className={`mt-6 max-w-xl text-base sm:text-lg font-light leading-relaxed ${
            light ? 'text-warm/70' : 'text-ink-200'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
