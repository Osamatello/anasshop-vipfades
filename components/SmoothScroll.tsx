'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { setLenis } from '@/lib/smooth-scroll';

/**
 * Softens mouse-wheel and trackpad scrolling. Touch scrolling stays native,
 * and visitors who ask their device for reduced motion get normal scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      wheelMultiplier: 0.9,
      anchors: true,
      allowNestedScroll: true,
      respectReducedMotion: true,
    });

    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
