# Phase 1 Test — Legend ci Artifact Prototype

Branch:

```text
next/from-working-mvp
```

## Local sync

```powershell
cd C:\Projects\ci-moment
git fetch origin
git switch next/from-working-mvp
git pull
```

## Install and check

```powershell
npm install
npm run type-check
npm run build
```

## Test pages

Start dev server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000/v2
http://localhost:3000/verify
```

## Expected result

### /v2

- Shows Legend ci artifact prototype.
- User enters sender, receiver, context.
- Page generates a banknote/pass-like artifact card.
- Page displays deterministic cipher.
- Page displays Legend ci fragment.

### /verify

- User enters cipher from artifact.
- Page reconstructs same Legend ci fragment from cipher coordinates.

## Phase 1 boundaries

This phase does not modify the old MVP route `/`.

No Gumroad webhook yet.
No database rewrite yet.
No authentication.
No production payment claim.

The goal is to validate:

- deterministic cipher
- visual artifact direction
- stable Legend ci decoder
- build safety before payment integration
