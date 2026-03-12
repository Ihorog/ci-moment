import { createHash } from 'crypto';

export function generateSymbols(minute: string, context: string, signal: string, decisionState?: string, signalType?: string): string {
    const canonicalSeed = `${minute}:${context}:${signal}:${decisionState || ''}:${signalType || ''}`;
    const hash = createHash('sha256').update(canonicalSeed).digest('hex');
    return `${hash.substring(0, 4)}${hash.substring(4, 8)}`;
}

export function renderSeal(): string {
    // SVG seal rendering logic with radial layout
    return `<svg><!-- SVG content here --></svg>`;
}