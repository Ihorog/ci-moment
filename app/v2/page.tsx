"use client";

import { FormEvent, useMemo, useState } from 'react';
import LegendArtifactCard from '@/components/LegendArtifactCard';
import { getArtifactData } from '@/lib/legend-engine';

export default function V2Page() {
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [context, setContext] = useState('free evening');
  const [submitted, setSubmitted] = useState(false);

  const artifact = useMemo(() => {
    if (!submitted || !senderName.trim() || !receiverName.trim()) return null;
    return getArtifactData(senderName, receiverName, context || 'moment');
  }, [submitted, senderName, receiverName, context]);

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
      <div style={{ width: 'min(960px, 100%)', display: 'grid', gap: '2rem' }}>
        <section style={{ display: 'grid', gap: '0.8rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.34em', textTransform: 'uppercase', color: '#777' }}>
            Legend ci / artifact prototype
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 7vw, 4.25rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Claim the Pass
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 620, color: '#a8a096', lineHeight: 1.6 }}>
            Generate a deterministic visual artifact. The cipher can be used later to reconstruct the same Legend ci fragment.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          style={{
            margin: '0 auto',
            width: 'min(640px, 100%)',
            display: 'grid',
            gap: '0.85rem',
            padding: '1rem',
            border: '1px solid #242424',
            background: 'rgba(255,255,255,0.025)',
          }}
        >
          <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Authorized by
            <input value={senderName} onChange={(event) => setSenderName(event.target.value)} placeholder="Your name or alias" required style={inputStyle} />
          </label>

          <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Issued to
            <input value={receiverName} onChange={(event) => setReceiverName(event.target.value)} placeholder="Receiver name or alias" required style={inputStyle} />
          </label>

          <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Context
            <input value={context} onChange={(event) => setContext(event.target.value)} placeholder="free evening / decision / gift" style={inputStyle} />
          </label>

          <button type="submit" style={buttonStyle}>Generate Artifact Preview</button>
        </form>

        {artifact && (
          <section style={{ display: 'grid', placeItems: 'center', gap: '1.25rem' }}>
            <LegendArtifactCard artifact={artifact} />
            <div style={{ width: 'min(760px, 92vw)', display: 'grid', gap: '0.65rem', color: '#b8afa3', lineHeight: 1.55 }}>
              <div style={{ color: '#e8e0d0', letterSpacing: '0.18em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Legend ci fragment
              </div>
              <p style={{ margin: 0 }}>{artifact.legend.element}</p>
              <p style={{ margin: 0 }}>{artifact.legend.celestial}</p>
              <p style={{ margin: 0 }}>{artifact.legend.logic}</p>
              <code style={{ color: '#d8c79f', wordBreak: 'break-word' }}>{artifact.cipher.code}</code>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  minHeight: 46,
  border: '1px solid #333',
  background: '#111',
  color: '#f4f1ea',
  padding: '0 0.85rem',
  font: 'inherit',
};

const buttonStyle = {
  minHeight: 48,
  border: '1px solid #d8c79f',
  background: 'transparent',
  color: '#f4f1ea',
  font: 'inherit',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  cursor: 'pointer',
};
