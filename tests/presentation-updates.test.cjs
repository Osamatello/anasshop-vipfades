const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const cp = require('node:child_process');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const maps = 'https://www.google.com/maps/search/?api=1&query=VIP+FADES+An+der+Moselbr%C3%BCcke+9+Koblenz';
const icon = (props) => React.createElement('svg', props);
const icons = new Proxy({}, { get: () => icon });
const link = ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
const source = (path) => fs.readFileSync(path, 'utf8');
function load(path, mocks = {}) {
  const module = { exports: {} };
  const output = ts.transpileModule(source(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(output, {
    module, exports: module.exports,
    require: (name) => mocks[name] ?? (name === 'lucide-react' ? icons : name === 'next/link' ? link : require(name)),
  }, { filename: path });
  return module.exports.default;
}
function rating(data, props = {}) {
  const Component = load('components/reviews/GoogleRating.tsx', {
    '@/components/reviews/GoogleReviewsProvider': { useGoogleReviews: () => data },
    '@/lib/reviews/types': { GOOGLE_REVIEWS_LINK: maps },
  });
  return renderToStaticMarkup(React.createElement(Component, props));
}
const ready = { stats: { rating: 4.6, totalReviewCount: 211 }, status: 'ready' };

test('original seven testimonials, rows, cards, styles and animations are unchanged', () => {
  const original = cp.execFileSync('git', ['show', 'd9c1460ba63d5a459ea57f30c41415c88d84089f:components/ClientExperiences.tsx'], { encoding: 'utf8' });
  const restored = source('components/ClientExperiences.tsx')
    .replace("\nimport GoogleRating from '@/components/reviews/GoogleRating';", '')
    .replace('\n\n          <div className="mt-6"><GoogleRating /></div>', '')
    .replace('        <div className="mt-10 flex justify-center"><GoogleRating reviewBlock /></div>\n', '');
  assert.equal(restored.trimEnd(), original.trimEnd());
  assert.equal((restored.match(/initials:/g) || []).length, 7);
  assert.doesNotMatch(restored, /useGoogleReviews/);
});

test('Hero uses right-hand rating, five fractional stars and numeric-only count', () => {
  const html = rating(ready, { compact: true });
  assert.match(html, /order-last text-\[42px\]/);
  assert.match(html, />4\.6<\/span>/);
  assert.match(html, />211<\/span>/);
  assert.equal((html.match(/relative block h-3\.5/g) || []).length, 5);
  assert.match(html, /width:59\.999999999999964%/);
  const visible = html.replace(/<[^>]*>/g, '');
  assert.equal(visible, '4.6211');
  assert.doesNotMatch(visible, /GOOGLE-BEWERTUNGEN|Auf Google ansehen/i);
});

test('both testimonial summaries reuse live aggregates and footer block links to Maps', () => {
  for (const props of [{}, { reviewBlock: true }]) {
    const html = rating(ready, props);
    assert.match(html, />4\.6<\/span>/);
    assert.match(html, />211 Google-Bewertungen<\/span>/);
  }
  const block = rating(ready, { reviewBlock: true });
  assert.match(block, /h-px w-5/);
  assert.match(block, /Auf Google ansehen/);
  assert.match(block, /target="_blank" rel="noopener noreferrer"/);
  assert.ok(block.includes(`href="${maps.replace(/&/g, '&amp;')}"`));
});

test('unconfigured Google data never renders invented values or Hero labels', () => {
  for (const status of ['loading', 'pending', 'unavailable']) {
    const hero = rating({ stats: null, status }, { compact: true });
    assert.match(hero, /role="status" class="sr-only"/);
    assert.doesNotMatch(hero, /tabular-nums|Auf Google ansehen/);
    const block = rating({ stats: null, status }, { reviewBlock: true });
    assert.match(block, /Auf Google ansehen/);
    assert.doesNotMatch(block, /tabular-nums/);
  }
});

test('Hero has no native or custom playback controls and keeps video behavior', () => {
  const hero = source('components/Hero.tsx');
  for (const attribute of ['autoPlay', 'muted', 'loop', 'playsInline']) assert.match(hero, new RegExp(`\\b${attribute}\\b`));
  assert.doesNotMatch(hero, /togglePlayback|Hintergrundvideo abspielen|Hintergrundvideo pausieren|\bcontrols\b|\bPlay\b|\bPause\b/);
  assert.match(hero, /prefers-reduced-motion/);
  assert.match(hero, /videoRef\.current\?\.pause\(\)/);
});

test('homepage keeps three cards, advertises six more, and links to catalogue', () => {
  const services = Array.from({ length: 7 }, (_, i) => ({ id: i === 0 ? 'haircut-beard' : `individual-${i}`, name: `Service ${i}` }));
  const vip = [{ id: 'vip-1', name: 'VIP KÖNIGSKLASSE', slug: 'vip-koenigsklasse' }, { id: 'vip-2', name: 'VIP EXKLUSIV', slug: 'vip-exklusiv' }];
  const card = (props) => React.createElement('article', null, props.service?.name ?? props.vipPackage.name);
  const Component = load('components/Services.tsx', {
    '@/lib/data': { SERVICES: services },
    '@/components/chat/constants': { VIP_PACKAGE_CARDS: vip },
    '@/components/VipPackageCard': { default: card, __esModule: true },
    '@/components/ServiceCard': { default: card, __esModule: true },
    '@/lib/services/presentation': { serviceAnchor: (service) => service.id === 'haircut-beard' ? 'haarschnitt-bart' : service.id },
  });
  const home = renderToStaticMarkup(React.createElement(Component));
  assert.equal((home.match(/<article>/g) || []).length, 3);
  assert.match(home, /\+ 6 weitere Leistungen/);
  assert.match(home, /href="\/leistungen"[^>]*>Alle Leistungen ansehen/);
  for (const anchor of ['vip-koenigsklasse', 'vip-exklusiv', 'haarschnitt-bart']) assert.ok(home.includes(`href="/leistungen#${anchor}"`));
  const full = renderToStaticMarkup(React.createElement(Component, { fullCatalogue: true }));
  assert.equal((full.match(/<article>/g) || []).length, 9);
  assert.doesNotMatch(full, /weitere Leistungen/);
});

test('Footer contact details have exact clickable phone and email links', () => {
  const footer = source('components/Footer.tsx');
  assert.match(footer, /href="tel:\+4917663782674"/);
  assert.match(footer, /\+49 176 63782674/);
  assert.match(footer, /href="mailto:vipfadeskoplenz@gmail\.com"/);
  assert.match(footer, /focus-visible:outline/);
});
