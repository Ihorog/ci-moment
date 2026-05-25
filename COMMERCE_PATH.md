# Commerce Path — Carrd + Gumroad + Payoneer

Status: CI-MODEL / starter market path
Branch: `next/from-working-mvp`

## Purpose

This document defines the external commercial route for Ci Moment V2 before full in-app checkout automation.

The application remains the artifact engine. The commerce stack only handles traffic, checkout, delivery, and payout.

## Canonical route

```text
Instagram / TikTok / X / organic traffic
  -> Carrd landing
  -> Gumroad checkout
  -> ci-moment artifact engine
  -> Payoneer payout bridge
  -> local card / bank payout
```

## Roles

| Service | Role |
|---|---|
| Carrd | Landing page and traffic router |
| Gumroad | Checkout, digital product delivery, payment processing |
| Payoneer | Payout bridge from marketplace revenue |
| ci-moment | Artifact generation, cipher, verification, Legend ci fragment |
| Vercel | Runtime for `/v2`, `/verify`, later `/open/[saleId]` |

## Product offers

### Personal Moment Pass — $5

Main product.

```text
one person -> personal moment -> artifact -> cipher -> Legend ci fragment
```

### Gift Access Pass — $5

Secondary product.

```text
sender buys access -> recipient receives link/key -> recipient creates their own personal moment
```

Gift Access must not be presented as generating another person’s decision.

## Carrd landing structure

1. Hero:

```text
Claim your Ci Moment.
A personal artifact for the moment you need to settle.
```

2. Value:

```text
One coffee. One artifact. One moment you can keep.
```

3. Buttons:

```text
Claim Personal Moment — $5
Send Gift Access — $5
Verify Artifact
```

4. Privacy note:

```text
No account. No password. The cipher is your key.
```

5. Safety note:

```text
Ci Moment is a symbolic digital artifact. It is not medical, legal, financial, or psychological advice.
```

## Gumroad setup

Create two products:

1. `Personal Moment Pass`
2. `Gift Access Pass`

Each product price:

```text
$5
```

Delivery should point the buyer to the proper app route:

```text
Personal Moment -> https://<domain>/v2
Gift Access -> https://<domain>/v2?mode=gift
```

Later, when webhook/open flow is ready, replace delivery with:

```text
/open/[saleId]
```

## Current implementation rule

Do not add webhook persistence until the visual artifact, cipher, and verify flow are stable.

Current safe path:

```text
Carrd -> Gumroad -> /v2 -> /verify
```

Future path:

```text
Carrd -> Gumroad -> webhook -> /open/[saleId] -> /verify
```

## Compliance boundary

Use safe phrasing:

- digital artifact
- personal pass
- gift access
- checkout handled by Gumroad
- payout through Payoneer

Avoid:

- tax avoidance
- invisible transaction
- legal loophole
- official government document
- prediction or advice claims

## Acceptance checks

- Carrd page links to Gumroad products.
- Gumroad products link back to ci-moment routes.
- `/v2` supports Personal Moment as primary mode.
- `/v2` supports Gift Access as secondary mode.
- `/verify` reconstructs Legend fragment from cipher.
- No auth required.
- No profile required.
- Payment language is Gumroad-safe.
