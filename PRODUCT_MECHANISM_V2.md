# Ci Moment V2 — Complete Product Mechanism

Status: Product Mechanism / US Market / English-first
Branch: `next/from-working-mvp`

## 0. Core correction

Ci Moment does not sell an artifact as a picture.

Ci Moment sells a short personal relief procedure:

```text
burden -> guided choices -> externalized decision -> sealed answer -> personal artifact -> private constitution fragment
```

The artifact is the visible proof of the procedure. The value is the user’s relief: the decision is no longer carried alone.

## 1. Product promise

Primary US-facing promise:

```text
Stop carrying the decision alone.
Hand it to the Moment.
Get a fixed answer you can keep.
```

Alternative short lines:

```text
Let the Moment carry it.
Settle it in four moves.
Turn the loop into a record.
Get the answer. Keep the sign.
```

The interface must communicate this from the first touch. The user must not infer it.

## 2. What the user buys

The user does not buy:

- advice
- prediction
- therapy
- a JPEG
- a horoscope
- a legal document
- a copy of money

The user buys:

```text
Personal Moment Pass — a guided symbolic procedure that converts a recurring burden into a fixed personal answer and a durable artifact.
```

Price anchor:

```text
For the cost of a coffee or a transit ride, claim a record that feels worth $100.
```

Use the $100 metaphor as perceived value, not as a claim of cash value.

## 3. Psychological mechanism

The product uses a familiar American relief pattern:

```text
I do not want to keep carrying this.
I want to hand it to a system.
I want a clean answer.
I want a sign that lets me stop looping.
```

Common US-market emotional hooks:

- decision fatigue
- mental load
- overthinking
- I need closure
- I need permission to stop thinking about it tonight
- I need to take one thing off my plate
- I want this handled
- I need a sign
- I need a clean next move

Primary emotional conversion:

```text
from: “I still have to decide”
to:   “The moment is sealed. I can move.”
```

## 4. Four-step user flow

### Step 1 — Name the burden

User does not start by making an artifact.
User starts by choosing the type of pressure they want to hand off.

Ready-made options:

```text
I keep overthinking the same decision.
I need permission to stop carrying this tonight.
I want a clean sign before I move.
I need to take this off my plate.
I am done spinning in circles.
I want the system to settle it for me.
```

Input:

- optional alias / name
- ready-made burden option
- optional short context field

### Step 2 — Choose the release route

System offers ready-made routes. User chooses one.

Options:

```text
Close the loop.
Give me permission to move.
Take the weight off me.
Mark this as enough for now.
Turn this into a clean record.
```

This is where responsibility is symbolically externalized.

### Step 3 — Choose the authority field

System offers a symbolic external field. User chooses where the burden is handed.

Options:

```text
The Archive
The Ledger
The Seal
The Transit Office
The Moment Authority
The Quiet Court
```

The wording should feel institutional but fictional. Do not imitate a real government, court, bank, or legal authority.

### Step 4 — Secure the pass

This is the value action, not a visible “payment” event.

Button language:

```text
Secure the Pass — $5
Claim the Record — $5
Seal the Moment — $5
Release the Weight — $5
```

Support copy:

```text
About the cost of coffee. Designed to feel worth keeping.
```

Do not say:

- Pay now
- Buy artifact
- Donate
- Purchase advice

## 5. Post-action reveal

After the value action, the user enters a reveal sequence.

Sequence:

```text
1. sealed envelope appears
2. wax seal cracks
3. envelope opens
4. banknote-like pass slides out
5. serial/cipher locks in
6. Legend ci fragment becomes available
```

The reveal is the emotional payoff.

The artifact should feel like a fictional high-value institutional note, not a payment receipt.

## 6. Artifact design mechanism

The artifact is inspired by the structure of a $100 bill but must not copy it.

Allowed design influences:

- horizontal banknote format
- guilloche-style borders
- engraved-line texture
- serial number zones
- official-looking fictional stamps
- pale green / parchment / dark ink atmosphere
- central medallion
- high-value note feeling

Forbidden design choices:

- copying real US currency layout
- using real Treasury/Federal Reserve seals
- using real US currency portraits
- using “United States”, “Federal Reserve”, “legal tender”, or real denomination claims
- making the artifact usable as fake money

Safe value language:

```text
100% RELIEF
100% AGENCY
ONE MOMENT SETTLED
PRIVATE RECORD
LEGEND CI SERIES
```

Do not print “$100” as money value. If the visual echoes $100, the semantic value should be symbolic.

