/**
 * Adds support for deterministic mapping of `senderName` and `receiverName`
 * onto indexes in `LEGEND_ATLAS`.
 */
import { LEGEND_ATLAS } from './legend-atlas';
import { createHash } from 'crypto';

/** Enhanced function: Deterministic name hashing */
export function hashNameToIndex(name: string, type: 'elements' | 'celestial' | 'logic'): number {
  const hash = createHash('sha256').update(name).digest('hex');
  const bounds = LEGEND_ATLAS[type].length;
  // Deterministic mapping to array length
  return parseInt(hash.slice(0, 5), 16) % bounds;
}

/**
 * Resolves sender-receiver mapped indexes into LEGEND_ATLAS.
 */
export function resolveAtlasBindings(senderName: string, receiverName: string) {
  const senderElementIndex = hashNameToIndex(senderName, 'elements');
  const receiverLogicIndex = hashNameToIndex(receiverName, 'logic');
  const decisionCelestial = LEGEND_ATLAS.celestial[senderElementIndex % LEGEND_ATLAS.celestial.length];

  return {
    senderElement: LEGEND_ATLAS.elements[senderElementIndex],
    receiverLogic: LEGEND_ATLAS.logic[receiverLogicIndex],
    celestialDecision: decisionCelestial,
  };
}