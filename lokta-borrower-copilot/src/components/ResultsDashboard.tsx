import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, CircleHelp, ShieldCheck, XCircle } from 'lucide-react';
import type { FullAssessment } from '../engine/assessmentEngine';
import type { ExplanationTrace } from '../engine/explainability';
import { ExplainabilityModal } from './ExplainabilityModal';

const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const percent = (value: number) => `${value.toFixed(1)}%`;
const labelize = (value: string) => value.replaceAll('_', ' ');

export function ResultsDashboard({ assessment }: { assessment: FullAssessment }) {
  const [activeTrace, setActiveTrace] = useState<ExplanationTrace | null>(null);
  const [stressMode, setStressMode] = useState<'income' | 'rate' | null>(null);

  const traces = useMemo(() => new Map(assessment.explainability.map((trace) => [trace.id, trace])), [assessment.explainability]);
  const verdict = assessment.o1.verdict;
  const verdictIcon = verdict === 'BORROW' ? <CheckCircle2 size={22} /> : verdict === 'BORROW_LESS' ? <AlertTriangle size={22} /> : <XCircle size={22} />;
  const verdictClass = verdict.toLowerCase();

  const openTrace = (id: string) => setActiveTrace(traces.get(id) ?? null);

  return (
    <section className="results-stack">
      <div className="results-intro">
        <div>
          <span className="kicker">Assessment results</span>
          <h2>Your borrowing picture, in four decisions.</h2>
          <p>Every figure below is recalculated from the current profile and active configuration. Use the “Why?” control to inspect the calculation.</p>
        </div>
        <span className="confidence-pill">{assessment.confidence.rating} confidence · {assessment.confidence.confidenceReason}</span>
      </div>

      <div className="result-grid result-grid-top">
        <article className={`result-card verdict-result verdict-${verdictClass}`}>
          <div className="result-card-head">
            <div><span className="kicker">O1 · Recommendation</span><h3>{labelize(verdict)}</h3></div>
            <span className="verdict-icon">{verdictIcon}</span>
          </div>
          <p className="result-lede">{assessment.o1.reason}</p>
          <div className="decision-stats">
            <MiniStat label="Current FOIR" value={percent(assessment.normalized.currentFoir)} />
            <MiniStat label="Projected FOIR" value={percent(assessment.o1.projectedFoir)} />
            <MiniStat label="Safe FOIR cap" value={percent(assessment.o1.safeFoirCap * 100)} />
          </div>
          <WhyButton onClick={() => openTrace('o1')} />
        </article>

        <article className="result-card">
          <div className="result-card-head">
            <div><span className="kicker">O2 · Capacity</span><h3>Lender vs safe</h3></div>
            <ShieldCheck size={22} />
          </div>
          <div className="capacity-compare">
            <CapacityMeter label="Estimated lender capacity" value={assessment.o2.lenderSanction} max={Math.max(assessment.o2.lenderSanction, assessment.o2.safeBorrowerCapacity)} tone="lender" />
            <CapacityMeter label="Safe borrower capacity" value={assessment.o2.safeBorrowerCapacity} max={Math.max(assessment.o2.lenderSanction, assessment.o2.safeBorrowerCapacity)} tone="safe" />
          </div>
          <div className="guidance-box"><strong>Use this number: {money(assessment.o2.safeBorrowerCapacity)}</strong><span>{assessment.o2.guidance}</span></div>
          <div className="why-row">
            <WhyButton label="Why lender estimate?" onClick={() => openTrace('o2-lender')} />
            <WhyButton label="Why safe capacity?" onClick={() => openTrace('o2-safe')} />
          </div>
        </article>
      </div>

      <div className="result-grid">
        <article className="result-card">
          <div className="result-card-head">
            <div><span className="kicker">O3 · Pricing</span><h3>Fair rate + true cost</h3></div>
            <div className="pathway-pill">{labelize(assessment.o3.pathway)}</div>
          </div>
          <div className="rate-display">
            <div><span className="metric-label">Estimated fair rate</span><strong>{assessment.o3.fairRateMin.toFixed(2)}% – {assessment.o3.fairRateMax.toFixed(2)}%</strong></div>
            <div className="rate-range"><span style={{ left: '5%' }}></span><i style={{ left: `${Math.min(95, Math.max(5, (assessment.o3.fairRateMin / Math.max(assessment.o3.fairRateMax, 1)) * 70))}%`, width: '25%' }}></i></div>
          </div>
          <div className="fee-table">
            <Row label="Nominal rate used" value={`${assessment.o3.nominalRateUsedForApr.toFixed(2)}%`} />
            <Row label={`Processing fee (${assessment.o3.processingFeePercent.toFixed(2)}%)`} value={money(Math.max(0, assessment.o3.upfrontCharges - assessment.o3.documentationFee))} />
            <Row label="Documentation fee" value={money(assessment.o3.documentationFee)} />
            <Row label="Upfront charges" value={money(assessment.o3.upfrontCharges)} />
            <Row label="Net disbursement" value={money(assessment.o3.netDisbursement)} />
            <Row label="True all-in APR" value={`${assessment.o3.allInApr.toFixed(2)}%`} emphasis />
          </div>
          <div className="why-row">
            <WhyButton label="Why fair rate?" onClick={() => openTrace('o3-rate')} />
            <WhyButton label="Why APR?" onClick={() => openTrace('o3-apr')} />
          </div>
          <p className="small-note">{assessment.o3.pricingConfidenceNote} This is an estimate, not a guaranteed lender quote.</p>
        </article>

        <article className="result-card">
          <div className="result-card-head">
            <div><span className="kicker">O4 · Outflow</span><h3>Safe EMI ceiling</h3></div>
            <div className="emi-hero">{money(assessment.o4.safeEmiCeiling)}<span>/ month</span></div>
          </div>
          <div className="emi-rail"><div style={{ width: `${Math.min(100, assessment.o4.safeEmiCeiling > 0 ? 100 : 0)}%` }}></div></div>
          <div className="tenure-table">
            <div className="table-row table-head"><span>Tenure</span><span>EMI</span><span>Interest</span><span>Outflow</span></div>
            {assessment.o4.tenureRows.map((row) => (
              <div className="table-row" key={row.months}>
                <strong>{row.months} mo</strong><span>{money(row.emi)}</span><span>{money(row.totalInterest)}</span><span>{money(row.totalOutflow)}</span>
              </div>
            ))}
          </div>
          <WhyButton label="Why safe EMI?" onClick={() => openTrace('o4-emi')} />
        </article>
      </div>

      <article className="result-card stress-card">
        <div className="result-card-head">
          <div><span className="kicker">O4 · Stress testing</span><h3>Can the plan survive a shock?</h3></div>
          <div className="stress-toggle">
            <button className={stressMode === 'income' ? 'active' : ''} onClick={() => setStressMode(stressMode === 'income' ? null : 'income')}>Income shock</button>
            <button className={stressMode === 'rate' ? 'active' : ''} onClick={() => setStressMode(stressMode === 'rate' ? null : 'rate')}>Rate shock</button>
          </div>
        </div>
        <div className="stress-grid">
          <StressBox icon={<AlertTriangle size={19} />} title={`Income −${Math.round(assessment.o4.stress.incomeShock.shockedIncome / Math.max(assessment.normalized.income.effectiveIncome, 1) * 100 - 100) * -1}%`} ok={assessment.o4.stress.incomeShock.passes}>
            <span>Income becomes {money(assessment.o4.stress.incomeShock.shockedIncome)}</span>
            <strong>{percent(assessment.o4.stress.incomeShock.shockedFoir)} projected FOIR</strong>
            <span>Surplus after debt + living: {money(assessment.o4.stress.incomeShock.shockedSurplus)}</span>
          </StressBox>
          <StressBox icon={<CircleHelp size={19} />} title={`Rate +${assessment.o4.stress.rateShock.shockedRate - assessment.o3.nominalRateUsedForApr} pts`} ok={assessment.o4.stress.rateShock.passes}>
            <span>Shocked rate: {assessment.o4.stress.rateShock.shockedRate.toFixed(2)}%</span>
            <strong>EMI increase: {money(assessment.o4.stress.rateShock.emiIncrease)}</strong>
            <span>Surplus after shock: {money(assessment.o4.stress.rateShock.surplusAfterShock)}</span>
          </StressBox>
        </div>
        {stressMode && <div className="stress-focus">{stressMode === 'income' ? 'Income shock is the conservative resilience check: a temporary earnings drop should not push the borrower into unaffordable debt service.' : 'Rate shock shows how a floating-rate change can affect monthly outflow even when the starting quote looked affordable.'}</div>}
        <div className="why-row"><WhyButton label="Why income stress?" onClick={() => openTrace('o4-stress-income')} /><span className="small-note">Stress assumptions are configurable prototype parameters.</span></div>
      </article>

      <div className="numbers-note"><strong>Model note.</strong> Results are generated from the information provided. Unknown information widens uncertainty; it is never silently treated as zero.</div>

      <ExplainabilityModal trace={activeTrace} onClose={() => setActiveTrace(null)} />
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="mini-stat"><span>{label}</span><strong>{value}</strong></div>;
}

function CapacityMeter({ label, value, max, tone }: { label: string; value: number; max: number; tone: 'lender' | 'safe' }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return <div className="capacity-meter"><div className="meter-label"><span>{label}</span><strong>{money(value)}</strong></div><div className={`meter-track ${tone}`}><span style={{ width: `${Math.min(100, width)}%` }} /></div></div>;
}

function Row({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`fee-row ${emphasis ? 'emphasis' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

function WhyButton({ onClick, label = 'Why this number?' }: { onClick: () => void; label?: string }) {
  return <button className="why-button" onClick={onClick}><CircleHelp size={15} />{label}</button>;
}

function StressBox({ icon, title, ok, children }: { icon: React.ReactNode; title: string; ok: boolean; children: ReactNode }) {
  return <div className={`stress-box ${ok ? 'pass' : 'fail'}`}><div className="stress-box-head"><span>{icon}</span><strong>{title}</strong><span className="stress-status">{ok ? 'PASS' : 'WATCH'}</span></div><div className="stress-values">{children}</div></div>;
}