## 7. Cipher mechanism

Each artifact contains a unique cipher.

Format:

```text
EL-[0..3]:CL-[0..8]:LG-[0..23]:SERIAL
```

Meaning:

- EL: base state / burden state
- CL: environment / authority field
- LG: release vector / action code
- SERIAL: deterministic artifact signature

The cipher is the bearer key. Whoever has the cipher can return to the same Legend ci fragment.

## 8. Legend ci Constitution Fragment

The cipher opens a personal constitution fragment.

This fragment is not a public article and not a downloadable file. It is a private in-service reading surface.

Concept:

```text
The artifact is the key.
The Constitution Fragment is the explanation of the key.
```

The fragment should feel like a small personal article of a fictional constitution:

- stable
- formal
- solemn
- clear
- personally addressed without being legally binding
- generated from deterministic atlas logic

Example framing:

```text
Personal Article EL-2 / CL-6 / LG-14
This moment is recognized as a burden released into structure. The holder is permitted to stop carrying the loop and proceed with the next available action.
```

Important: It must be presented as symbolic and fictional, not as real legal authority.

## 9. Constitution access rules

The Constitution Fragment is accessed only inside the service.

Rules:

- `/verify` accepts cipher input
- same cipher always reconstructs the same fragment
- no account required
- no download button for the fragment
- no copy button for the fragment
- fragment can be visually protected but cannot be perfectly screenshot-proof in a browser

Technical honesty:

A website cannot fully prevent screenshots on all user devices. It can only discourage copying.

Recommended deterrents:

- no download action
- no copy action
- overlay watermark
- CSS user-select: none
- blur fragment until interaction
- personalized moving watermark
- split text into rendered spans/canvas later

Do not claim impossible protection.

## 10. Main interface copy — US English

Hero:

```text
Stop carrying the same decision.
```

Subhero:

```text
Hand one unresolved moment to the system. In four moves, receive a sealed answer and a private record you can keep.
```

Step labels:

```text
1. Name the weight
2. Choose the release
3. Hand it to the field
4. Seal the answer
```

Value line:

```text
Costs about a coffee. Feels like a record worth keeping.
```

Safety line:

```text
Symbolic decision support. Not medical, legal, financial, or psychological advice.
```

## 11. Three-click choice matrix

### Click 1 — burden

```text
Overthinking
Pressure
Waiting
Relationship tension
Career hesitation
Tonight’s decision
Something I cannot drop
```

### Click 2 — release

```text
Close it
Move forward
Pause without guilt
Let it go tonight
Make it official
Take it off my plate
```

### Click 3 — external field

```text
Archive
Ledger
Seal
Transit Office
Moment Authority
Quiet Court
```

The final context seed is formed from the three choices plus optional alias.

```text
alias + burden + release + field + generationSeed
```

## 12. Gift Access mechanism

Gift Access is not “I generate a decision for another person.”

Correct model:

```text
I give someone access to create their own moment.
```

Gift flow:

```text
sender secures Gift Access Pass
recipient receives sealed access link
recipient opens it
recipient makes their own 3-click choices
recipient gets their own artifact
```

Gift copy:

```text
Send someone a clean starting point.
Give them a pass to settle one moment for themselves.
```

## 13. Data model strategy

Main personal flow should work without account creation.

Zero/minimal data preference:

- store no user profile
- store no history of personal decisions unless required for open-link flow
- let cipher reconstruct Legend fragment deterministically

If persistence is required for gift/open links, store access state, not personal history.

## 14. Implementation phases

### Phase 1 — Mechanism UI

Implement `/v2` as the four-step guided relief flow:

1. burden choice
2. release choice
3. field choice
4. secure/reveal action placeholder

Generate artifact after these choices.

### Phase 2 — Artifact reveal

Add envelope, cracked wax seal, and pass reveal.

### Phase 3 — Constitution Fragment

Create protected `/constitution/[cipher]` or extend `/verify` with protected fragment view.

### Phase 4 — Gumroad action

Integrate Gumroad as the fourth value action.

### Phase 5 — Gift Access

Add gift product and recipient flow.

## 15. Success condition

A new user must understand within the first screen:

```text
This is for the decision I am tired of carrying.
This gives me a way to hand it off.
I will get a fixed answer and a record.
It costs about coffee.
The artifact is the proof.
The cipher opens my private Legend ci article later.
```

If the user only understands “I can type my name and generate an artifact,” the product has failed.
