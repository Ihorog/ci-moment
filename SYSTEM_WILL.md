# SYSTEM_WILL.md — Ci Moment Organism Memory

> Invariants, evolution rules, and autonomous action contracts for the Ci Moment system.

## 1. Core Invariants

| # | Invariant | Enforcement |
|---|-----------|-------------|
| 1 | Every state-changing action appends an entry to `manifest.json` `oplog`. | `lib/manifest-io.ts` `appendOplogEntry` |
| 2 | `oplog` is append-only. No entry is ever deleted or modified. | Code convention; no delete path exists. |
| 3 | `manifest.json` always has `version`, `state`, `actions[]`, and `oplog[]`. | `lib/manifest.ts` `validateManifest` |
| 4 | At least `adsa.health_selfcheck` and `adsa.manifest_consistency` must be registered in `actions[]`. | `/api/actions/manifest` invariant check |
| 5 | Environment checks expose presence (boolean) only — secret values are never returned. | `/api/actions/health` implementation |

## 2. ADSA Model

**Autonomous Delegated System Actions (ADSAs)** are stateless Next.js route handlers that:

1. Read state (manifest, env).
2. Run checks / computations.
3. Emit an audit oplog entry.
4. Return a structured JSON response.

### Registering a new ADSA

1. Add the action descriptor to `manifest.json` → `actions[]`:

```json
{
  "id": "adsa.<name>",
  "intent": "One-line description of purpose",
  "triggers": { "manual": true },
  "policy": { "can_open_issue": false, "can_push_code": false },
  "steps": ["step1", "step2", "report"],
  "effects": ["audit_log"]
}
```

2. Create the route handler at `app/api/actions/<name>/route.ts`.
3. Use `buildOplogEntry` + `appendOplogEntry` from `lib/manifest.ts` / `lib/manifest-io.ts` for audit logging.
4. Add a Jest test in `__tests__/`.

### Response shape (convention)

```ts
{
  ok: boolean;          // overall health
  timestamp: string;    // ISO 8601
  checks: { ... };      // named check results
  audit: OplogEntry;    // the appended (or returned) oplog entry
}
```

## 3. Dormant Module Convention (`/abilities/*`)

Future capability modules live under `/abilities/<name>/` and follow this layout:

```
abilities/
  <name>/
    ability.json    # declarative descriptor (id, version, status: dormant|active)
    README.md       # capability documentation
    route.ts        # (optional) bridge to /api/abilities/<name>
```

An ability is **dormant** by default. Activation requires:
- `manifest.json` → `state.abilities_enabled` to include the ability name.
- An entry in `actions[]` for any ADSAs it provides.

This ensures no dormant code runs in production without an explicit manifest update.

## 4. Environment Targets

| Target | Runtime | Persistence | Notes |
|--------|---------|-------------|-------|
| Vercel (primary) | Serverless Node.js | Read-only FS; oplog writes degrade silently | Use external KV for durable oplog in the future |
| Termux (local) | Node.js 20+ process | Writable FS | `npm run dev`; oplog persists to `manifest.json` |

## 5. Evolution Rules

1. **Smallest change wins.** Prefer extending `manifest.json` and adding a route handler over modifying existing modules.
2. **Invariants are non-negotiable.** CI must pass `validateManifest` on every commit that touches `manifest.json`.
3. **Oplog never shrinks.** Tools may read and aggregate the oplog but must never truncate it.
4. **Abilities are opt-in.** No ability is active unless explicitly listed in `state.abilities_enabled`.
5. **Secrets stay secret.** ADSAs check env presence only and return boolean results.

---

*Last updated: 2026-03-12 — Autonomy Baseline v0.1.0*
