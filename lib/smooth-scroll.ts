import type Lenis from 'lenis';

/**
 * While smooth scrolling is on, the page must be moved through Lenis;
 * native smooth scrolling would be overridden. These helpers fall back to
 * the browser when Lenis is not running (reduced motion, first paint).
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

function scrollMarginTop(element: Element) {
  return parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Scrolls so the element's top sits below the header (honours scroll-margin-top). */
export function scrollToElement(element: Element | null | undefined) {
  if (!element) return;

  if (lenis) {
    // Lenis already subtracts the element's scroll-margin-top.
    lenis.scrollTo(element as HTMLElement);
    return;
  }
  element.scrollIntoView({ behavior: 'smooth' });
}

/** Centres the element in the window. */
export function scrollElementToCenter(element: Element | null | undefined) {
  if (!element) return;

  if (lenis) {
    const rect = element.getBoundingClientRect();
    lenis.scrollTo(element as HTMLElement, {
      offset: -(window.innerHeight / 2 - rect.height / 2) + scrollMarginTop(element),
    });
    return;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** Scrolls only when the element's top is above the visible area. */
export function scrollElementIntoViewIfAbove(element: Element | null | undefined) {
  if (!element) return;

  const top = element.getBoundingClientRect().top - scrollMarginTop(element);
  if (top >= 0) return;

  scrollToElement(element);
}
