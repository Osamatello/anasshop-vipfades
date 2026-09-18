# Google Reviews setup — VIP FADES

## Current state and safety boundaries

The feature implements the official GBP Reviews API, signed Pub/Sub push notifications,
daily reconciliation, an atomic review-only Supabase cache, and one website snapshot.
No Google settings, Google Calendar credentials, production database, booking structures,
booking API or dashboard have been changed. No fabricated review counts/ratings are used.
Without an initial successful sync, the website shows a link to Google, not sample reviews.
Owner access alone does not establish Google Cloud API approval or OAuth authorization.
The connected GitHub/Supabase/Vercel tools do not provide Google Cloud Console access.

## Required preparation

1. Select the authorized Google Cloud project for this integration. Check GBP API access:
   a zero quota means the project is not approved; apply for **Basic API Access** if necessary.
   Do not assume the existing Google Calendar project already has GBP access.
2. Enable the official Google My Business API (reviews), My Business Account Management,
   My Business Business Information, My Business Notifications and Cloud Pub/Sub APIs as needed.
3. Configure an OAuth consent screen and a Web Application OAuth client. Anas must personally
   authorize the client with `https://www.googleapis.com/auth/business.manage` and offline access.
   Store the resulting refresh token privately. Testing-mode consent can expire refresh tokens;
   prepare a durable, appropriately published consent configuration before activating live sync.
   Do not send tokens or client secrets through chat, Git or browser-visible environment variables.
4. Using that authorized account, perform read-only requests to list accounts and locations.
   Confirm the **verified VIP FADES location** and record `accounts/ACCOUNT_ID/locations/LOCATION_ID`.
5. Apply **only** `20260916090329_google_reviews_cache.sql` to the chosen review database after review.
   Do not run all repository migrations: existing migration history is separate from this work.
   Enable Supabase Cron if not already enabled and schedule hourly
   `select public.purge_expired_google_reviews();` before caching data. The migration schedules
   this automatically only when `pg_cron` is already installed. No extension is installed by this feature.
   Use a dedicated Preview database when testing isolation is required; creating a paid branch
   or provisioning another project has not been performed automatically.

## Server-side environment variables

Set these in the existing Vercel project's **Preview** environment for this feature branch first.

| Name | Required value |
| --- | --- |
| `GOOGLE_REVIEWS_CLIENT_ID` | Authorized OAuth client's ID |
| `GOOGLE_REVIEWS_CLIENT_SECRET` | OAuth client's secret |
| `GOOGLE_REVIEWS_REFRESH_TOKEN` | Refresh token from Anas' owner consent with `business.manage` |
| `GOOGLE_REVIEWS_LOCATION_NAME` | `accounts/ACCOUNT_ID/locations/LOCATION_ID` |
| `GOOGLE_REVIEWS_SYNC_SECRET` | Independent random secret, at least 32 characters, for manual POST sync |
| `CRON_SECRET` | Random secret, at least 32 characters, for the protected daily GET fallback |
| `GOOGLE_REVIEWS_PUBSUB_AUDIENCE` | Exact OIDC audience configured on the push subscription, normally the webhook URL |
| `GOOGLE_REVIEWS_PUBSUB_SERVICE_ACCOUNT_EMAIL` | Exact service account identity configured on the push subscription |
| `GOOGLE_REVIEWS_PUBSUB_SUBSCRIPTION` | Exact `projects/PROJECT_ID/subscriptions/SUBSCRIPTION_ID` |

The existing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only
`SUPABASE_SECRET_KEY` are reused only for the new review tables/RPCs. To use an isolated
review database, provide **all three** server-only overrides:
`GOOGLE_REVIEWS_SUPABASE_URL`, `GOOGLE_REVIEWS_SUPABASE_PUBLISHABLE_KEY`,
`GOOGLE_REVIEWS_SUPABASE_SECRET_KEY`. Never prefix a secret key with `NEXT_PUBLIC_`.

## Initial synchronization

Redeploy the **feature Preview only** after setting environment variables. From a secure local
terminal with the sync secret already in the environment, run:

