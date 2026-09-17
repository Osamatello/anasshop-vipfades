export default function PageAtmosphere({
  showRings = false,
}: {
  showRings?: boolean;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="booking-global-atmosphere pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="global-glow-one absolute -left-[20%] top-[5%] h-[850px] w-[850px] rounded-full bg-brand-cream/[0.065] blur-[180px]" />

        <div className="global-glow-two absolute right-[-25%] top-[18%] h-[950px] w-[950px] rounded-full bg-brand-cream/[0.045] blur-[210px]" />

        <div className="global-glow-three absolute bottom-[-35%] left-[35%] h-[800px] w-[800px] rounded-full bg-brand-cream/[0.035] blur-[200px]" />

        {showRings && (
          <>
            <div className="page-atmosphere-ring-one absolute left-[-22%] top-[-8%] h-[900px] w-[900px] rounded-[50%] border border-brand-cream/[0.10]" />

            <div className="page-atmosphere-ring-two absolute left-[5%] top-[8%] h-[760px] w-[760px] rounded-[50%] border border-brand-cream/[0.06]" />
          </>
        )}

        <div className="booking-radial-background absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(232,220,200,0.035),transparent_35%)]" />
      </div>

      <style>{`
        @keyframes globalGlowOne {
          0%,
          100% {
            transform: translate3d(-40px, -20px, 0) scale(1);
          }

          50% {
            transform: translate3d(420px, 160px, 0) scale(1.25);
          }
        }

        @keyframes globalGlowTwo {
          0%,
          100% {
            transform: translate3d(80px, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-450px, 180px, 0) scale(1.2);
          }
        }

        @keyframes globalGlowThree {
          0%,
          100% {
            transform: translate3d(0, 40px, 0);
          }

          50% {
            transform: translate3d(180px, -180px, 0);
          }
        }

        @keyframes pageAtmosphereRingOne {
          0%,
          100% {
            transform: translate3d(-120px, -40px, 0) rotate(-18deg) scale(1);
            opacity: 0.25;
          }

          50% {
            transform: translate3d(650px, 100px, 0) rotate(20deg) scale(1.18);
            opacity: 0.55;
          }
        }

        @keyframes pageAtmosphereRingTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(15deg);
            opacity: 0.15;
          }

          50% {
            transform: translate3d(550px, 120px, 0) rotate(-18deg);
            opacity: 0.35;
          }
        }

        .global-glow-one {
          animation: globalGlowOne 18s ease-in-out infinite;
        }

        .global-glow-two {
          animation: globalGlowTwo 22s ease-in-out infinite;
        }

        .global-glow-three {
          animation: globalGlowThree 24s ease-in-out infinite;
        }

        .page-atmosphere-ring-one {
          animation: pageAtmosphereRingOne 24s ease-in-out infinite;
        }

        .page-atmosphere-ring-two {
          animation: pageAtmosphereRingTwo 28s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .booking-global-atmosphere,
          .booking-radial-background,
          .global-glow-one,
          .global-glow-two,
          .global-glow-three,
          .page-atmosphere-ring-one,
          .page-atmosphere-ring-two {
            display: none !important;
            animation: none !important;
            filter: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .global-glow-one,
          .global-glow-two,
          .global-glow-three,
          .page-atmosphere-ring-one,
          .page-atmosphere-ring-two {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
