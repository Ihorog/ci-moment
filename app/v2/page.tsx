"use client";

import { FormEvent, useMemo, useState } from 'react';
import LegendArtifactCard from '@/components/LegendArtifactCard';
import { getGiftInvitationData, getPersonalArtifactData } from '@/lib/legend-engine';

const BURDENS = [
  'I keep overthinking the same decision',
  'I need to take this off my plate',
  'I want permission to stop carrying this tonight',
  'I am stuck between two choices',
  'I need a clean sign before I move',
];

const RELEASES = [
  'Close the loop',
  'Move forward',
  'Pause without guilt',
  'Let it go tonight',
  'Make it official',
];

const FIELDS = [
  'The Archive',
  'The Ledger',
  'The Seal',
  'The Transit Office',
  'The Moment Authority',
];

export default function V2Page() {
  const [mode, setMode] = useState<'personal' | 'gift'>('personal');
  const [subjectName, setSubjectName] = useState('');
  const [burden, setBurden] = useState(BURDENS[0]);
  const [release, setRelease] = useState(RELEASES[0]);
  const [field, setField] = useState(FIELDS[0]);
  const [submitted, setSubmitted] = useState(false);

  const context = `${burden} / ${release} / ${field}`;

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
  }

  return (
    <main style={mainStyle}>
      <div style={{ width: 'min(1040px, 100%)', display: 'grid', gap: '2rem' }}>
        <section style={{ display: 'grid', gap: '0.95rem', textAlign: 'center' }}>
          <div style={eyebrowStyle}>Ci Moment / decision relief terminal</div>
          <h1 style={heroStyle}>Stop carrying the same decision.</h1>
          <p style={subheroStyle}>
            Hand one unresolved moment to the system. In four moves, receive a sealed answer and a private record you can keep.
          </p>
          <p style={valueLineStyle}>Costs about a coffee. Feels like a record worth keeping.</p>
        </section>

        <section aria-label="How it works" style={cardsGridStyle}>
          <InfoCard label="1 / Name the weight" text="Choose the pressure you want to stop carrying." />
          <InfoCard label="2 / Choose the release" text="Pick how the loop should be closed for now." />
          <InfoCard label="3 / Hand it to the field" text="Give the burden to a fictional external authority." />
          <InfoCard label="4 / Seal the answer" text="Secure the pass and receive the artifact." />
        </section>

        <div style={{ margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" onClick={() => resetForMode('personal')} style={mode === 'personal' ? activeTabStyle : tabStyle}>Personal Moment</button>
          <button type="button" onClick={() => resetForMode('gift')} style={mode === 'gift' ? activeTabStyle : tabStyle}>Gift Access</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            {mode === 'gift' ? 'Who gives the access?' : 'Who is carrying this moment?'}
            <input
              value={subjectName}
              onChange={(event) => { setSubjectName(event.target.value); setSubmitted(false); }}
              placeholder={mode === 'gift' ? 'Gift sender name or alias' : 'Your name or alias'}
              required
              style={inputStyle}
            />
          </label>

          <ChoiceGroup title="1. Name the weight" value={burden} options={BURDENS} onChange={setBurden} />
          <ChoiceGroup title="2. Choose the release" value={release} options={RELEASES} onChange={setRelease} />
          <ChoiceGroup title="3. Hand it to the field" value={field} options={FIELDS} onChange={setField} />

          <button type="submit" style={buttonStyle}>
            {mode === 'gift' ? 'Preview Gift Access — $5' : 'Seal the Answer — $5'}
          </button>

          <p style={smallCopyStyle}>
            {mode === 'gift'
              ? 'Gift Access gives another person a clean starting point to create their own moment.'
              : 'Symbolic decision support. Not medical, legal, financial, or psychological advice.'}
          </p>
        </form>

        {artifact && (
          <section style={{ display: 'grid', placeItems: 'center', gap: '1.25rem' }}>
            <div style={envelopeStyle}>
              <div style={sealStyle}>SEAL BROKEN</div>
              <div style={{ color: '#b8afa3', lineHeight: 1.55 }}>
                The burden has been handed to {field}. The answer is fixed into a private record.
              </div>
            </div>
            <LegendArtifactCard artifact={artifact} />
            <div style={legendBoxStyle}>
              <div style={sectionLabelStyle}>Private Constitution Fragment</div>
              <p style={{ margin: 0 }}>{artifact.legend.element}</p>
              <p style={{ margin: 0 }}>{artifact.legend.celestial}</p>
              <p style={{ margin: 0 }}>{artifact.legend.logic}</p>
              <code style={{ color: '#d8c79f', wordBreak: 'break-word' }}>{artifact.cipher.code}</code>
              <p style={{ margin: 0, color: '#777', fontSize: '0.72rem' }}>
                This fragment is reconstructed by cipher. The same code returns the same Legend ci article later.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ChoiceGroup({ title, value, options, onChange }: { title: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <fieldset style={{ border: '1px solid #252525', padding: '0.75rem', display: 'grid', gap: '0.5rem' }}>
      <legend style={labelStyle}>{title}</legend>
      <div style={{ display: 'grid', gap: '0.45rem' }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={option === value ? selectedChoiceStyle : choiceStyle}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function InfoCard({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ border: '1px solid #242424', padding: '0.9rem', background: 'rgba(255,255,255,0.025)' }}>
      <div style={sectionLabelStyle}>{label}</div>
      <p style={{ margin: '0.45rem 0 0', color: '#a8a096', lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

const mainStyle = { minHeight: '100vh', background: '#08090b', color: '#e8e0d0', fontFamily: "'Courier New', Courier, monospace", display: 'grid', placeItems: 'center', padding: '2rem 1rem' };
const eyebrowStyle = { fontSize: '0.72rem', letterSpacing: '0.34em', textTransform: 'uppercase' as const, color: '#777' };
const heroStyle = { margin: 0, fontSize: 'clamp(2.35rem, 8vw, 5.4rem)', lineHeight: 0.9, letterSpacing: '-0.07em' };
const subheroStyle = { margin: '0 auto', maxWidth: 760, color: '#b8afa3', lineHeight: 1.65, fontSize: '1rem' };
const valueLineStyle = { margin: 0, color: '#d8c79f', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontSize: '0.75rem' };
const cardsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' };
const formStyle = { margin: '0 auto', width: 'min(720px, 100%)', display: 'grid', gap: '0.95rem', padding: '1rem', border: '1px solid #242424', background: 'rgba(255,255,255,0.025)' };
const labelStyle = { display: 'grid', gap: '0.35rem', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#d8c79f' };
const sectionLabelStyle = { color: '#d8c79f', letterSpacing: '0.18em', fontSize: '0.72rem', textTransform: 'uppercase' as const };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, minHeight: 46, border: '1px solid #333', background: '#111', color: '#f4f1ea', padding: '0 0.85rem', font: 'inherit' };
const buttonStyle = { minHeight: 52, border: '1px solid #d8c79f', background: 'transparent', color: '#f4f1ea', font: 'inherit', letterSpacing: '0.14em', textTransform: 'uppercase' as const, cursor: 'pointer' };
const tabStyle = { minHeight: 40, border: '1px solid #333', background: 'transparent', color: '#888', font: 'inherit', padding: '0 1rem', cursor: 'pointer' };
const activeTabStyle = { ...tabStyle, border: '1px solid #d8c79f', color: '#f4f1ea' };
const choiceStyle = { minHeight: 40, textAlign: 'left' as const, border: '1px solid #2c2c2c', background: '#0d0e10', color: '#a8a096', font: 'inherit', padding: '0.65rem 0.75rem', cursor: 'pointer' };
const selectedChoiceStyle = { ...choiceStyle, border: '1px solid #d8c79f', color: '#f4f1ea', background: 'rgba(216,199,159,0.08)' };
const smallCopyStyle = { margin: 0, color: '#777', fontSize: '0.72rem', lineHeight: 1.5 };
const envelopeStyle = { width: 'min(760px, 92vw)', border: '1px solid #333', background: 'rgba(255,255,255,0.025)', padding: '1rem', display: 'grid', gap: '0.5rem', textAlign: 'center' as const };
const sealStyle = { margin: '0 auto', border: '1px solid #8f2f2f', color: '#d8a0a0', borderRadius: 999, padding: '0.45rem 0.75rem', letterSpacing: '0.14em', fontSize: '0.72rem' };
const legendBoxStyle = { width: 'min(760px, 92vw)', display: 'grid', gap: '0.65rem', color: '#b8afa3', lineHeight: 1.55, userSelect: 'none' as const };
