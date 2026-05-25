/**
 * Decorative barcode built from the artifact code hex characters.
 * Not a scannable barcode — purely a visual identifier that reinforces the
 * "official document" aesthetic (driver's license, transit ticket, etc.).
 */

import { colors, spacing } from '@/lib/design-system';

interface ArtifactBarcodeProps {
  artifactCode: string;
  /** Height of the barcode container in pixels. Defaults to 20. */
  height?: number;
  /** Opacity of the barcode. Defaults to 0.35. */
  opacity?: number;
}

export default function ArtifactBarcode({
  artifactCode,
  height = 20,
  opacity = 0.35,
}: ArtifactBarcodeProps) {
  const hex = artifactCode.replace(/[^0-9a-f]/g, '');
  const bars = hex.split('').map((ch) => parseInt(ch, 16));

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1px',
        height: `${height}px`,
        marginTop: spacing.gapXSmall,
        opacity,
      }}
    >
      {bars.map((val, i) => (
        <div
          key={i}
          style={{
            width: val % 2 === 0 ? '1px' : '2px',
            height: `${40 + val * 4}%`,
            backgroundColor: colors.textQuinary,
            borderRadius: '0.5px',
          }}
        />
      ))}
    </div>
  );
}
