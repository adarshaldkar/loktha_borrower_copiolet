import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Calculator, RotateCcw } from 'lucide-react';
import type { FullAssessment } from '../engine/assessmentEngine';
import { calculateAllInApr, calculateEmi, roundRate } from '../engine/math';
import type { RuleConfig } from '../types';

const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export interface LenderOffer {
  amount: number | '';
  nominalRate: number | '';
  tenureMonths: number | '';
  processingFeePercent: number | '';
  documentationFee: number | '';
  insuranceFee: number | '';
}

const emptyOffer = (): LenderOffer => ({
  amount: '',
  nominalRate: '',
  tenureMonths: '',
  processingFeePercent: '',
  documentationFee: '',
  insuranceFee: '',
});

function clampMoney(value: number) {
  return Math.max(0, Math.round(value));
}

export function OfferComparator({ assessment, rules }: { assessment: FullAssessment; rules: RuleConfig }) {
  const [offer, setOffer] = useState<LenderOffer>(emptyOffer);

  useEffect(() => {
    setOffer(emptyOffer());
  }, [assessment]);

  const hasValidAmount = typeof offer.amount === 'number' && offer.amount > 0;

  const comparison = useMemo(() => {
    if (!hasValidAmount) {
      return null;
    }
    const amount = clampMoney(Number(offer.amount) || 0);
    const nominalRate = Number(offer.nominalRate) || 0;
    const tenureMonths = Math.max(1, Number(offer.tenureMonths) || 12);
    const feePct = Number(offer.processingFeePercent) || 0;
    const docFee = Number(offer.documentationFee) || 0;
    const insFee = Number(offer.insuranceFee) || 0;

    const processing = amount * Math.max(0, feePct) / 100;
    const processingWithGst = processing * (1 + rules.fees.gstOnProcessingFeePercent / 100);
    const upfront = processingWithGst + Math.max(0, docFee) + Math.max(0, insFee);
    const net = Math.max(0, amount - upfront);
    const emi = calculateEmi(amount, nominalRate, tenureMonths);
    const apr = calculateAllInApr(net, emi, tenureMonths);
    const belowBenchmark = nominalRate < assessment.o3.fairRateMin - 0.25;
    const aboveBenchmark = nominalRate > assessment.o3.fairRateMax + 0.25;
    const withinFairRange = !aboveBenchmark;
    const emiSafe = assessment.o4.safeEmiCeiling > 0 ? emi <= assessment.o4.safeEmiCeiling : false;
    const feeReasonable = feePct <= assessment.o3.processingFeePercent;
    const overall = withinFairRange && emiSafe && feeReasonable;
    return { processingWithGst, upfront, net, emi, apr: roundRate(apr), withinFairRange, belowBenchmark, aboveBenchmark, emiSafe, feeReasonable, overall, nominalRate, feePct };
  }, [assessment, offer, rules, hasValidAmount]);

  const reset = () => setOffer(emptyOffer());

  return (
    <section className="result-card offer-comparator">
      <div className="result-card-head">
        <div><span className="kicker">Optional tool</span><h3>Compare a lender offer</h3></div>
        <Calculator size={22} />
      </div>
      <p className="small-note">Enter an actual quote from a bank or lender to compare the nominal rate, all-in APR, upfront charges and monthly EMI against your safe guardrails.</p>

      <div className="offer-form">
        <OfferInput label="Quoted loan amount" value={offer.amount} onChange={(v) => setOffer({ ...offer, amount: v })} prefix="₹" placeholder="e.g. 5,00,000" />
        <OfferInput label="Quoted interest rate" value={offer.nominalRate} onChange={(v) => setOffer({ ...offer, nominalRate: v })} suffix="%" step="0.1" placeholder="e.g. 12.5" />
        <OfferInput label="Tenure" value={offer.tenureMonths} onChange={(v) => setOffer({ ...offer, tenureMonths: v === '' ? '' : Math.max(1, Number(v)) })} suffix="mo" step="1" placeholder="e.g. 36" />
        <OfferInput label="Processing fee" value={offer.processingFeePercent} onChange={(v) => setOffer({ ...offer, processingFeePercent: v })} suffix="%" step="0.1" placeholder="e.g. 1.0" />
        <OfferInput label="Documentation" value={offer.documentationFee} onChange={(v) => setOffer({ ...offer, documentationFee: v })} prefix="₹" placeholder="e.g. 0" />
        <OfferInput label="Insurance / other upfront" value={offer.insuranceFee} onChange={(v) => setOffer({ ...offer, insuranceFee: v })} prefix="₹" placeholder="e.g. 0" />
      </div>

      {!comparison ? (
        <div className="offer-verdict watch">
          <div><span className="kicker">Comparator standby</span><strong>Enter a valid lender quote amount above to compare</strong></div>
        </div>
      ) : (
        <>
          <div className={`offer-verdict ${comparison.overall ? 'good' : 'watch'}`}>
            <div><span className="kicker">Comparison result</span><strong>{comparison.overall ? 'Looks broadly within your safe guardrails' : 'Review this offer carefully before accepting'}</strong></div>
            <button className="ghost-btn" onClick={reset}><RotateCcw size={14} /> Reset</button>
          </div>

          <div className="offer-metric-grid">
            <OfferMetric label="All-in APR" value={`${comparison.apr.toFixed(2)}%`} note={`Fair max ${assessment.o3.fairRateMax.toFixed(2)}%`} positive={comparison.withinFairRange} />
            <OfferMetric label="Monthly EMI" value={money(comparison.emi)} note={`Safe max ${money(assessment.o4.safeEmiCeiling)}`} positive={comparison.emiSafe} />
            <OfferMetric label="Upfront cost" value={money(comparison.upfront)} note={`Processing incl. GST ${money(comparison.processingWithGst)}`} positive={comparison.feeReasonable} />
            <OfferMetric label="Net disbursed" value={money(comparison.net)} note={`From ${money(Number(offer.amount) || 0)} principal`} positive />
          </div>

          <div className="offer-criteria">
            <CheckLine
              ok={!comparison.aboveBenchmark}
              text={
                comparison.belowBenchmark
                  ? `Quoted rate (${comparison.nominalRate}%) is below fair benchmark floor (${assessment.o3.fairRateMin.toFixed(2)}%) — check for promotional teaser periods or floating resets.`
                  : comparison.aboveBenchmark
                  ? `Quoted rate (${comparison.nominalRate}%) exceeds fair ceiling (${assessment.o3.fairRateMax.toFixed(2)}%).`
                  : `Quoted rate (${comparison.nominalRate}%) is within estimated fair range (${assessment.o3.fairRateMin.toFixed(2)}%–${assessment.o3.fairRateMax.toFixed(2)}%).`
              }
            />
            <CheckLine ok={comparison.feeReasonable} text={comparison.feeReasonable ? 'Processing fee is at or below benchmark.' : `Processing fee (${comparison.feePct}%) exceeds standard benchmark (${assessment.o3.processingFeePercent}%).`} />
            <CheckLine ok={comparison.emiSafe} text={comparison.emiSafe ? 'Quoted EMI is within the borrower’s safe monthly ceiling.' : assessment.o4.safeEmiCeiling === 0 ? 'Safe capacity is ₹0 (restructuring required before new borrowing).' : `Quoted EMI (${money(comparison.emi)}) exceeds safe ceiling (${money(assessment.o4.safeEmiCeiling)}).`} />
          </div>

          <div className="numbers-note offer-next"><strong>Negotiation move.</strong> Counter the lender on the biggest gap first: reduce upfront fees, lower the interest rate, or reject bundled insurance.</div>
        </>
      )}
    </section>
  );
}

function OfferInput({ label, value, onChange, prefix, suffix, step = '1', placeholder = '' }: { label: string; value: number | ''; onChange: (value: number | '') => void; prefix?: string; suffix?: string; step?: string; placeholder?: string }) {
  return (
    <label className="offer-field">
      <span>{label}</span>
      <div className="offer-input">
        {prefix && <b>{prefix}</b>}
        <input
          type="number"
          min="0"
          step={step}
          placeholder={placeholder}
          value={value === '' ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? '' : Number(val));
          }}
        />
        {suffix && <b>{suffix}</b>}
      </div>
    </label>
  );
}

function OfferMetric({ label, value, note, positive }: { label: string; value: string; note: string; positive: boolean }) {
  return <div className="offer-metric"><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : 'negative'}>{positive ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{note}</small></div>;
}

function CheckLine({ ok, text }: { ok: boolean; text: string }) {
  return <div className={`check-line ${ok ? 'ok' : 'not-ok'}`}><span>{ok ? '✓' : '!'}</span><p>{text}</p></div>;
}
