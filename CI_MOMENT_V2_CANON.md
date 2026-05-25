# Ci Moment V2 Canon — Personal Legend Artifact Machine

Status: CI-MODEL / product canon
Branch: `next/from-working-mvp`
Base: restored working MVP baseline

## 1. Core Product Thesis

Ci Moment V2 is a zero-auth personal artifact machine.

The primary product is an individual person addressing their own moment and receiving a durable symbolic artifact with a deterministic cipher.

The user does not buy advice. The user claims a personal pass: a generated document that records a moment, a state, and a cipher.

Canonical framing:

- Product: personal digital artifact / pass / key.
- Primary subject: one person and their own moment.
- Surface: single-page artifact machine.
- Output: banknote-like official artifact with a deterministic cipher.
- Meaning layer: Legend ci constitutional fragment unlocked by the cipher.
- Price anchor: one coffee / $5 standard pass.
- Gift mode: a separate $5 access pass that lets another person create their own personal moment.

## 2. Product Hierarchy

### Main product — Personal Moment

```text
one person -> personal moment -> personal artifact -> cipher -> Legend ci fragment
```

The service begins with the person who is using it now. Names of other people are not required for the main flow.

### Secondary product — Gift Access Pass

```text
sender buys access -> recipient receives link/key -> recipient creates their own personal moment
```

Gift mode is not the main generation path. The sender does not generate a decision for another person. The sender gives another person access to perform a new personal generation themselves.

## 3. Commercial Path

Starter commercial stack:

```text
Traffic -> Carrd -> Gumroad -> Payoneer -> local payout
```

Roles:

- Carrd: traffic router / landing page / external storefront.
- Gumroad: checkout, payment handling, digital delivery.
- Payoneer: payout bridge.
- ci-moment app: artifact engine, `/v2`, `/verify`, later `/open/[saleId]`.
- Vercel: application runtime for the artifact engine.

Carrd does not replace the product. Carrd is only the fast market entry layer.

## 4. Correct Positioning

Use:

- Claim the Pass
- Secure the Key
- Open the Seal
- Reveal the Artifact
- Verify Artifact
- Legend ci Fragment
- Personal Moment Pass
- Gift Access Pass

Avoid in primary UI:

- Buy
- Pay
- Donate
- Prediction
- Fortune telling
- Horoscope
- Medical/legal/financial advice

The product should feel like an institutional digital relic, not a mystical toy.

## 5. Visual Canon

Target aesthetic:

- American retro-professional
- 1970s industrial cyber-archive
- old paper / transit pass / banknote / hall pass / archive certificate
- guilloche borders
- serial numbers
- official stamps
- Courier Prime / monospace typography
- restrained palette: off-black terminal + aged paper

Artifact should evoke:

- 100-dollar-bill structural seriousness without copying protected currency design
- constitution-like permanence without claiming governmental authority
- official document feeling without impersonating a real institution

Required legal-safe distinction:

The artifact may be inspired by banknotes and constitutional documents, but must not imitate real US currency, official seals, government layouts, or official legal instruments.

## 6. User Flow — Personal Moment

### Step 1 — Trigger

User enters:

- personal name or alias
- optional context phrase

No account. No password. No email required.

### Step 2 — Claim

User clicks:

- `Secure the Pass — $5`

Gumroad overlay or Gumroad product page handles checkout.

### Step 3 — Revelation

After claim:

- user sees or receives the personal artifact
- artifact displays cipher and Legend ci fragment
- user can save the artifact image
- user can later verify the cipher through `/verify`

## 7. Gift Flow

Gift mode is an invitation product.

The sender buys a Gift Access Pass and forwards the generated access link to a recipient.

Recipient flow:

```text
recipient opens link -> recipient enters their own name/context -> recipient creates their own moment
```

Gift mode must not be framed as generating another person’s fate or decision.

## 8. Cipher Model

The cipher is the bearer identity of the artifact.

Canonical shape:

```text
[element]-[celestial]-[logic]-[serial]
```

Internal indices:

```text
element:   0..3
celestial: 0..8
logic:     0..23
```

Primary personal cipher input:

```text
subjectName + contextHash + generationSeed
```

Gift access cipher input:

```text
senderAlias + giftSeed
```

