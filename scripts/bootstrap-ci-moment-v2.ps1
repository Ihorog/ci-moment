<#
CI MOMENT / LEGEND CI — v2 repository bootstrap

Purpose:
Creates a clean new GitHub repository `Ihorog/ci-moment-v2` and pushes the initial v2 product structure.

Requirements:
- Windows PowerShell 5+ or PowerShell 7+
- git
- GitHub CLI: https://cli.github.com/
- authenticated GitHub CLI session: gh auth login

This script does not copy old MVP source code. It creates a clean v2 development surface.
#>

$ErrorActionPreference = "Stop"

$RepoOwner = "Ihorog"
$RepoName = "ci-moment-v2"
$RepoFull = "$RepoOwner/$RepoName"
$TempRoot = Join-Path $env:TEMP "ci-moment-v2-bootstrap"
$RepoDir = Join-Path $TempRoot $RepoName

function Require-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $Name"
  }
}

Require-Command git
Require-Command gh

Write-Host "Checking GitHub authentication..."
gh auth status | Out-Host

Write-Host "Checking whether repo exists: $RepoFull"
$repoExists = $true
try {
  gh repo view $RepoFull | Out-Null
} catch {
  $repoExists = $false
}

if ($repoExists) {
  throw "Repository already exists: $RepoFull. Stop to avoid overwriting."
}

if (Test-Path $RepoDir) {
  Remove-Item -Recurse -Force $RepoDir
}
New-Item -ItemType Directory -Force $RepoDir | Out-Null
Set-Location $RepoDir

Write-Host "Creating clean file structure..."
$dirs = @(
  "app",
  "components",
  "lib/engine",
  "lib/telemetry",
  "lib/artifacts",
  "lib/payments",
  "lib/consent",
  "db/migrations",
  "docs",
  "tests",
  ".github"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force $d | Out-Null }

@'
# Ci Moment v2

Status: `NEW DEVELOPMENT SURFACE`

Ci Moment v2 is a clean rebuild of the product direction.

Old repository `Ihorog/ci-moment` is historical reference only.

## Core formula

```text
Result → Seal → Artifact → Verify → Repeat → Referral
```

## Development truth

See:

- `docs/PRODUCT_SPEC.md`
- `docs/TELEMETRY_SPEC.md`
- `docs/GUMROAD_ATTRIBUTION_SPEC.md`
- `docs/TRUST_SURFACE_SPEC.md`
- `.github/copilot-instructions.md`

## Boundary

Not advice. Not prediction. Not therapy. Not financial, legal, medical, or life-critical guidance.
A personal moment signal and symbolic checkpoint.
'@ | Set-Content -Encoding UTF8 README.md

@'
# CI MOMENT / LEGEND CI — PRODUCT SPEC v2

Status: `NEW DEVELOPMENT TRUTH`

## 1. Source hierarchy

```text
1. Current strategy and economics research
2. Ci / Cimeika product canon
3. New Product Spec v2
4. Old GitHub repo state as historical reference only
```

## 2. Core product definition

Ci Moment is a ritualized digital signal system that helps a user pass from attention to a sealed personal checkpoint.

```text
Attention → Context → Threshold → Result → Seal → Artifact → Verify → Repeat → Referral / Membership
```

## 3. Commercial principle

Do not build the initial economy on cold paid acquisition for a low one-time seal fee.

The product must prioritize:

- telemetry;
- artifact value;
- verification;
- repeat visits;
- referral sharing;
- bundle / membership ladder;
- trust surface.

## 4. Operating formula

```text
Not traffic → sale.
Result → Seal → Artifact → Verify → Repeat → Referral.
```
'@ | Set-Content -Encoding UTF8 docs/PRODUCT_SPEC.md

@'
# TELEMETRY SPEC

## Required events

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

## Required fields

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

## CRSS

```text
CRSS = result_view_rate × seal_click_rate × repeat_rate_30d
```
'@ | Set-Content -Encoding UTF8 docs/TELEMETRY_SPEC.md

@'
# GUMROAD ATTRIBUTION SPEC

Checkout must not be a blind redirect.

Required handoff:

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
'@ | Set-Content -Encoding UTF8 docs/GUMROAD_ATTRIBUTION_SPEC.md

@'
# TRUST SURFACE SPEC

`cimeika.com.ua` must act as acquisition + trust + explanation + verification + privacy narrative.

Required pages:

1. What is Ci Moment?
2. How artifact sealing works.
3. Verify a moment.
4. Privacy and data minimization.
5. Not advice / not prediction / not therapy.
6. Pricing / memberships / bundles.
7. Contact / support.

Internal status screens must not be the public acquisition surface.
'@ | Set-Content -Encoding UTF8 docs/TRUST_SURFACE_SPEC.md

@'
# GitHub Copilot Instructions — Ci Moment v2

## Source of truth

This repository is the clean v2 development surface.
The old `Ihorog/ci-moment` repository is historical reference only.

## Must

- Treat artifact and verification as core product objects.
- Track source/session for every meaningful product action.
- Match Gumroad orders to artifacts before making economic claims.
- Keep consent explicit.
- Keep privacy language conservative.
- Add tests for telemetry, artifact, payment attribution, and verification logic.

## Must not

- Do not copy old MVP assumptions blindly.
- Do not implement cold paid growth before telemetry.
- Do not hardcode private credentials.
- Do not claim attribution works until tested.
- Do not position Ci Moment as advice, prediction, therapy, legal, medical, financial, or life-critical guidance.

## Core formula

```text
Result → Seal → Artifact → Verify → Repeat → Referral
```
'@ | Set-Content -Encoding UTF8 .github/copilot-instructions.md

@'
create table if not exists ci_sessions (
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

create table if not exists ci_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references ci_sessions(id),
  event_name text not null,
  context text,
  artifact_id uuid,
  order_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists ci_artifacts (
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

create table if not exists ci_orders (
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

create table if not exists ci_consents (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text,
  email_hash text,
  consent_type text not null,
  status text not null,
  source text,
  created_at timestamptz default now()
);

create table if not exists ci_memberships (
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
'@ | Set-Content -Encoding UTF8 db/migrations/0001_ci_moment_v2_schema.sql

@'
{
  "name": "ci-moment-v2",
  "version": "0.1.0",
  "private": true,
  "description": "Ci Moment v2 — telemetry-first artifact and verification product surface",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "test": "echo \"TODO: add tests\""
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
'@ | Set-Content -Encoding UTF8 package.json

@'
export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section style={{ maxWidth: 720 }}>
        <p>Ci Moment v2</p>
        <h1>Result → Seal → Artifact → Verify → Repeat → Referral</h1>
        <p>New development surface. Old MVP repository is reference only.</p>
      </section>
    </main>
  );
}
'@ | Set-Content -Encoding UTF8 app/page.tsx

@'
export const metadata = {
  title: "Ci Moment v2",
  description: "A personal moment signal and symbolic checkpoint.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
'@ | Set-Content -Encoding UTF8 app/layout.tsx

@'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
'@ | Set-Content -Encoding UTF8 tsconfig.json

@'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
'@ | Set-Content -Encoding UTF8 next-env.d.ts

@'
node_modules
.next
.env
.env.local
.vercel
.DS_Store
'@ | Set-Content -Encoding UTF8 .gitignore

Write-Host "Initializing git..."
git init
git add .
git commit -m "Initial Ci Moment v2 product surface"

Write-Host "Creating GitHub repo: $RepoFull"
gh repo create $RepoFull --public --source . --remote origin --push --description "Ci Moment v2 — telemetry-first artifact and verification product surface"

Write-Host "Done: https://github.com/$RepoFull"
