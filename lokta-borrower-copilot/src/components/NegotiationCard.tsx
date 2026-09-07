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
  const verdict = assessment.o1.verdict;
  const isRestructure = verdict === 'RESTRUCTURE_FIRST' || verdict === 'DONT_BORROW' || assessment.o2.safeBorrowerCapacity === 0;

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
          <span className="kicker">Negotiation companion</span>
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
          <div>
            <span>Requested vs Safe</span>
            <strong>{(known<number>(profile.requestedAmount) ?? 0) > 0 ? `${money(known<number>(profile.requestedAmount) ?? 0)} → ` : ''}{isRestructure ? '₹0 (Restructure)' : money(assessment.o2.safeBorrowerCapacity)}</strong>
          </div>
          <div>
            <span>{isRestructure ? 'Priority' : 'Shortest safe tenure'}</span>
            <strong>{isRestructure ? 'Debt clearance' : `${recommendedTenure(assessment)} mo`}</strong>
          </div>
          <div>
            <span>Fair rate benchmark</span>
            <strong>{pct(assessment.o3.fairRateMin)} – {pct(assessment.o3.fairRateMax)}</strong>
          </div>
          <div>
            <span>Max safe EMI</span>
            <strong>{isRestructure ? '₹0 new EMI' : `${money(assessment.o4.safeEmiCeiling)}/mo`}</strong>
          </div>
        </div>

        <div className="neg-two-col">
          <div className="neg-panel">
            <div className="kicker">Lender offer checks</div>
            {isRestructure ? (
              <>
                <NegRow label="High-cost app loans?" action="Reject loans above 18% APR" />
                <NegRow label="New unsecured debt?" action={`Pause until ${known<number>(profile.highCostDebtApr) ? `${known<number>(profile.highCostDebtApr)}% APR` : 'high-cost'} debt is closed`} />
                <NegRow label="Processing / upfront fees" action="Check for predatory deductions" />
                <NegRow label="Asset financing scheme" action="Seek subsidized direct OEM / EV schemes" />
              </>
            ) : (
              <>
                <NegRow label="Quoted rate above fair range?" action={`Counter around ${pct(assessment.o3.fairRateMax)} or below`} />
                <NegRow label="Processing fee" action={`Ask for ≤ ${pct(Math.max(0, assessment.o3.processingFeePercent))}`} />
                <NegRow label="Bundled insurance" action="Ask whether it is optional before accepting" />
                <NegRow label="EMI above safe ceiling?" action={`Do not agree above ${money(assessment.o4.safeEmiCeiling)}/month`} />
              </>
            )}
          </div>
          <div className="neg-panel highlight">
            <div className="kicker">What to say</div>
            <p className="neg-script">“{script}”</p>
          </div>
        </div>

        <div className="neg-footer">
          <span><Sparkles size={15} /> Estimated fair rate — not a guaranteed lender quote.</span>
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
    const verdict = assessment.o1.verdict;
    const score = known<string>(profile.creditScoreBand);
    const years = known<number>(profile.yearsAtCurrentEmployer);
    const collateral = known<number>(profile.unencumberedCollateralValue);
    const requested = known<number>(profile.requestedAmount) ?? 0;
    const safeCap = assessment.o2.safeBorrowerCapacity;
    const highCostApr = known<number>(profile.highCostDebtApr);
    const debtDescription = highCostApr ? `high-cost credit (${highCostApr}% APR)` : 'high-cost debt';

    if (verdict === 'RESTRUCTURE_FIRST' || verdict === 'DONT_BORROW' || safeCap === 0) {
      return `I am currently prioritizing restructuring and clearing my existing ${debtDescription} before taking on any new unsecured borrowing. For essential mobility or asset requirements, I am only exploring structured, subsidized schemes (targeting ${pct(assessment.o3.fairRateMin)}–${pct(assessment.o3.fairRateMax)}) and will not accept high-cost digital app credit.`;
    }

    if (verdict === 'BORROW_LESS') {
      const scoreText = score === 'PRIME_750_PLUS' ? 'My credit score is prime (750+)' : score === 'GOOD_700_749' ? 'My credit score is good (700-749)' : score === 'FAIR_650_699' ? 'My credit score is fair' : 'My credit profile is verifiable';
      const stabilityText = years && years > 0 ? ` with ${years} year${years > 1 ? 's' : ''} at my current employer` : '';
      return `I am seeking a capped sanction of ${money(safeCap)} (from an original ${money(requested)} request). ${scoreText}${stabilityText}. My estimated fair range is ${pct(assessment.o3.fairRateMin)}–${pct(assessment.o3.fairRateMax)} based on this assessment. If you can match around ${pct(assessment.o3.nominalRateUsedForApr)} with processing fees capped at ${pct(assessment.o3.processingFeePercent)}, I am prepared to finalize today. I do not require bundled insurance.`;
    }

    // Default BORROW verdict
    const collateralText = collateral && collateral > 0 ? ` against unencumbered commercial property valued at approximately ${money(collateral)}` : '';
    const pathwayName = pathwayLabel(assessment.o3.pathway);
    return `I am applying for a ${money(requested || safeCap)} credit line under ${pathwayName}${collateralText}. For this asset profile, my estimated fair range is ${pct(assessment.o3.fairRateMin)}–${pct(assessment.o3.fairRateMax)} based on this assessment. Please structure this as a term facility at ${pct(assessment.o3.nominalRateUsedForApr)} with processing fees capped at ${pct(assessment.o3.processingFeePercent)}.`;
  }, [assessment, profile]);
}
