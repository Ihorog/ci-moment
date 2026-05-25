import { LEGEND_ATLAS } from './legend-atlas';

export type ArtifactMode = 'personal' | 'gift-invite';

export type ArtifactCipher = {
  element: number;
  celestial: number;
  logic: number;
  serial: string;
  code: string;
};

export type ArtifactData = {
  mode: ArtifactMode;
  subjectName: string;
  context: string;
  issuedBy: string;
  note?: string;
  cipher: ArtifactCipher;
  legend: {
    element: string;
    celestial: string;
    logic: string;
    full: string;
  };
};

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * cyrb53 string hash. Deterministic, fast, browser-safe, and sufficient for
 * visual cipher indexing. This is not cryptographic authentication.
 */
export function hashToNumber(input: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function generateArtifactCipher(
  subjectName: string,
  context = 'personal moment',
  seed = 'ci-moment-v2'
): ArtifactCipher {
  const base = `${normalize(subjectName)}:${normalize(context)}:${normalize(seed)}`;
  const hash = hashToNumber(base);

  const element = hash % LEGEND_ATLAS.elements.length;
  const celestial = Math.floor(hash / 7) % LEGEND_ATLAS.celestial.length;
  const logic = Math.floor(hash / 97) % LEGEND_ATLAS.logic.length;
  const serial = hash.toString(16).toUpperCase().padStart(12, '0').slice(-12);
  const code = `EL-${element}:CL-${celestial}:LG-${logic}:${serial}`;

  return { element, celestial, logic, serial, code };
}

export function getLegendByCipher(cipher: Pick<ArtifactCipher, 'element' | 'celestial' | 'logic'>) {
  const element = LEGEND_ATLAS.elements[cipher.element];
  const celestial = LEGEND_ATLAS.celestial[cipher.celestial];
  const logic = LEGEND_ATLAS.logic[cipher.logic];

  if (!element || !celestial || !logic) {
    throw new Error('Invalid Legend ci cipher coordinates');
  }

  return {
    element: element.text,
    celestial: celestial.text,
    logic: logic.text,
    full: `${element.text}\n\n${celestial.text}\n\n${logic.text}`,
  };
}

export function parseCipherCode(code: string): ArtifactCipher | null {
  const match = code.trim().toUpperCase().match(/^EL-(\d+):CL-(\d+):LG-(\d+):([A-F0-9]{1,16})$/);
  if (!match) return null;

  const element = Number(match[1]);
  const celestial = Number(match[2]);
  const logic = Number(match[3]);
  const serial = match[4];

  if (
    !Number.isInteger(element) ||
    !Number.isInteger(celestial) ||
    !Number.isInteger(logic) ||
    element < 0 ||
    element >= LEGEND_ATLAS.elements.length ||
    celestial < 0 ||
    celestial >= LEGEND_ATLAS.celestial.length ||
    logic < 0 ||
    logic >= LEGEND_ATLAS.logic.length
  ) {
    return null;
  }

  return { element, celestial, logic, serial, code: `EL-${element}:CL-${celestial}:LG-${logic}:${serial}` };
}

export function getPersonalArtifactData(
  subjectName: string,
  context = 'personal moment'
): ArtifactData {
  const cipher = generateArtifactCipher(subjectName, context, 'personal');
  const legend = getLegendByCipher(cipher);

  return {
    mode: 'personal',
    subjectName: subjectName.trim(),
    context: context.trim(),
    issuedBy: 'Self-claimed moment',
    cipher,
    legend,
  };
}

export function getGiftInvitationData(
  purchaserName: string,
  note = 'gift pass'
): ArtifactData {
  const cipher = generateArtifactCipher(purchaserName, note, 'gift-invite');
  const legend = getLegendByCipher(cipher);

  return {
    mode: 'gift-invite',
    subjectName: 'Recipient creates their own moment',
    context: note.trim(),
    issuedBy: purchaserName.trim() || 'Gift sender',
    note: 'Gift mode is an invitation to a new personal generation, not a generated decision for another person.',
    cipher,
    legend,
  };
}

/**
 * Backward-compatible helper kept for earlier prototypes.
 * Prefer getPersonalArtifactData for the main V2 product.
 */
export function getArtifactData(
  senderName: string,
  receiverName: string,
  context = 'moment'
): ArtifactData {
  const subject = receiverName?.trim() || senderName;
  const issuedBy = senderName?.trim() || 'Self-claimed moment';
  const cipher = generateArtifactCipher(subject, context, issuedBy);
  const legend = getLegendByCipher(cipher);

  return {
    mode: 'personal',
    subjectName: subject.trim(),
    context: context.trim(),
    issuedBy,
    cipher,
    legend,
  };
}
