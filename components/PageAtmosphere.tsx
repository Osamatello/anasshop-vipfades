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
          <div className="page-booking-ribbon absolute left-[4%] top-[40px] h-[850px] w-[720px] max-w-[92vw]">
            <div className="page-ribbon-glow absolute -right-[320px] top-[40px] h-[720px] w-[720px] rounded-[48%] border-[2px] border-brand-cream/[0.08]" />

            <div className="page-ribbon-glow-two absolute -right-[260px] top-[100px] h-[620px] w-[620px] rounded-[48%] border border-brand-cream/[0.08]" />

            <div className="page-ribbon-static-glow absolute right-[-200px] top-[140px] h-[500px] w-[500px] rounded-full bg-brand-cream/[0.055] blur-[130px]" />
          </div>
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

        @keyframes ribbonMove {
          0%,
          100% {
            transform: translate3d(0, -60px, 0) rotate(-10deg) scale(1);
          }

          50% {
            transform: translate3d(-100px, 80px, 0) rotate(12deg) scale(1.08);
          }
        }

        @keyframes ribbonMoveTwo {
          0%,
          100% {
            transform: translate3d(20px, 40px, 0) rotate(8deg);
          }

          50% {
            transform: translate3d(-80px, -60px, 0) rotate(-12deg);
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

        .page-ribbon-glow {
          animation: ribbonMove 16s ease-in-out infinite;
        }

        .page-ribbon-glow-two {
          animation: ribbonMoveTwo 19s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .booking-global-atmosphere,
          .booking-radial-background,
          .global-glow-one,
          .global-glow-two,
          .global-glow-three,
          .page-booking-ribbon,
          .page-ribbon-glow,
          .page-ribbon-glow-two,
          .page-ribbon-static-glow {
            display: none !important;
            animation: none !important;
            filter: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .global-glow-one,
          .global-glow-two,
          .global-glow-three,
          .page-ribbon-glow,
          .page-ribbon-glow-two {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
