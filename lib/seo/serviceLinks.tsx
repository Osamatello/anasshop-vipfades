import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import Link from 'next/link';

import { SERVICES, type Service } from '@/lib/data';
import { serviceAnchor } from '@/lib/services/presentation';

/** Where each service lives on the site: its card on /leistungen. */
export const serviceHref = (service: Service) => `/leistungen#${serviceAnchor(service)}`;

const byId = (id: string) => {
  const service = SERVICES.find((item) => item.id === id);
  if (!service) throw new Error(`Unknown service "${id}"`);
  return service;
};

export type LinkTerm = { terms: string[]; href: string };

/**
 * The words that name a service in running text, and where they link.
 * Only words already on the site; nothing here changes what the text says.
 */
export const SERVICE_TERMS: LinkTerm[] = [
  { terms: ['Haarschnitt + Bart', 'Haarschnitt und Bart'], href: serviceHref(byId('haircut-beard')) },
  { terms: ['Premium Haarschnitt'], href: serviceHref(byId('premium-haircut-styling')) },
  {
    terms: ['Herrenhaarschnitt', 'Herrenhaarschnitte', 'Herrenhaarschnitten', 'Herrenhaarschnitts', 'Haarschnitt'],
    href: serviceHref(byId('haircut')),
  },
  { terms: ['Bart trimmen', 'Bartpflege'], href: serviceHref(byId('beard')) },
  { terms: ['Augenbrauen'], href: serviceHref(byId('eyebrows')) },
  { terms: ['Gesichtsreinigung'], href: serviceHref(byId('facial')) },
  { terms: ['Heißwachs'], href: serviceHref(byId('hotwax')) },
  { terms: ['Ohren & Nase', 'Ohren und Nase'], href: serviceHref(byId('ears-nose')) },
  { terms: ['VIP-Pakete'], href: '/leistungen' },
];

/** Extra words in customer reviews: walk-ins and booking. */
export const REVIEW_TERMS: LinkTerm[] = [
  { terms: ['ohne Termin'], href: '/artikel/barber-koblenz-ohne-termin' },
  { terms: ['Termin'], href: '/booking' },
  ...SERVICE_TERMS,
];

/** 2–3 services that fit each article, shown at its end. */
export const ARTICLE_SERVICES: Record<string, string[]> = {
  'barber-koblenz-ohne-termin': ['haircut', 'haircut-beard', 'beard'],
  'barbershop-koblenz-altstadt-anfahrt': ['haircut', 'haircut-beard', 'premium-haircut-styling'],
  'barber-koblenz': ['haircut', 'haircut-beard', 'beard'],
  'low-mid-high-fade': ['haircut', 'premium-haircut-styling', 'haircut-beard'],
  'herrenhaarschnitt-preis-koblenz': ['haircut', 'haircut-beard', 'premium-haircut-styling'],
  'fade-mit-locken': ['haircut', 'premium-haircut-styling', 'haircut-beard'],
  'grooming-fuer-maenner': ['eyebrows', 'facial', 'hotwax'],
  'bart-richtig-pflegen': ['beard', 'haircut-beard', 'facial'],
  'herrenhaarschnitt-gesichtsform': ['haircut', 'premium-haircut-styling', 'haircut-beard'],
  'skin-fade-koblenz': ['haircut', 'haircut-beard', 'premium-haircut-styling'],
  'skin-fade-vs-taper-fade': ['haircut', 'premium-haircut-styling', 'beard'],
  'wie-oft-zum-barber': ['haircut', 'beard', 'haircut-beard'],
};

export const articleServices = (slug: string) => (ARTICLE_SERVICES[slug] ?? []).map(byId);

const SKIP_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'script', 'style', 'label']);
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const LINK_CLASS = 'font-medium text-brand-cream underline-offset-4 hover:underline';

type State = { linked: Set<string>; count: number; max: number };

function compile(table: LinkTerm[]) {
  const lookup = new Map<string, string>();
  table.forEach(({ terms, href }) => terms.forEach((term) => lookup.set(term, href)));
  const alternation = Array.from(lookup.keys())
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|');
  // Whole words only: "Haarschnitt" never matches inside "Herrenhaarschnitt".
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${alternation})(?![\\p{L}\\p{N}])`, 'gu');
  return { lookup, pattern };
}

type Compiled = ReturnType<typeof compile>;

function hrefOf(node: ReactElement): string | undefined {
  const href = (node.props as { href?: unknown }).href;
  return typeof href === 'string' ? href : undefined;
}

/** Collect links already in the text, so a target is never linked twice. */
function collectLinked(node: ReactNode, linked: Set<string>) {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const href = hrefOf(child);
    if (href) linked.add(href);
    collectLinked((child.props as { children?: ReactNode }).children, linked);
  });
}

function linkText(text: string, compiled: Compiled, state: State, keyPrefix: string): ReactNode {
  if (state.count >= state.max) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  compiled.pattern.lastIndex = 0;
  for (const match of Array.from(text.matchAll(compiled.pattern))) {
    if (state.count >= state.max) break;
    const href = compiled.lookup.get(match[1]);
    if (!href || state.linked.has(href)) continue;
    state.linked.add(href);
    state.count += 1;
    const start = match.index ?? 0;
    parts.push(text.slice(last, start));
    parts.push(
      <Link key={`${keyPrefix}-${start}`} href={href} className={LINK_CLASS}>
        {match[1]}
      </Link>,
    );
    last = start + match[1].length;
  }
  if (parts.length === 0) return text;
  parts.push(text.slice(last));
  return parts;
}

function walk(node: ReactNode, compiled: Compiled, state: State, keyPrefix: string): ReactNode {
  if (typeof node === 'string') return linkText(node, compiled, state, keyPrefix);
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const result = walk(child, compiled, state, `${keyPrefix}.${index}`);
      // Split strings come back as arrays; keep them keyed inside a list.
      return Array.isArray(result) ? <span key={`${keyPrefix}.${index}`}>{result}</span> : result;
    });
  }
  if (!isValidElement(node)) return node;
  if (typeof node.type === 'string' && SKIP_TAGS.has(node.type)) return node;
  if (hrefOf(node)) return node;

  const props = node.props as { children?: ReactNode };
  if (props.children === undefined) return node;
  const children = walk(props.children, compiled, state, `${keyPrefix}.c`);
  if (children === props.children) return node;
  return cloneElement(node, undefined, ...(Array.isArray(children) ? children : [children]));
}

const COMPILED = new Map<LinkTerm[], Compiled>();

/**
 * Link the first mention of each service in a block of running text.
 * Each target is linked once, at most `max` links, never inside headings,
 * buttons or existing links. The words stay exactly as written.
 */
export function autoLink(node: ReactNode, { table = SERVICE_TERMS, max = 6 } = {}): ReactNode {
  let compiled = COMPILED.get(table);
  if (!compiled) {
    compiled = compile(table);
    COMPILED.set(table, compiled);
  }
  const state: State = { linked: new Set(), count: 0, max };
  collectLinked(node, state.linked);
  return walk(node, compiled, state, 'al');
}

export function AutoLinked({ children, max }: { children: ReactNode; max?: number }) {
  return <>{autoLink(children, { max })}</>;
}
