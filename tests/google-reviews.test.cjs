const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relativePath, dependencies = {}, env = {}) {
  const module = { exports: {} };
  const filename = path.join(__dirname, '..', relativePath);
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(js, {
    module, exports: module.exports, process: { env }, URL, Date, Map, Set, Buffer,
    require(name) {
      if (name === 'server-only') return {};
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      return require(name);
    },
  }, { filename });
  return module.exports;
}

const googleEnv = {
  GOOGLE_REVIEWS_CLIENT_ID: 'test-client', GOOGLE_REVIEWS_CLIENT_SECRET: 'test-secret',
  GOOGLE_REVIEWS_REFRESH_TOKEN: 'test-refresh', GOOGLE_REVIEWS_LOCATION_NAME: 'accounts/123/locations/456',
};

function setupSync(pages, env = googleEnv) {
  const requests = [];
  const writes = [];
  let index = 0;
  class OAuth2 {
    setCredentials(credentials) { assert.equal(credentials.refresh_token, 'test-refresh'); }
    async request(options) {
      requests.push(options);
      const page = pages[index++];
      if (page instanceof Error) throw page;
      return { data: page };
    }
  }
  const client = { async rpc(name, args) { writes.push({ name, args }); return { data: true, error: null }; } };
  const api = load('lib/reviews/sync.ts', {
    googleapis: { google: { auth: { OAuth2 } } }, '@/lib/reviews/store': { reviewsClient: () => client },
  }, env);
  return { api, requests, writes };
}

test('full pagination selects seven newest WRITTEN reviews and keeps official ALL-review aggregates', async () => {
  const reviews = Array.from({ length: 11 }, (_, i) => ({
    reviewId: String(i), reviewer: { displayName: `Kunde ${i}` }, starRating: 'FIVE',
    comment: `  Originaltext ${i}  `, createTime: `2026-09-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
    updateTime: '2026-09-15T12:00:00Z',
  }));
  const empty = { ...reviews[0], reviewId: 'no-text', comment: '  ', createTime: '2026-09-16T12:00:00Z' };
  const { api, requests, writes } = setupSync([
    { reviews: [...reviews.slice(0, 4), empty], averageRating: 4.7, totalReviewCount: 167, nextPageToken: 'page2' },
    { reviews: reviews.slice(4), averageRating: 4.7, totalReviewCount: 167 },
  ]);
  await api.syncGoogleReviews();
  assert.equal(requests.length, 2);
  assert.equal(new URL(requests[1].url).searchParams.get('pageToken'), 'page2');
  assert.equal(writes.length, 1);
  assert.equal(writes[0].name, 'sync_google_reviews');
  assert.equal(writes[0].args.p_rating, 4.7);
  assert.equal(writes[0].args.p_total_review_count, 167);
  const cards = writes[0].args.p_reviews;
  assert.equal(cards.length, 7);
  assert.equal(cards[0].google_review_id, '10');
  assert.equal(cards[6].google_review_id, '4');
  assert.equal(cards[0].review_text, '  Originaltext 10  ');
  assert.ok(cards.every((review) => review.google_review_id !== 'no-text'));
});

test('missing OAuth configuration fails safely before calls or storage', async () => {
  const { api, requests, writes } = setupSync([], {});
  await assert.rejects(api.syncGoogleReviews(), (error) => error.code === 'google_setup_required' && error.missing.includes('GOOGLE_REVIEWS_REFRESH_TOKEN'));
  assert.equal(requests.length, 0); assert.equal(writes.length, 0);
});

test('failed later page never replaces the last good snapshot or leaks credentials', async () => {
  const { api, writes } = setupSync([
    { averageRating: 5, totalReviewCount: 10, nextPageToken: 'page2' }, new Error('Secret access token: do-not-leak'),
  ]);
  await assert.rejects(api.syncGoogleReviews(), (error) => error.code === 'google_api_access_failed' && !error.message.includes('do-not-leak'));
  assert.equal(writes.length, 0);
});

test('repeated pagination tokens abort rather than storing incomplete reviews', async () => {
  const page = { averageRating: 5, totalReviewCount: 10, nextPageToken: 'repeat' };
  const { api, writes } = setupSync([page, page]);
  await assert.rejects(api.syncGoogleReviews(), (error) => error.code === 'repeated_page_token');
  assert.equal(writes.length, 0);
});

test('secret authorization fails closed and requires at least 32 characters', () => {
  const { authorizedSecret } = load('lib/reviews/security.ts', { googleapis: {} });
  const secret = 'x'.repeat(32);
  assert.equal(authorizedSecret(new Request('https://example.test'), secret), false);
  assert.equal(authorizedSecret(new Request('https://example.test', { headers: { Authorization: `Bearer ${secret}` } }), secret), true);
  assert.equal(authorizedSecret(new Request('https://example.test', { headers: { Authorization: 'Bearer short' } }), 'short'), false);
  assert.equal(authorizedSecret(new Request('https://example.test', { headers: { Authorization: `Bearer ${'y'.repeat(32)}` } }), secret), false);
});

test('Pub/Sub checks service account identity, verified email and Google issuer', async () => {
  let claims = { email: 'push@example.iam.gserviceaccount.com', email_verified: true, iss: 'https://accounts.google.com' };
  class OAuth2 { async verifyIdToken(options) { assert.equal(options.audience, 'https://example.test/webhook'); return { getPayload: () => claims }; } }
  const { authorizedPubSub } = load('lib/reviews/security.ts', { googleapis: { google: { auth: { OAuth2 } } } }, {
    GOOGLE_REVIEWS_PUBSUB_AUDIENCE: 'https://example.test/webhook', GOOGLE_REVIEWS_PUBSUB_SERVICE_ACCOUNT_EMAIL: claims.email,
  });
  const request = new Request('https://example.test/webhook', { headers: { Authorization: 'Bearer signed-test-jwt' } });
  assert.equal(await authorizedPubSub(request), true);
  claims = { ...claims, email_verified: false }; assert.equal(await authorizedPubSub(request), false);
  claims = { ...claims, email_verified: true, email: 'other@example.test' }; assert.equal(await authorizedPubSub(request), false);
  assert.equal(await authorizedPubSub(new Request('https://example.test/webhook')), false);
});

test('JSON body reader rejects oversized notifications', async () => {
  const { boundedJson } = load('lib/reviews/security.ts', { googleapis: {} });
  const result = await boundedJson(new Request('https://example.test', { method: 'POST', body: '{"ok":true}' }));
  assert.equal(result.ok, true);
  await assert.rejects(boundedJson(new Request('https://example.test', { method: 'POST', body: 'x'.repeat(100) }), 32));
});
