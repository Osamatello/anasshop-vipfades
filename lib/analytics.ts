/** Google Analytics 4 runs only after the visitor accepts it in the cookie banner. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-BY9Z8NDZN0';

export const ANALYTICS_CONSENT_KEY = 'vip-fades-analytics-consent';
export const OPEN_CONSENT_EVENT = 'vip-fades:open-cookie-settings';

export type AnalyticsConsent = 'granted' | 'denied';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function readConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // Private mode: the choice applies to this visit only.
  }
}

export function loadGoogleAnalytics() {
  if (typeof window === 'undefined') return;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function disableGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

/** Sends an event only when the visitor has accepted analytics. */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined' || !window.gtag || readConsent() !== 'granted') return;
  window.gtag('event', name, params);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
