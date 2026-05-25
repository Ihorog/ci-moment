import { createHash } from 'crypto';

/**
 * Outer block symbols — represent external environment and forces.
 */
export const OUTER_SYMBOLS = ['∧', '∨', '~', 'Y', '×', '—', '|'] as const;

/**
 * Inner block symbols — represent internal state and core dynamics.
 */
export const INNER_SYMBOLS = ['○', '•', '↺', 'Y', '×', '∧', '∨'] as const;

export type OuterSymbol = (typeof OUTER_SYMBOLS)[number];
export type InnerSymbol = (typeof INNER_SYMBOLS)[number];

/**
 * A manuscript contains 8 symbols: 4 outer (environment/forces) and
 * 4 inner (core dynamics), deterministically derived from the inputs.
 */
export interface Manuscript {
  outer: [OuterSymbol, OuterSymbol, OuterSymbol, OuterSymbol];
  inner: [InnerSymbol, InnerSymbol, InnerSymbol, InnerSymbol];
  /** Compact string representation: "∧×Y~∨○Y↺" */
  compact: string;
  /** Formatted two-row text: "∧ × Y ~\n∨ ○ Y ↺" */
  text: string;
}

/**
 * Generate a deterministic 8-symbol manuscript from the given inputs.
 *
 * The SHA-256 hash of `${minute}:${context}:${signal}` seeds symbol
 * selection so that identical inputs always produce identical manuscripts.
 *
 * @param minute  The minute seed (integer; use Math.floor(Date.now()/60000)).
 * @param context The context category ("career" | "love" | "timing").
 * @param signal  The decision signal ("PROCEED" | "HOLD" | "NOT NOW").
 * @returns A fully populated Manuscript.
 */
export function generateManuscript(minute: string | number, context: string, signal: string): Manuscript {
  const seed = `${minute}:${context}:${signal}`;
  const hash = createHash('sha256').update(seed).digest();

  // Pick 4 outer symbols using bytes 0-3, then 4 inner symbols using bytes 4-7.
  const outer = [
    OUTER_SYMBOLS[hash[0] % OUTER_SYMBOLS.length],
    OUTER_SYMBOLS[hash[1] % OUTER_SYMBOLS.length],
    OUTER_SYMBOLS[hash[2] % OUTER_SYMBOLS.length],
    OUTER_SYMBOLS[hash[3] % OUTER_SYMBOLS.length],
  ] as [OuterSymbol, OuterSymbol, OuterSymbol, OuterSymbol];

  const inner = [
    INNER_SYMBOLS[hash[4] % INNER_SYMBOLS.length],
    INNER_SYMBOLS[hash[5] % INNER_SYMBOLS.length],
    INNER_SYMBOLS[hash[6] % INNER_SYMBOLS.length],
    INNER_SYMBOLS[hash[7] % INNER_SYMBOLS.length],
  ] as [InnerSymbol, InnerSymbol, InnerSymbol, InnerSymbol];

  const compact = [...outer, ...inner].join('');
  const text = `${outer.join(' ')}\n${inner.join(' ')}`;

  return { outer, inner, compact, text };
}

/**
 * Render a manuscript as an SVG seal using a radial layout.
 *
 * Layout (9-position diamond):
 *       S1 (outer[0])
 *    S2    S3           (outer[1], outer[2])
 * S4   ○   S5           (outer[3], inner[0], inner[1])  ← center ○ always shown
 *    S6    S7           (inner[2], inner[3])
 *       S8              (inner placeholder '•')
 *
 * @param manuscript The manuscript to render.
 * @returns SVG string.
 */
export function renderSeal(manuscript: Manuscript): string {
  const [o1, o2, o3, o4] = manuscript.outer;
  const [i1, i2, i3, i4] = manuscript.inner;

  const cx = 100;
  const cy = 100;
  const r = 60;

  // Positions: top, mid-left, mid-right, center-left, center, center-right, lower-mid-left, lower-mid-right, bottom
  const positions = [
    { x: cx,          y: cy - r,        symbol: o1 },  // top
    { x: cx - r * 0.7, y: cy - r * 0.4, symbol: o2 },  // upper-left
    { x: cx + r * 0.7, y: cy - r * 0.4, symbol: o3 },  // upper-right
    { x: cx - r,      y: cy,            symbol: o4 },  // left
    { x: cx,          y: cy,            symbol: '○' }, // center
    { x: cx + r,      y: cy,            symbol: i1 },  // right
    { x: cx - r * 0.7, y: cy + r * 0.4, symbol: i2 },  // lower-left
    { x: cx + r * 0.7, y: cy + r * 0.4, symbol: i3 },  // lower-right
    { x: cx,          y: cy + r,        symbol: i4 },  // bottom
  ];

  const glyphs = positions
    .map(
      ({ x, y, symbol }) =>
        `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="18" font-family="serif" fill="#1a1a1a">${symbol}</text>`
    )
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="${cx}" cy="${cy}" r="${r + 20}" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="4" fill="#1a1a1a"/>
  ${glyphs}
</svg>`;
}

/**
 * Render a manuscript as a plain-text radial diagram.
 *
 * @param manuscript The manuscript to render.
 * @returns Multi-line ASCII art string.
 */
export function renderText(manuscript: Manuscript): string {
  const [o1, o2, o3, o4] = manuscript.outer;
  const [i1, i2, i3, i4] = manuscript.inner;
  return [
    `      ${o1}`,
    `   ${o2}    ${o3}`,
    `${o4}    ○    ${i1}`,
    `   ${i2}    ${i3}`,
    `      ${i4}`,
  ].join('\n');
}

/**
 * Format a stable artifact ID string from a timestamp and signal.
 *
 * @param timestamp ISO timestamp or Date.
 * @param signal    Decision signal.
 * @returns e.g. "CIM-2026-03-12-2217"
 */
export function formatArtifactId(timestamp: string | Date, signal: string): string {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hhmm = String(d.getUTCHours()).padStart(2, '0') + String(d.getUTCMinutes()).padStart(2, '0');
  return `CIM-${year}-${month}-${day}-${hhmm}-${signal.replace(/\s+/g, '-')}`;
}

/**
 * @deprecated Use generateManuscript() instead. Kept for backward compatibility.
 */
export function generateSymbols(minute: string, context: string, signal: string): string {
  return generateManuscript(minute, context, signal).compact;
}