import type { BorrowerProfile, RuleConfig, Verdict } from '../types';
import { calculateEmi } from './math';
import { normalizeBorrower, safeFoirCap } from './normalizer';

export interface DecisionResult {
  verdict: Verdict;
  reason: string;
  priority: number;
  flags: string[];
  projectedFoir: number;
  safeFoirCap: number;
}

function known<T>(field: { status: 'KNOWN'; value: T } | { status: 'UNKNOWN' } | { status: 'NOT_APPLICABLE' } | undefined): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

export function evaluateDecision(profile: BorrowerProfile, rules: RuleConfig, fairRateHigh: number): DecisionResult {
  const normalized = normalizeBorrower(profile);
  const requested = known(profile.requestedAmount) ?? 0;
  const purpose = known(profile.loanPurpose);
  const income = normalized.income.effectiveIncome;
  const existingFoir = normalized.currentFoir;
  const currentSurplus = normalized.monthlyCashSurplus;
  const highCostApr = known(profile.highCostDebtApr);
  const recentBounce = known(profile.recentEmiBounce) ?? false;
  const requestedTenure = purpose === 'LAP_PROPERTY' ? 84 : 36;
  const requestedEmi = calculateEmi(requested, fairRateHigh, requestedTenure);
  const projectedFoir = income > 0 ? (normalized.existingDebt + requestedEmi) / income : Infinity;
  const safeCap = safeFoirCap(profile);

  const flags: string[] = [];

  if (highCostApr !== undefined && highCostApr > 24 && recentBounce) {
    flags.push('HIGH_COST_DEBT_WITH_RECENT_BOUNCE');
    return {
      verdict: 'RESTRUCTURE_FIRST',
      reason: 'Recent repayment stress combined with high-cost debt makes new unsecured borrowing unsafe.',
      priority: 1,
      flags,
      projectedFoir,
      safeFoirCap: safeCap,
    };
  }

  if (existingFoir >= 0.5 || currentSurplus <= 0) {
    flags.push(existingFoir >= 0.5 ? 'CURRENT_FOIR_HIGH' : 'NON_POSITIVE_SURPLUS');
    return {
      verdict: 'DONT_BORROW',
      reason: 'Existing debt burden or essential outflows leave too little monthly capacity for another loan.',
      priority: 2,
      flags,
      projectedFoir,
      safeFoirCap: safeCap,
    };
  }

  const annualIncome = income * 12;
  const lifestyleAskTooLarge =
    (purpose === 'WEDDING_LIFESTYLE' || purpose === 'GENERAL_PERSONAL') && requested > annualIncome * rules.affordability.lifestyleAnnualIncomeLimit;

  if (projectedFoir > 0.4 || lifestyleAskTooLarge) {
    if (projectedFoir > 0.4) flags.push('PROJECTED_FOIR_ABOVE_40');
    if (lifestyleAskTooLarge) flags.push('LIFESTYLE_LOAN_ABOVE_ANNUAL_INCOME_LIMIT');
    return {
      verdict: 'BORROW_LESS',
      reason: projectedFoir > 0.4
        ? 'The requested loan would push total debt service above the conservative affordability range.'
        : 'The requested amount is large relative to annual income for a non-productive personal expense.',
      priority: 3,
      flags,
      projectedFoir,
      safeFoirCap: safeCap,
    };
  }

  return {
    verdict: 'BORROW',
    reason: 'The requested loan stays within the configured affordability checks and current cashflow is positive.',
    priority: 4,
    flags,
    projectedFoir,
    safeFoirCap: safeCap,
  };
}
