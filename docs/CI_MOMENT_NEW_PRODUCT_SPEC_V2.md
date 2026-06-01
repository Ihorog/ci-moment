# CI MOMENT / LEGEND CI — NEW PRODUCT SPEC v2

Status: `NEW DEVELOPMENT TRUTH`

Date: 2026-06-01

Repository: `Ihorog/ci-moment`

Purpose: replace the old MVP-oriented product direction with a new telemetry-first, artifact-first, trust-first commercial product architecture.

---

## 0. Source hierarchy

This document defines the current development direction.

```text
1. Current strategy and economics research
2. Ci / Cimeika product canon
3. New Product Spec v2
4. Old GitHub repo state as historical reference only
```

The existing repository is treated as reference material, not as the final architecture.

Old repo facts may still be reused when useful:

- Next.js frontend structure.
- Existing decision engine idea.
- Artifact code / verify direction.
- Gumroad checkout experience.
- Vercel deployment baseline.

But the old implementation must not control the new product direction.

---

## 1. Core product definition

Ci Moment is not a generic SaaS page and not only a decision widget.

Ci Moment is a ritualized digital signal system that helps a user pass from attention to a sealed personal checkpoint.

Core formula:

```text
Attention
→ Context
→ Threshold
→ Result
→ Seal
→ Artifact
→ Verify
→ Repeat
→ Referral / Membership
```

Public product sentence:

```text
Ci Moment helps you recognize, seal, and revisit a personal moment of decision.
```

Commercial product sentence:

```text
Ci Moment converts a short emotional decision window into a verified digital artifact, repeat cycle, and trust-based revenue loop.
```

Risk boundary:

```text
Not advice. Not prediction. Not therapy. Not financial, legal, medical, or life-critical guidance.
A personal moment signal and symbolic checkpoint.
```

---

## 2. Product position

### 2.1 Old position

```text
Minimalist SaaS decision tool
→ select Career / Love / Timing
→ get signal
→ direct Gumroad checkout
```

### 2.2 New position

```text
Ritualized revenue system
→ measurable first-session value
→ sealed artifact
→ verification loop
→ archive / reseal / membership
→ referral object
```

### 2.3 Product category

Hybrid category:

- personal decision ritual;
- symbolic artifact product;
- lightweight reflective tool;
- trust-surface product;
- potential membership / archive system.

Do not position as a heavy productivity SaaS.

---

## 3. Required user journey

### 3.1 Main journey

```text
Visit
→ See clear value proposition
→ Select context
→ Confirm threshold
→ Receive result
→ Understand artifact value
→ Click seal
→ Checkout
→ Order matched
→ Artifact verified
→ User returns later
→ Repeat / archive / share / membership
```

### 3.2 Minimum screens

1. Landing / Trust entry.
2. Context selection.
3. Threshold confirmation.
4. Manifest / processing transition.
5. Result.
6. Seal CTA.
7. Checkout handoff.
8. Verify artifact.
9. Archive / return state.
10. Membership / bundle offer.

---

## 4. Commercial architecture

### 4.1 Main economic rule

Do not build the initial economy on cold paid acquisition for a low one-time seal fee.

Reason: the one-time payment has too low a CAC ceiling before real cohort data exists.

Preferred economic path:

```text
Organic / referral / email / partner traffic
→ high Result completion
→ Seal intent
→ Bundle / membership / archive
→ Repeat usage
→ referral artifact sharing
```

### 4.2 Offer ladder

```text
Free moment check
→ Single seal
→ Bundle / pack
→ Archive access
→ Monthly membership
→ Annual membership
→ Partner / API use case
```

### 4.3 Revenue objects

| Object | Role |
|---|---|
| Free check | acquisition and first value |
| Single seal | first transaction |
| Bundle | AOV increase |
| Artifact archive | retention |
| Membership | LTV increase |
| Share card | referral acquisition |
| Partner/API | future B2B or embedded distribution |

---

## 5. Telemetry-first architecture

The current critical blocker is the broken measurement loop between product events, checkout, artifact, source attribution, and repeat behavior.

The new system must close this loop.

```text
source
→ session
→ result
→ seal click
→ checkout open
→ paid order
→ artifact
→ verify
→ repeat
→ membership
→ referral
```

### 5.1 Required events

Minimum event set:

```text
page_view
context_selected
threshold_confirmed
result_rendered
seal_clicked
gumroad_checkout_opened
gumroad_order_matched
artifact_verified
repeat_visit_30d
membership_started
membership_renewed
membership_canceled
```

### 5.2 Required event fields

Each event should include:

```text
event_id
session_id
anonymous_user_id
source
utm_source
utm_medium
utm_campaign
referrer
route
context
artifact_id
verify_hash
checkout_id
order_id
membership_id
device_type
country_optional
timestamp
```

Privacy rule:

Do not collect unnecessary personal data. Prefer pseudonymous IDs, hashes, aggregated analytics, and explicit consent for email lifecycle.

---

## 6. CRSS metric

Ci Moment needs its own operating metric.

```text
CRSS = result_view_rate × seal_click_rate × repeat_rate_30d
```

