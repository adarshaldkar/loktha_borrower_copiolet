import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Calculator, RotateCcw } from 'lucide-react';
import type { FullAssessment } from '../engine/assessmentEngine';
import { calculateAllInApr, calculateEmi, roundRate } from '../engine/math';
import type { RuleConfig } from '../types';

const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export interface LenderOffer {
  amount: number;
  nominalRate: number;
  tenureMonths: number;
  processingFeePercent: number;
  documentationFee: number;
  insuranceFee: number;
}

const fromAssessment = (assessment: FullAssessment): LenderOffer => ({
  amount: assessment.o2.safeBorrowerCapacity,
  nominalRate: assessment.o3.fairRateMax + 1.5,
  tenureMonths: assessment.o4.tenureRows[1]?.months ?? 36,
  processingFeePercent: assessment.o3.processingFeePercent,
  documentationFee: assessment.o3.documentationFee,
  insuranceFee: 0,
});

function clampMoney(value: number) {
  return Math.max(0, Math.round(value));
}

export function OfferComparator({ assessment, rules }: { assessment: FullAssessment; rules: RuleConfig }) {
  const [offer, setOffer] = useState<LenderOffer>(() => fromAssessment(assessment));

  useEffect(() => {
    setOffer(fromAssessment(assessment));
  }, [assessment]);

  const comparison = useMemo(() => {
    const amount = clampMoney(offer.amount);
    const processing = amount * Math.max(0, offer.processingFeePercent) / 100;
    const processingWithGst = processing * (1 + rules.fees.gstOnProcessingFeePercent / 100);
    const upfront = processingWithGst + Math.max(0, offer.documentationFee) + Math.max(0, offer.insuranceFee);
    const net = Math.max(0, amount - upfront);
    const emi = calculateEmi(amount, offer.nominalRate, offer.tenureMonths);
    const apr = calculateAllInApr(net, emi, offer.tenureMonths);
    const withinFairRange = offer.nominalRate <= assessment.o3.fairRateMax + 0.25;
    const emiSafe = emi <= assessment.o4.safeEmiCeiling;
    const feeReasonable = offer.processingFeePercent <= assessment.o3.processingFeePercent;
    const overall = withinFairRange && emiSafe && feeReasonable;
    return { processingWithGst, upfront, net, emi, apr: roundRate(apr), withinFairRange, emiSafe, feeReasonable, overall };
  }, [assessment, offer, rules]);

  const reset = () => setOffer(fromAssessment(assessment));

  return (
    <section className="result-card offer-comparator">
      <div className="result-card-head">
        <div><span className="kicker">Phase 5 · Optional input</span><h3>Compare a lender offer</h3></div>
        <Calculator size={22} />
      </div>
      <p className="small-note">Enter an actual quote to compare the nominal rate, all-in APR, fees and monthly EMI against this borrower’s estimated fair range and safe ceiling.</p>

      <div className="offer-form">
        <OfferInput label="Loan amount" value={offer.amount} onChange={(v) => setOffer({ ...offer, amount: v })} prefix="₹" />
        <OfferInput label="Interest rate" value={offer.nominalRate} onChange={(v) => setOffer({ ...offer, nominalRate: v })} suffix="%" step="0.1" />
        <OfferInput label="Tenure" value={offer.tenureMonths} onChange={(v) => setOffer({ ...offer, tenureMonths: Math.max(1, v) })} suffix="mo" step="1" />
        <OfferInput label="Processing fee" value={offer.processingFeePercent} onChange={(v) => setOffer({ ...offer, processingFeePercent: v })} suffix="%" step="0.1" />
        <OfferInput label="Documentation" value={offer.documentationFee} onChange={(v) => setOffer({ ...offer, documentationFee: v })} prefix="₹" />
        <OfferInput label="Insurance / other upfront" value={offer.insuranceFee} onChange={(v) => setOffer({ ...offer, insuranceFee: v })} prefix="₹" />
      </div>

      <div className={`offer-verdict ${comparison.overall ? 'good' : 'watch'}`}>
        <div><span className="kicker">Comparison result</span><strong>{comparison.overall ? 'Looks broadly within your guardrails' : 'Review this offer before accepting'}</strong></div>
        <button className="ghost-btn" onClick={reset}><RotateCcw size={14} /> Reset example</button>
      </div>

      <div className="offer-metric-grid">
        <OfferMetric label="All-in APR" value={`${comparison.apr.toFixed(2)}%`} note={`Fair max ${assessment.o3.fairRateMax.toFixed(2)}%`} positive={comparison.withinFairRange} />
        <OfferMetric label="Monthly EMI" value={money(comparison.emi)} note={`Safe max ${money(assessment.o4.safeEmiCeiling)}`} positive={comparison.emiSafe} />
        <OfferMetric label="Upfront cost" value={money(comparison.upfront)} note={`Processing incl. GST ${money(comparison.processingWithGst)}`} positive={comparison.feeReasonable} />
        <OfferMetric label="Net disbursed" value={money(comparison.net)} note={`From ${money(offer.amount)} principal`} positive />
      </div>

      <div className="offer-criteria">
        <CheckLine ok={comparison.withinFairRange} text={comparison.withinFairRange ? 'Rate is within a small band of the estimated fair ceiling.' : 'Quoted rate is above the estimated fair ceiling.'} />
        <CheckLine ok={comparison.feeReasonable} text={comparison.feeReasonable ? 'Processing fee is no higher than the configured benchmark.' : 'Processing fee is above the configured benchmark.'} />
        <CheckLine ok={comparison.emiSafe} text={comparison.emiSafe ? 'Quoted EMI is within the borrower’s safe monthly ceiling.' : 'Quoted EMI exceeds the borrower’s safe monthly ceiling.'} />
      </div>

      <div className="numbers-note offer-next"><strong>Negotiation move.</strong> Ask the lender to reduce whichever metric is the largest gap first: rate, upfront fees or EMI.</div>
    </section>
  );
}

function OfferInput({ label, value, onChange, prefix, suffix, step = '1' }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string; step?: string }) {
  return <label className="offer-field"><span>{label}</span><div className="offer-input">{prefix && <b>{prefix}</b>}<input type="number" min="0" step={step} value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Number(e.target.value) || 0)} />{suffix && <b>{suffix}</b>}</div></label>;
}

function OfferMetric({ label, value, note, positive }: { label: string; value: string; note: string; positive: boolean }) {
  return <div className="offer-metric"><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : 'negative'}>{positive ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{note}</small></div>;
}

function CheckLine({ ok, text }: { ok: boolean; text: string }) {
  return <div className={`check-line ${ok ? 'ok' : 'not-ok'}`}><span>{ok ? '✓' : '!'}</span><p>{text}</p></div>;
}
