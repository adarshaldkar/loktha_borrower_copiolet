import { useMemo, useRef, useState } from 'react';
import { Check, Copy, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import type { FullAssessment } from '../engine/assessmentEngine';
import type { BorrowerProfile, ProductPathway } from '../types';

const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const pct = (value: number) => `${value.toFixed(2)}%`;

function known<T>(field: { status: 'KNOWN'; value: T } | { status: string } | undefined): T | undefined {
  return field?.status === 'KNOWN' ? (field as { status: 'KNOWN'; value: T }).value : undefined;
}

function pathwayLabel(pathway: ProductPathway) {
  return pathway.replaceAll('_', ' ');
}

export function NegotiationCard({ profile, assessment }: { profile: BorrowerProfile; assessment: FullAssessment }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const script = useNegotiationScript(profile, assessment);

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const printCard = () => window.print();

  return (
    <section className="negotiation-section">
      <div className="results-intro negotiation-intro">
        <div>
          <span className="kicker">Phase 5 · Branch tool</span>
          <h2>Walk into the lender prepared.</h2>
          <p>A one-screen negotiation card built from this borrower’s live profile, current rules and assessment outputs.</p>
        </div>
        <div className="negotiation-actions no-print">
          <button className="secondary-btn" onClick={printCard}><Printer size={16} /> Print card</button>
          <button className="primary-btn" onClick={copyScript}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy script'}</button>
        </div>
      </div>

      <div ref={cardRef} className="negotiation-card">
        <div className="neg-card-head">
          <div><span className="kicker">LOKTA BORROWER COPILOT</span><h3>Borrower Negotiation Card</h3></div>
          <span className="neg-card-mark"><ShieldCheck size={18} /> Live assessment</span>
        </div>
        <div className="neg-summary-grid">
          <div><span>Safe ceiling</span><strong>{money(assessment.o2.safeBorrowerCapacity)}</strong></div>
          <div><span>Recommended tenure</span><strong>{recommendedTenure(assessment)} mo</strong></div>
          <div><span>Fair rate</span><strong>{pct(assessment.o3.fairRateMin)} – {pct(assessment.o3.fairRateMax)}</strong></div>
          <div><span>Max safe EMI</span><strong>{money(assessment.o4.safeEmiCeiling)}/mo</strong></div>
        </div>

        <div className="neg-two-col">
          <div className="neg-panel">
            <div className="kicker">Lender offer checks</div>
            <NegRow label="Quoted rate above fair range?" action={`Counter around ${pct(assessment.o3.fairRateMax)} or below`} />
            <NegRow label="Processing fee" action={`Ask for ≤ ${pct(Math.max(0, assessment.o3.processingFeePercent))}`} />
            <NegRow label="Bundled insurance" action="Ask whether it is optional before accepting" />
            <NegRow label="EMI above safe ceiling?" action={`Do not agree above ${money(assessment.o4.safeEmiCeiling)}/month`} />
          </div>
          <div className="neg-panel highlight">
            <div className="kicker">What to say</div>
            <p className="neg-script">“{script}”</p>
          </div>
        </div>

        <div className="neg-footer">
          <span><Sparkles size={15} /> Estimated, not a guaranteed lender quote.</span>
          <strong>Pathway: {pathwayLabel(assessment.o3.pathway)}</strong>
        </div>
      </div>
    </section>
  );
}

function NegRow({ label, action }: { label: string; action: string }) {
  return <div className="neg-row"><span>{label}</span><strong>{action}</strong></div>;
}

function recommendedTenure(assessment: FullAssessment) {
  const rows = assessment.o4.tenureRows;
  if (!rows.length) return 36;
  const affordable = rows.filter((row) => row.emi <= assessment.o4.safeEmiCeiling);
  return affordable[0]?.months ?? rows[rows.length - 1].months;
}

function useNegotiationScript(profile: BorrowerProfile, assessment: FullAssessment) {
  return useMemo(() => {
    const score = known<string>(profile.creditScoreBand);
    const years = known<number>(profile.yearsAtCurrentEmployer);
    const collateral = known<number>(profile.unencumberedCollateralValue);
    const amount = known<number>(profile.requestedAmount) ?? assessment.o2.safeBorrowerCapacity;
    const scoreText = score === 'PRIME_750_PLUS' ? 'My credit profile is in the prime band' : score === 'UNKNOWN' ? 'My credit score is currently unverified' : 'My credit profile should be priced transparently';
    const stabilityText = years && years >= 3 ? `I have ${years} years with my current employer` : 'I can provide my income and employment details for verification';
    const collateralText = collateral ? ` I can also discuss secured lending against approximately ${money(collateral)} of unencumbered property.` : '';
    return `I am seeking around ${money(Math.min(amount, assessment.o2.safeBorrowerCapacity))}. ${scoreText}. ${stabilityText}.${collateralText} Based on my assessment, I am targeting ${pct(assessment.o3.fairRateMin)}–${pct(assessment.o3.fairRateMax)} and will not agree to an EMI above ${money(assessment.o4.safeEmiCeiling)} per month.`;
  }, [assessment, profile]);
}