Meaning:

```text
CRSS measures whether a channel produces stable reaction, not just traffic.
```

Use CRSS to rank channels:

- SEO / docs;
- referral / artifact sharing;
- email / reactivation;
- organic social;
- partner traffic;
- retargeting;
- cold paid traffic.

Cold paid traffic should stay blocked until telemetry and LTV are proven.

---

## 7. Recommended platform stack

### 7.1 Frontend

Primary:

```text
Next.js + Vercel
```

Role:

- landing;
- app-like UX;
- result flow;
- basic analytics;
- SEO pages;
- trust pages.

### 7.2 Event layer

Primary:

```text
Cloudflare Workers / Analytics Engine
```

Role:

- funnel events;
- high-cardinality telemetry;
- source attribution;
- usage/event stream;
- edge-safe event intake.

### 7.3 Durable data

Primary:

```text
Supabase with RLS
```

Role:

- artifacts;
- orders;
- consent;
- cohorts;
- verification;
- membership states;
- durable event aggregates.

### 7.4 Checkout

Initial:

```text
Gumroad checkout
```

Role:

- payment processing;
- product purchase;
- memberships / bundles / upsells;
- order export / API reconciliation;
- affiliate / referral potential.

Important: actual platform pricing, legal, privacy and payment conditions must be rechecked before final production decisions.

---

## 8. Gumroad attribution model

The checkout link must not be a blind redirect.

Required checkout handoff:

```text
artifact_id
verify_hash
session_id
source
utm parameters
return_url
passthrough/custom field
```

Required reconciliation:

```text
Gumroad order
→ passthrough / custom field
→ artifact_id / verify_hash
→ session_id
→ source
→ user lifecycle
```

Acceptance rule:

A paid order is not analytically useful until it is matched to an artifact and source.

---

## 9. Artifact and verification model

### 9.1 Artifact role

The artifact is not decoration. It is the product object.

It must support:

- proof of sealed moment;
- verification;
- return visits;
- sharing;
- archive;
- membership expansion;
- referral surface.

### 9.2 Artifact fields

```text
artifact_id
artifact_code
verify_hash
context
result_status
result_copy_variant
locked_minute
created_at
sealed_at
order_id
source
session_id
share_slug
is_verified
is_public_share_enabled
```

### 9.3 Verification page

The verify page must show:

- artifact code;
- context;
- sealed status;
- creation/seal time;
- trust explanation;
- share option;
- return/reseal CTA;
- membership/archive CTA.

---

## 10. Trust surface

`cimeika.com.ua` must not be an internal status page for this product surface.

Required role:

```text
Acquisition + trust + explanation + verification + privacy narrative
```

Required pages:

1. What is Ci Moment?
2. How artifact sealing works.
3. Verify a moment.
4. Privacy and data minimization.
5. Not advice / not prediction / not therapy.
6. Pricing / memberships / bundles.
7. Contact / support.

The trust surface should send qualified traffic into the app, not expose internal infrastructure status to public visitors.

---

## 11. Privacy and compliance boundaries

### 11.1 Email lifecycle

Email must require explicit consent.

Required consent events:

```text
email_consent_requested
email_consent_granted
email_consent_revoked
```

### 11.2 Profiling boundary

If the product moves toward personalized scoring in sensitive life contexts, legal/privacy review becomes mandatory.

Keep public wording conservative:

```text
Personal moment signal.
Not professional advice.
Not prediction.
Not automated decision with legal or similarly significant effects.
```

### 11.3 Data minimization

Default collection:

- anonymous session;
- event name;
- source/referrer/UTM;
- artifact ID/hash;
- order match ID;
- consent state.

Avoid:

- unnecessary names;
- sensitive emotional profiles;
- raw private prompts;
- uncontrolled personal notes;
- hidden profiling claims.

---

## 12. Suggested database schema v2

### 12.1 `ci_sessions`

```sql
create table ci_sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  device_type text,
  created_at timestamptz default now()
);
```

### 12.2 `ci_events`

```sql
create table ci_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references ci_sessions(id),
  event_name text not null,
  context text,
  artifact_id uuid,
  order_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
```

### 12.3 `ci_artifacts`

```sql
create table ci_artifacts (
  id uuid primary key default gen_random_uuid(),
  artifact_code text unique not null,
  verify_hash text unique not null,
  session_id uuid references ci_sessions(id),
  context text not null,
  result_status text not null,
  locked_minute bigint,
  source text,
  sealed_at timestamptz,
  order_id text,
  is_verified boolean default false,
  is_public_share_enabled boolean default false,
  created_at timestamptz default now()
);
```

### 12.4 `ci_orders`

```sql
create table ci_orders (
  id uuid primary key default gen_random_uuid(),
  external_provider text not null,
  external_order_id text unique not null,
  artifact_id uuid references ci_artifacts(id),
  session_id uuid references ci_sessions(id),
  amount_cents integer,
  currency text,
  product_type text,
  raw_status text,
  matched_at timestamptz,
  created_at timestamptz default now()
);
```

### 12.5 `ci_consents`

