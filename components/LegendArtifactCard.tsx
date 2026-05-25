import type { ArtifactData } from '@/lib/legend-engine';

interface LegendArtifactCardProps {
  artifact: ArtifactData;
}

export default function LegendArtifactCard({ artifact }: LegendArtifactCardProps) {
  const { cipher } = artifact;

  return (
    <section
      aria-label="Legend ci artifact"
      style={{
        width: 'min(92vw, 760px)',
        aspectRatio: '3 / 2',
        background: '#f4f1ea',
        color: '#171717',
        border: '1px solid #2b2b2b',
        boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(1rem, 3vw, 2rem)',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 14,
          border: '3px double rgba(23,23,23,0.72)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 28,
          border: '1px dashed rgba(23,23,23,0.35)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 1px, transparent 16px)',
          mixBlendMode: 'multiply',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              Legend ci Administration
            </div>
            <h1 style={{ margin: '0.35rem 0 0', fontSize: 'clamp(1.35rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '0.08em' }}>
              OFFICIAL PASS
            </h1>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.72rem', lineHeight: 1.55 }}>
            <div>SERIES: CI-M2</div>
            <div>NO. {cipher.serial}</div>
            <div>VALUE: ONE COFFEE</div>
          </div>
        </header>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.72 }}>
              Issued to
            </div>
            <div style={{ marginTop: '0.35rem', fontSize: 'clamp(1.25rem, 4vw, 2.25rem)', borderBottom: '1px solid #171717', paddingBottom: '0.35rem' }}>
              {artifact.subjectName || 'Unnamed Receiver'}
            </div>

            <div style={{ marginTop: '1.35rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.72 }}>
              Authorized by
            </div>
            <div style={{ marginTop: '0.35rem', fontSize: 'clamp(1rem, 3vw, 1.55rem)' }}>
              {artifact.senderName || 'Unnamed Sender'}
            </div>
          </div>

          <div
            aria-label="Cipher coordinates"
            style={{
              width: 'clamp(120px, 24vw, 180px)',
              height: 'clamp(120px, 24vw, 180px)',
              border: '2px solid #171717',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.28)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>CIPHER</div>
              <div style={{ marginTop: '0.7rem', fontSize: '1rem', lineHeight: 1.45 }}>
                EL-{cipher.element}<br />CL-{cipher.celestial}<br />LG-{cipher.logic}
              </div>
            </div>
          </div>
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-end', fontSize: '0.7rem' }}>
          <div style={{ maxWidth: '70%', lineHeight: 1.45 }}>
            {artifact.legend.logic}
          </div>
          <div style={{ textAlign: 'right', letterSpacing: '0.08em' }}>
            {cipher.code}
          </div>
        </footer>
      </div>
    </section>
  );
}
