import { useMemo } from 'react';
import type { BorrowerProfile, FieldValue } from '../types';
import { getVisibleQuestions, type QuestionNode } from '../questionnaire/schema';
import { useBorrowerStore } from '../store/borrowerStore';

function unwrap<T>(field: FieldValue<T> | undefined): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

function fieldFor(profile: BorrowerProfile, key: keyof BorrowerProfile): FieldValue<unknown> {
  return profile[key] as FieldValue<unknown>;
}

export function Questionnaire() {
  const profile = useBorrowerStore((s) => s.profile);
  const setField = useBorrowerStore((s) => s.setField);
  const setUnknown = useBorrowerStore((s) => s.setUnknown);
  const questions = useMemo(() => getVisibleQuestions(profile, true), [profile]);

  const tier1 = questions.filter((q) => q.tier === 1);
  const tier2 = questions.filter((q) => q.tier === 2);

  return (
    <section className="panel questionnaire">
      <div className="section-head">
        <div>
          <span className="kicker">01 · Adaptive intake</span>
          <h2>Tell us about the borrowing decision.</h2>
        </div>
        <span className="pill">{tier2.length} follow-ups unlocked</span>
      </div>
      <div className="question-grid">
        {tier1.map((question) => <Question key={question.id} question={question} profile={profile} setField={setField} setUnknown={setUnknown} />)}
      </div>
      <div className="deepening">
        <div className="subhead"><span className="kicker">02 · Deepening</span><span>Only questions that can change an output are shown.</span></div>
        {tier2.length ? <div className="question-grid">{tier2.map((question) => <Question key={question.id} question={question} profile={profile} setField={setField} setUnknown={setUnknown} />)}</div> : <div className="empty-state">Choose an employment type to unlock the relevant questions.</div>}
      </div>
    </section>
  );
}

function mapScoreToBand(score: number): 'PRIME_750_PLUS' | 'GOOD_700_749' | 'FAIR_650_699' | 'SUBPRIME_UNDER_650' {
  if (score >= 750) return 'PRIME_750_PLUS';
  if (score >= 700) return 'GOOD_700_749';
  if (score >= 650) return 'FAIR_650_699';
  return 'SUBPRIME_UNDER_650';
}

function Question({ question, profile, setField, setUnknown }: {
  question: QuestionNode;
  profile: BorrowerProfile;
  setField: <K extends keyof BorrowerProfile>(key: K, value: BorrowerProfile[K]) => void;
  setUnknown: <K extends keyof BorrowerProfile>(key: K) => void;
}) {
  const field = fieldFor(profile, question.key);
  const value = unwrap(field as FieldValue<unknown>);
  const id = `q-${question.id}`;

  const onChange = (raw: string) => {
    if (raw === '') {
      setUnknown(question.key);
      return;
    }
    let next: unknown = raw;
    if (question.kind === 'currency' || question.kind === 'number' || question.kind === 'months') next = Number(raw.replace(/[^0-9.]/g, ''));
    if (question.kind === 'boolean') next = raw === 'true';
    setField(question.key, { status: 'KNOWN', value: next } as BorrowerProfile[typeof question.key]);
  };

  return (
    <label className="question" htmlFor={id}>
      <span className="question-title">
        {question.title}
        {question.required && <span style={{ color: 'var(--accent)', marginLeft: '3px', fontWeight: 'bold' }} title="Required field">*</span>}
      </span>
      {question.helper && <span className="question-helper">{question.helper}</span>}
      {question.tier === 2 && <button type="button" className="unknown-btn" onClick={(event) => { event.preventDefault(); setUnknown(question.key); }}>I don’t know / not sure</button>}
      {question.id === 'cibil' ? (
        <div className="cibil-dual-wrap">
          <select id={id} value={(value as string | undefined) ?? ''} onChange={(e) => e.target.value === 'UNKNOWN' ? setUnknown(question.key) : onChange(e.target.value)}>
            <option value="">Select score band…</option>
            {question.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
            <span>Or enter exact score:</span>
            <input
              type="number"
              min={300}
              max={900}
              placeholder="e.g. 780"
              style={{ width: '85px', padding: '0.28rem 0.45rem', fontSize: '0.8rem', border: '1px solid var(--rule)', borderRadius: '4px', background: '#fff' }}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (num >= 300 && num <= 900) {
                  setField('creditScoreBand', { status: 'KNOWN', value: mapScoreToBand(num) });
                }
              }}
            />
            {typeof value === 'string' && value !== 'UNKNOWN' && (
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {value === 'PRIME_750_PLUS' ? '→ Prime (750+)' : value === 'GOOD_700_749' ? '→ Good (700-749)' : value === 'FAIR_650_699' ? '→ Fair (650-699)' : '→ Subprime'}
              </span>
            )}
          </div>
        </div>
      ) : question.kind === 'select' ? (
        <select id={id} value={(value as string | undefined) ?? ''} onChange={(e) => e.target.value === 'UNKNOWN' ? setUnknown(question.key) : onChange(e.target.value)}>
          <option value="">Select…</option>
          {question.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : question.kind === 'boolean' ? (
        <select id={id} value={typeof value === 'boolean' ? String(value) : ''} onChange={(e) => e.target.value && onChange(e.target.value)}>
          <option value="">Select…</option><option value="true">Yes</option><option value="false">No</option>
        </select>
      ) : (
        <div className="input-wrap">
          {question.kind === 'currency' && <span>₹</span>}
          <input id={id} type="number" min={question.min} max={question.max} value={typeof value === 'number' ? value : ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      )}
    </label>
  );
}