```sql
create table ci_consents (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text,
  email_hash text,
  consent_type text not null,
  status text not null,
  source text,
  created_at timestamptz default now()
);
```

### 12.6 `ci_memberships`

```sql
create table ci_memberships (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text,
  external_provider text,
  external_membership_id text,
  status text,
  started_at timestamptz,
  renewed_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz default now()
);
```

---

## 13. Implementation phases

### Phase 1 — Audit and freeze old state

Goal: prevent accidental continuation of obsolete MVP assumptions.

Tasks:

- Mark old Gumroad-only architecture as reference.
- Add this spec as source of truth.
- Identify old files that remain useful.
- Create development backlog from this document.

Acceptance criteria:

- v2 spec exists in repo.
- README points to v2 spec or notes old MVP status.
- No destructive code rewrite yet.

### Phase 2 — Event layer MVP

Goal: make product measurable.

Tasks:

- Add `trackEvent()` utility.
- Add events to user journey.
- Persist minimal event stream.
- Add session/source tracking.
- Add UTM capture.

Acceptance criteria:

- `page_view` captured.
- `context_selected` captured.
- `result_rendered` captured.
- `seal_clicked` captured.
- Events include session/source.

### Phase 3 — Artifact v2

Goal: make artifact the product object.

Tasks:

- Generate artifact before checkout.
- Store artifact with session/source.
- Pass verify hash to checkout.
- Create verify page v2.

Acceptance criteria:

- Artifact exists before checkout handoff.
- Verify page can display artifact.
- Artifact can be matched after payment.

### Phase 4 — Gumroad reconciliation

Goal: close order matching.

Tasks:

- Use Gumroad passthrough/custom fields.
- Add order import/reconciliation endpoint or script.
- Match order to artifact/session/source.
- Track `gumroad_order_matched`.

Acceptance criteria:

- Paid order can be matched to artifact.
- Matched order updates artifact sealed state.
- Funnel can compute paid conversion.

### Phase 5 — Trust surface

Goal: reduce bounce and increase checkout trust.

Tasks:

- Create public trust pages.
- Add explanation of artifact/verify.
- Add privacy narrative.
- Add not-advice disclaimer.
- Add pricing/offer ladder.

Acceptance criteria:

- Public visitor can understand product before payment.
- Verify page is externally understandable.
- Internal status screens are not the public acquisition surface.

### Phase 6 — LTV ladder

Goal: move beyond one-time seal fee.

Tasks:

- Add bundle offer.
- Add membership CTA.
- Add archive concept.
- Add email consent flow.
- Add repeat/reseal flow.

Acceptance criteria:

- User can return after seal.
- User can understand bundle/membership value.
- Repeat and membership events are tracked.

---

## 14. Copilot execution rules

Copilot / AI agents must follow this hierarchy:

```text
1. Preserve user data and secrets.
2. Do not expose private keys or payment secrets.
3. Do not treat old MVP code as final product truth.
4. Implement telemetry before scaling traffic.
5. Keep artifact and verification central.
6. Add tests for every event/order/artifact function.
7. Keep legal/professional-advice disclaimers visible.
```

### Do not

- Do not remove verification logic without replacement.
- Do not hardcode private credentials.
- Do not claim payment attribution works until tested.
- Do not implement cold paid growth logic before telemetry.
- Do not turn the product into medical/legal/financial advice.

### Must

- Track source/session for every meaningful action.
- Match orders to artifacts.
- Keep user consent explicit.
- Keep privacy language conservative.
- Treat artifact as core product object.

---

## 15. Developer backlog v2

### Immediate tasks

```text
[ ] Add docs/CI_MOMENT_NEW_PRODUCT_SPEC_V2.md
[ ] Update README with v2 direction notice
[ ] Add docs/TELEMETRY_SPEC.md
[ ] Add docs/GUMROAD_ATTRIBUTION_SPEC.md
[ ] Add docs/TRUST_SURFACE_SPEC.md
[ ] Add event utility
[ ] Add session/UTM capture
[ ] Add artifact pre-checkout creation
[ ] Add checkout passthrough
[ ] Add order reconciliation plan
```

### Next tasks

```text
[ ] Add Supabase schema v2 migration
[ ] Add Cloudflare event endpoint design
[ ] Add CRSS dashboard spec
[ ] Add verify page v2
[ ] Add share card / OG artifact endpoint
[ ] Add email consent flow
[ ] Add bundle/membership offer logic
[ ] Add analytics QA checklist
```

---

## 16. Acceptance criteria for v2 product direction

The new Ci Moment direction is valid only when the system can answer:

1. Where did this user/session come from?
2. Did the user reach Result?
3. Did the user click Seal?
4. Did checkout open?
5. Did a paid order happen?
6. Which artifact was paid for?
7. Did the user verify or revisit?
8. Did the user repeat, share, or join membership?
9. Which channel has the strongest CRSS?
10. What is the real LTV/CAC boundary after data exists?

Until then, economic claims remain simulation.

---

## 17. Final operating principle

```text
Not traffic → sale.

Result → Seal → Artifact → Verify → Repeat → Referral.
```

This is the active development truth for Ci Moment v2.
