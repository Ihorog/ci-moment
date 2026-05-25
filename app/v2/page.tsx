"use client";

import { FormEvent, useMemo, useState } from 'react';
import LegendArtifactCard from '@/components/LegendArtifactCard';
import { getGiftInvitationData, getPersonalArtifactData } from '@/lib/legend-engine';

export default function V2Page() {
  const [mode, setMode] = useState<'personal' | 'gift'>('personal');
  const [subjectName, setSubjectName] = useState('');
  const [context, setContext] = useState('personal moment');
  const [submitted, setSubmitted] = useState(false);

  const artifact = useMemo(() => {
    if (!submitted || !subjectName.trim()) return null;

    if (mode === 'gift') {
      return getGiftInvitationData(subjectName, context || 'gift access');
    }

    return getPersonalArtifactData(subjectName, context || 'personal moment');
  }, [submitted, mode, subjectName, context]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetForMode(nextMode: 'personal' | 'gift') {
    setMode(nextMode);
    setSubmitted(false);
    setContext(nextMode === 'gift' ? 'gift access' : 'personal moment');
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
            Legend ci / personal artifact machine
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 7vw, 4.25rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Claim Your Moment
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 660, color: '#a8a096', lineHeight: 1.6 }}>
            Generate a personal deterministic artifact. Gift mode gives another person access to create their own moment.
          </p>
        </section>

        <div style={{ margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" onClick={() => resetForMode('personal')} style={mode === 'personal' ? activeTabStyle : tabStyle}>
            Personal Moment
          </button>
          <button type="button" onClick={() => resetForMode('gift')} style={mode === 'gift' ? activeTabStyle : tabStyle}>
            Gift Access
          </button>
        </div>

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
          <label style={labelStyle}>
            {mode === 'gift' ? 'Your name or alias' : 'Your name or alias'}
            <input
              value={subjectName}
              onChange={(event) => {
                setSubjectName(event.target.value);
                setSubmitted(false);
              }}
              placeholder={mode === 'gift' ? 'Gift sender name or alias' : 'Personal holder name or alias'}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            {mode === 'gift' ? 'Gift note / access context' : 'Moment context'}
            <input
              value={context}
              onChange={(event) => {
                setContext(event.target.value);
                setSubmitted(false);
              }}
              placeholder={mode === 'gift' ? 'gift access / invitation' : 'decision / evening / transition'}
              style={inputStyle}
            />
          </label>

          <button type="submit" style={buttonStyle}>
            {mode === 'gift' ? 'Generate Gift Access Preview' : 'Generate Personal Artifact'}
          </button>

          <p style={{ margin: 0, color: '#777', fontSize: '0.72rem', lineHeight: 1.5 }}>
            {mode === 'gift'
              ? 'Gift Access is an invitation. The recipient creates their own personal moment after opening the access link.'
              : 'Personal Moment is the main product: one person, one moment, one artifact.'}
          </p>
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

const labelStyle = {
  display: 'grid',
  gap: '0.35rem',
  fontSize: '0.72rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
};

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

const tabStyle = {
  minHeight: 40,
  border: '1px solid #333',
  background: 'transparent',
  color: '#888',
  font: 'inherit',
  padding: '0 1rem',
  cursor: 'pointer',
};

const activeTabStyle = {
  ...tabStyle,
  border: '1px solid #d8c79f',
  color: '#f4f1ea',
};
