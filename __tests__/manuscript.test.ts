import {
  OUTER_SYMBOLS,
  INNER_SYMBOLS,
  generateManuscript,
  renderSeal,
  renderText,
  formatArtifactId,
  generateSymbols,
} from '@/lib/manuscript';

describe('OUTER_SYMBOLS', () => {
  it('contains exactly 7 symbols', () => {
    expect(OUTER_SYMBOLS).toHaveLength(7);
  });

  it('includes all required outer symbols', () => {
    expect(OUTER_SYMBOLS).toContain('∧');
    expect(OUTER_SYMBOLS).toContain('∨');
    expect(OUTER_SYMBOLS).toContain('~');
    expect(OUTER_SYMBOLS).toContain('Y');
    expect(OUTER_SYMBOLS).toContain('×');
    expect(OUTER_SYMBOLS).toContain('—');
    expect(OUTER_SYMBOLS).toContain('|');
  });
});

describe('INNER_SYMBOLS', () => {
  it('contains exactly 7 symbols', () => {
    expect(INNER_SYMBOLS).toHaveLength(7);
  });

  it('includes all required inner symbols', () => {
    expect(INNER_SYMBOLS).toContain('○');
    expect(INNER_SYMBOLS).toContain('•');
    expect(INNER_SYMBOLS).toContain('↺');
    expect(INNER_SYMBOLS).toContain('Y');
    expect(INNER_SYMBOLS).toContain('×');
    expect(INNER_SYMBOLS).toContain('∧');
    expect(INNER_SYMBOLS).toContain('∨');
  });
});

describe('generateManuscript', () => {
  const MINUTE = 28463841;
  const CONTEXT = 'career';
  const SIGNAL = 'PROCEED';

  it('returns a manuscript with 4 outer and 4 inner symbols', () => {
    const m = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    expect(m.outer).toHaveLength(4);
    expect(m.inner).toHaveLength(4);
  });

  it('outer symbols are from OUTER_SYMBOLS', () => {
    const m = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    for (const sym of m.outer) {
      expect(OUTER_SYMBOLS).toContain(sym);
    }
  });

  it('inner symbols are from INNER_SYMBOLS', () => {
    const m = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    for (const sym of m.inner) {
      expect(INNER_SYMBOLS).toContain(sym);
    }
  });

  it('compact string is 8 characters total (4 outer + 4 inner)', () => {
    const m = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    // Count Unicode code points (each symbol is one code point)
    const codePoints = [...m.compact];
    expect(codePoints).toHaveLength(8);
  });

  it('text has two lines separated by a newline', () => {
    const m = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    const lines = m.text.split('\n');
    expect(lines).toHaveLength(2);
  });

  it('is deterministic for identical inputs', () => {
    const m1 = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    const m2 = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    expect(m1.compact).toBe(m2.compact);
    expect(m1.outer).toEqual(m2.outer);
    expect(m1.inner).toEqual(m2.inner);
  });

  it('produces different manuscripts for different signals', () => {
    const m1 = generateManuscript(MINUTE, CONTEXT, 'PROCEED');
    const m2 = generateManuscript(MINUTE, CONTEXT, 'HOLD');
    // They could theoretically collide but SHA-256 makes this astronomically unlikely
    expect(m1.compact).not.toBe(m2.compact);
  });

  it('produces different manuscripts for different contexts', () => {
    const m1 = generateManuscript(MINUTE, 'career', SIGNAL);
    const m2 = generateManuscript(MINUTE, 'love', SIGNAL);
    expect(m1.compact).not.toBe(m2.compact);
  });

  it('produces different manuscripts for different minutes', () => {
    const m1 = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    const m2 = generateManuscript(MINUTE + 1, CONTEXT, SIGNAL);
    expect(m1.compact).not.toBe(m2.compact);
  });

  it('accepts minute as a string', () => {
    const m1 = generateManuscript(MINUTE, CONTEXT, SIGNAL);
    const m2 = generateManuscript(String(MINUTE), CONTEXT, SIGNAL);
    expect(m1.compact).toBe(m2.compact);
  });
});

describe('renderSeal', () => {
  it('returns a valid SVG string', () => {
    const m = generateManuscript(28463841, 'career', 'PROCEED');
    const svg = renderSeal(m);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('embeds all 4 outer symbols in the SVG', () => {
    const m = generateManuscript(28463841, 'love', 'HOLD');
    const svg = renderSeal(m);
    for (const sym of m.outer) {
      expect(svg).toContain(sym);
    }
  });

  it('embeds all 4 inner symbols in the SVG', () => {
    const m = generateManuscript(28463841, 'timing', 'NOT NOW');
    const svg = renderSeal(m);
    for (const sym of m.inner) {
      expect(svg).toContain(sym);
    }
  });

  it('always includes the center ○ glyph', () => {
    const m = generateManuscript(28463841, 'career', 'PROCEED');
    const svg = renderSeal(m);
    expect(svg).toContain('○');
  });
});

describe('renderText', () => {
  it('returns a 5-line radial diagram', () => {
    const m = generateManuscript(28463841, 'career', 'PROCEED');
    const text = renderText(m);
    const lines = text.split('\n');
    expect(lines).toHaveLength(5);
  });

  it('contains all outer symbols', () => {
    const m = generateManuscript(28463841, 'career', 'PROCEED');
    const text = renderText(m);
    for (const sym of m.outer) {
      expect(text).toContain(sym);
    }
  });

  it('contains all inner symbols', () => {
    const m = generateManuscript(28463841, 'love', 'HOLD');
    const text = renderText(m);
    for (const sym of m.inner) {
      expect(text).toContain(sym);
    }
  });

  it('contains the center ○', () => {
    const m = generateManuscript(28463841, 'timing', 'NOT NOW');
    const text = renderText(m);
    expect(text).toContain('○');
  });
});

describe('formatArtifactId', () => {
  it('formats a Date correctly', () => {
    const date = new Date('2026-03-12T22:17:00.000Z');
    const id = formatArtifactId(date, 'PROCEED');
    expect(id).toBe('CIM-2026-03-12-2217-PROCEED');
  });

  it('formats an ISO string correctly', () => {
    const id = formatArtifactId('2026-03-12T22:17:00.000Z', 'HOLD');
    expect(id).toBe('CIM-2026-03-12-2217-HOLD');
  });

  it('includes the signal in the id', () => {
    const id = formatArtifactId('2026-03-12T22:17:00.000Z', 'NOT NOW');
    expect(id).toContain('NOT-NOW');
  });
});

describe('generateSymbols (backward-compat alias)', () => {
  it('returns the same compact string as generateManuscript', () => {
    const compact = generateSymbols('28463841', 'career', 'PROCEED');
    const m = generateManuscript('28463841', 'career', 'PROCEED');
    expect(compact).toBe(m.compact);
  });

  it('returns exactly 8 Unicode code points', () => {
    const compact = generateSymbols('28463841', 'love', 'HOLD');
    expect([...compact]).toHaveLength(8);
  });
});