The cipher unlocks a stable Legend ci fragment. Same cipher must always return the same legend.

## 9. Legend ci Constitution Layer

The artifact is not the final object. It is the key.

`Verify Artifact` or `/verify` allows a user to re-enter the cipher and retrieve the same Legend ci fragment later.

The Legend fragment is composed from:

- Element text: base system state
- Celestial text: environmental influence
- Logic text: action vector

Rule:

`getLegendByCipher(cipher)` must be pure and deterministic.

## 10. Data Policy

Preferred product principle:

```text
Input -> Output -> Forget
```

But implementation must be honest.

### Mode A — Zero-Data Personal Artifact

- no server persistence of personal name/context
- cipher and artifact generated client-side or from non-personal sale key
- user owns screenshot / local artifact
- verification works only from cipher, not stored identity

### Mode B — Minimal-Data Gift Access

- server stores only what is necessary for gift/open access
- fields may include `saleId`, `accessType`, `cipher`, `isRedeemed`, `createdAt`
- recipient creates their own artifact in a separate personal flow
- no accounts, no profile, no tracking history
- visible privacy statement required

For V2 MVP, prefer Mode A for the main personal product. Add Mode B only when gift/open link is implemented.

## 11. Payment Canon

Payment processor: Gumroad.

Primary products:

- Personal Moment Pass: $5
- Gift Access Pass: $5

Safe framing:

- digital artifact purchase
- access pass
- paid digital access
- Gumroad processes checkout

Risky framing to avoid:

- invisible transaction
- avoid taxes
- not legally payment
- donation masking a purchase

## 12. Database Canon

Main personal flow should not require database storage.

If gift/open access requires persistence, simplify to one model:

```prisma
model ArtifactAccess {
  id         String   @id @default(cuid())
  saleId     String   @unique
  accessType String   // personal | gift
  cipher     String?
  isRedeemed Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

No user model. No profile. No auth tables. No unnecessary decision history.

## 13. Technical Scope for First V2 Patch

Target branch: `next/from-working-mvp`

Do first:

1. Keep restored MVP build stability.
2. Add `lib/legend-atlas.ts`.
3. Add personal deterministic cipher functions without breaking old MVP route.
4. Add static artifact renderer.
5. Add static `/verify` cipher decoder.
6. Add Carrd/Gumroad commercial path documentation.
7. Add Gumroad access link after artifact UI is stable.

Do not do first:

- Prisma rewrite before engine/UI stabilizes.
- Webhook complexity before artifact rendering works.
- Reintroduce mixed Supabase + Prisma + Stripe + Gumroad flows.
- Claim zero-data if storing personal inputs.

## 14. Implementation Order

### Phase 0 — Baseline

- Confirm `restore/working-mvp-2026-02-08` builds.
- Work only in `next/from-working-mvp`.

### Phase 1 — Static Personal Artifact Prototype

- `legend-atlas.ts`
- deterministic `generateArtifactCipher`
- static Artifact renderer
- `/verify` decoder from manual cipher input
- `/v2` personal moment prototype

### Phase 2 — Carrd + Gumroad Starter Path

- Carrd landing copy
- Gumroad product setup
- Gumroad product link from V2
- no webhook until flow is visually complete

### Phase 3 — Gift Access Mode

- gift pass copy
- gift access link strategy
- recipient creates their own moment

### Phase 4 — Minimal Server Persistence

- optional access table
- Gumroad webhook
- `/open/[saleId]` or equivalent access route

## 15. Acceptance Checks

- `npm run type-check` passes.
- `npm run build` passes.
- UI works without auth.
- User can generate a personal artifact without naming another person.
- Gift mode is an invitation, not generation for someone else.
- Artifact displays cipher.
- Same cipher always returns same Legend fragment.
- Payment language is Gumroad-safe.
- No real currency imitation.
- No false claim of government/legal authority.
- Privacy text matches actual storage behavior.

## 16. Product Summary

Ci Moment V2 is a low-friction, high-symbolic-value personal artifact system.

It converts a small payment and a personal moment into a durable visual pass, then maps that pass to a deterministic Legend ci fragment.

The value is not prediction. The value is closure, memory, shareable status, and a beautiful object that feels worth keeping.

Gift mode extends the system by letting someone else create their own personal moment through an access pass.
