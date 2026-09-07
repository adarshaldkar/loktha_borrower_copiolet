import { DEFAULT_RULES } from '../config/rules.config';
import type { BorrowerProfile, ConfidenceState, RuleConfig } from '../types';

export function calculateConfidence(profile: BorrowerProfile, rules: RuleConfig = DEFAULT_RULES): ConfidenceState {
  const flags: string[] = [];
  const creditBand = profile.creditScoreBand.status === 'KNOWN' ? profile.creditScoreBand.value : 'UNKNOWN';
  const employment = profile.employmentType.status === 'KNOWN' ? profile.employmentType.value : undefined;
  const recentBounce = profile.recentEmiBounce?.status === 'KNOWN' && profile.recentEmiBounce.value === true;
  const hasHighCostDebt = profile.highCostDebtApr?.status === 'KNOWN' && (profile.highCostDebtApr.value ?? 0) > rules.stressScenarios.highCostDebtAprThreshold;
  const emergencyMonths = profile.emergencySavingsMonths?.status === 'KNOWN' ? profile.emergencySavingsMonths.value : undefined;

  const isInformal = employment === 'INFORMAL_GIG';
  const isCreditUnknown = creditBand === 'UNKNOWN' || profile.creditScoreBand.status !== 'KNOWN';
  const isSelfEmployed = employment === 'SELF_EMPLOYED_BUSINESS';
  const missingProfit = isSelfEmployed && profile.documentedMonthlyProfit?.status !== 'KNOWN';

  if (isInformal) flags.push('informal income is volatile');
  if (isCreditUnknown) flags.push('credit history is unknown');
  if (recentBounce) flags.push('recent repayment stress is present');
  if (missingProfit) flags.push('undocumented business profits');
  if (hasHighCostDebt) flags.push('active high-cost debt');

  const hasCollateral = profile.unencumberedCollateralValue?.status === 'KNOWN' && (profile.unencumberedCollateralValue.value ?? 0) > 0;
  const hasDocumentedProfit = profile.documentedMonthlyProfit?.status === 'KNOWN' && (profile.documentedMonthlyProfit.value ?? 0) > 0;

  if (isInformal && isCreditUnknown && recentBounce) {
    return {
      rating: 'LOW',
      confidenceReason: 'Informal income is volatile, credit history is unknown, and recent repayment stress is present.',
    };
  }
  
  if (isInformal && (isCreditUnknown || recentBounce || hasHighCostDebt || flags.length >= 3)) {
    return {
      rating: 'LOW',
      confidenceReason: 'Informal income is volatile, credit history is unknown, and recent repayment stress limits the reliability of this estimate.',
    };
  }

  if (hasDocumentedProfit && hasCollateral && isCreditUnknown) {
    return {
      rating: 'MEDIUM',
      confidenceReason: 'Business cashflow and property collateral are documented, but unverified formal credit score widens rate uncertainty.',
    };
  }

  if (isCreditUnknown || isInformal || isSelfEmployed || emergencyMonths === 0 || flags.length > 0) {
    return {
      rating: 'MEDIUM',
      confidenceReason: `Estimate carries moderate uncertainty: ${flags.join(', ') || 'unverified secondary factors'}.`,
    };
  }

  return {
    rating: 'HIGH',
    confidenceReason: 'Stable salaried income, known prime credit band and employment history are available.',
  };
}