```bash
curl --fail-with-body -X POST \
  -H "Authorization: Bearer $GOOGLE_REVIEWS_SYNC_SECRET" \
  "https://YOUR_FEATURE_PREVIEW/api/google-reviews/sync"
```

Check `/api/google-reviews`: status must be `ready`, aggregate values must match GBP,
and cards must contain at most seven non-empty reviews ordered by publication date.
The total and average are Google's official values, including ratings without text.
All review pages are fetched transiently to find the newest seven by publication time,
since Google's API sorts by update time rather than publication time. Only seven are cached.

## Pub/Sub notifications

1. Create a dedicated topic and grant `pubsub.topics.publish` to
   `mybusiness-api-pubsub@system.gserviceaccount.com`.
2. Create an **authenticated wrapped push** subscription to
   `https://YOUR_FEATURE_PREVIEW/api/google-reviews/notifications`, with the configured OIDC
   audience and service account email. Allow Pub/Sub's service agent to mint the service
   account's token as required by Google's documentation. Do not make the endpoint public
   by disabling Vercel deployment protection. Use the stable feature-branch alias rather than
   a deployment-specific URL. If protection is enabled, Anas/the project owner must provide
   an approved **Automation Bypass** secret; configure the push URL as
   `https://YOUR_STABLE_FEATURE_ALIAS/api/google-reviews/notifications?x-vercel-protection-bypass=SECRET`.
   Keep the OIDC audience equal to the clean webhook URL without that query string, and
   keep the bypass secret private. Manual sync similarly needs the approved
   `x-vercel-protection-bypass` header when protection is enabled. No bypass secret is created,
   read, or deployment-protection setting changed by this feature. Until access is approved,
   test manual sync only through authorized access.
3. Read the account's current notification settings first:
   `GET https://mybusinessnotifications.googleapis.com/v1/accounts/ACCOUNT_ID/notificationSetting`.
   There is only one topic setting per account. **Do not replace an existing topic/settings
   blindly.** Preserve other notification types; if another topic is already configured,
   reuse it with a separate subscriber or request approval for a deliberate migration.
4. Once approved, configure `NEW_REVIEW` and `UPDATED_REVIEW` through the Notifications API,
   preserving existing types/settings. No settings PATCH is performed by website code.
5. Confirm a signed notification yields 204 only after storage succeeds. Unsigned requests
   yield 401; unexpected subscriptions yield 403; failures yield 503 for Pub/Sub retry.
   Duplicate notifications run an idempotent sync, not duplicate inserts.

## Periodic fallback, expiry and Preview limitations

`vercel.json` declares a daily GET sync in the 03:00–03:59 UTC window on Hobby.
Vercel Cron executes **only on Production**;
adding it to this feature branch does not activate a job on the current production deployment.
For ongoing Preview synchronization, configure an explicitly approved external scheduler
to call the protected GET endpoint, or use manual POST sync while testing. Supabase's hourly
cache expiry job is independent of OAuth and removes expired content.

Google permits only limited, secure, temporary API-content caching. This feature keeps the
seven necessary review records and the unchanged aggregate values returned by Google,
expires them after 29 days, rejects expired reads, and prunes obsolete cached records.
It does not rewrite review text or compute an average from the displayed subset.

## Official references

- [GBP API approval prerequisites](https://developers.google.com/my-business/content/prereqs)
- [Basic setup](https://developers.google.com/my-business/content/basic-setup)
- [OAuth](https://developers.google.com/my-business/content/implement-oauth)
- [Reviews list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list)
- [Notification setup](https://developers.google.com/my-business/content/notification-setup)
- [Notification settings](https://developers.google.com/my-business/reference/notifications/rest/v1/NotificationSetting)
- [Authenticated push](https://cloud.google.com/pubsub/docs/authenticate-push-subscriptions)
- [Google cache/content policies](https://developers.google.com/my-business/content/policies)
- [Vercel Cron usage](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [Vercel Automation Bypass](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
