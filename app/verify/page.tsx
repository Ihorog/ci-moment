"use client";

import { FormEvent, useMemo, useState } from 'react';
import { getLegendByCipher, parseCipherCode } from '@/lib/legend-engine';

export default function VerifyPage() {
  const [cipherCode, setCipherCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const parsed = useMemo(() => parseCipherCode(cipherCode), [cipherCode]);
  const legend = useMemo(() => {
    if (!submitted || !parsed) return null;
    return getLegendByCipher(parsed);
  }, [submitted, parsed]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#08090b',
        color: '#e8e0d0',
        fontFamily: "'Courier New', Courier, monospace",
        display: 'grid',
        placeItems: 'center',
        padding: '2rem 1rem',
      }}
    >
      <section style={{ width: 'min(720px, 100%)', display: 'grid', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.34em', color: '#777', textTransform: 'uppercase' }}>
            Legend ci archive terminal
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 7vw, 4rem)', lineHeight: 1 }}>
            Verify Artifact
          </h1>
          <p style={{ margin: 0, color: '#a8a096', lineHeight: 1.6 }}>
            Enter the cipher printed on the artifact. The same coordinates always reconstruct the same Legend ci fragment.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.85rem' }}>
          <input
            value={cipherCode}
            onChange={(event) => {
              setCipherCode(event.target.value);
              setSubmitted(false);
            }}
            placeholder="EL-0:CL-0:LG-0:ABC123"
            style={{
              minHeight: 52,
              border: '1px solid #333',
              background: '#111',
              color: '#f4f1ea',
              padding: '0 0.85rem',
              font: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              minHeight: 48,
              border: '1px solid #d8c79f',
              background: 'transparent',
              color: '#f4f1ea',
              font: 'inherit',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Decode Legend
          </button>
        </form>

        {submitted && !parsed && (
          <div style={{ border: '1px solid #4a2424', color: '#d8a0a0', padding: '1rem', lineHeight: 1.5 }}>
            Cipher not recognized. Expected format: EL-0:CL-0:LG-0:SERIAL
          </div>
        )}

        {legend && parsed && (
          <article style={{ border: '1px solid #333', padding: '1rem', background: 'rgba(255,255,255,0.025)', display: 'grid', gap: '0.85rem', lineHeight: 1.6 }}>
            <div style={{ color: '#d8c79f', wordBreak: 'break-word' }}>{parsed.code}</div>
            <p style={{ margin: 0 }}>{legend.element}</p>
            <p style={{ margin: 0 }}>{legend.celestial}</p>
            <p style={{ margin: 0 }}>{legend.logic}</p>
          </article>
        )}
      </section>
    </main>
  );
}
