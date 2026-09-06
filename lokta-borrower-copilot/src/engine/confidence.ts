import type { BorrowerProfile, ConfidenceState } from '../types';

export function calculateConfidence(profile: BorrowerProfile): ConfidenceState {
  const missing: string[] = [];

  if (profile.creditScoreBand.status !== 'KNOWN') missing.push('credit score');
  if (profile.emergencySavingsMonths?.status !== 'KNOWN') missing.push('emergency savings');
  if (profile.employmentType.status === 'KNOWN' && profile.employmentType.value === 'SELF_EMPLOYED_BUSINESS' && profile.documentedMonthlyProfit?.status !== 'KNOWN') {
    missing.push('documented business income');
  }
  if (profile.monthlyTakeHomeIncome.status !== 'KNOWN') missing.push('monthly income');
  if (profile.essentialLivingCosts.status !== 'KNOWN') missing.push('essential living costs');

  if (missing.length === 0) {
    return { rating: 'HIGH', confidenceReason: 'Core affordability, credit and income-stability inputs are available.' };
  }
  if (missing.length <= 2) {
    return { rating: 'MEDIUM', confidenceReason: `Some inputs are missing: ${missing.join(', ')}.` };
  }
  return { rating: 'LOW', confidenceReason: `Several inputs are missing: ${missing.join(', ')}.` };
}
