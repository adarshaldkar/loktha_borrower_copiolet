import type { NormalizedProfile } from './normalizer';
import type { DecisionResult } from './decisionEngine';
import type { CapacityResult } from './capacityEngine';
import type { PricingResult } from './pricingEngine';
import type { EmiResult } from './emiEngine';

export interface ExplanationTrace {
  id: string;
  label: string;
  value: string;
  reason: string;
  math: string;
}

const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const percent = (value: number) => `${value.toFixed(1)}%`;

export function buildExplainability(
  normalized: NormalizedProfile,
  decision: DecisionResult,
  capacity: CapacityResult,
  pricing: PricingResult,
  emi: EmiResult,
): ExplanationTrace[] {
  return [
    {
      id: 'o1',
      label: 'O1 Decision',
      value: decision.verdict,
      reason: decision.reason,
      math: `Current FOIR ${percent(normalized.currentFoir)}; projected FOIR ${percent(decision.projectedFoir)}; monthly surplus ${money(normalized.monthlyCashSurplus)}.`,
    },
    {
      id: 'o2-lender',
      label: 'Estimated lender capacity',
      value: money(capacity.lenderSanction),
      reason: `Illustrative lender-side capacity using the configured lender FOIR cap for the ${capacity.pathway.replaceAll('_', ' ')} pathway.`,
      math: `Max lender EMI ${money(capacity.maxLenderEmi)} → PV at configured lender rate and tenure.`,
    },
    {
      id: 'o2-safe',
      label: 'Safe borrower capacity',
      value: money(capacity.safeBorrowerCapacity),
      reason: `Limited by the lower of safe FOIR capacity and ${Math.round(100 * (1 - 0.6))}% retained surplus logic.`,
      math: `Max safe EMI ${money(capacity.maxSafeEmi)} → PV at fair-rate high end over ${capacity.idealTenureMonths} months.`,
    },
    {
      id: 'o3-rate',
      label: 'Fair rate band',
      value: `${pricing.fairRateMin.toFixed(2)}% – ${pricing.fairRateMax.toFixed(2)}%`,
      reason: pricing.pricingConfidenceNote,
      math: `Product baseline + configured profile adjustment − applicable stability/collateral discounts.`,
    },
    {
      id: 'o3-apr',
      label: 'All-in APR',
      value: `${pricing.allInApr.toFixed(2)}%`,
      reason: `Accounts for upfront processing fees, GST and documentation charges before solving the monthly IRR.`,
      math: `Net disbursement ${money(pricing.netDisbursement)} discounted against the EMI stream for ${pricing.pathway.replaceAll('_', ' ')}.`,
    },
    {
      id: 'o4-emi',
      label: 'Safe EMI ceiling',
      value: money(emi.safeEmiCeiling),
      reason: `Keeps the new payment inside the configured safe debt-service ceiling while preserving a cash-surplus buffer.`,
      math: `Min(Income × Safe FOIR − existing EMI, Monthly surplus × retention factor).`,
    },
    {
      id: 'o4-stress-income',
      label: 'Income shock',
      value: `${percent(emi.stress.incomeShock.shockedFoir)} projected FOIR`,
      reason: emi.stress.incomeShock.passes ? 'The borrower remains inside the configured stress boundary.' : 'The income shock breaks the configured affordability boundary.',
      math: `Income reduced to ${money(emi.stress.incomeShock.shockedIncome)}; compare shocked FOIR and surplus.`,
    },
  ];
}
