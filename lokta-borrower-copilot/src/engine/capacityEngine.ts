import type { BorrowerProfile, ProductPathway, RuleConfig } from '../types';
import { calculateEmi, presentValueFromEmi, roundCurrency } from './math';
import { normalizeBorrower, safeFoirCap } from './normalizer';

export interface CapacityResult {
  pathway: ProductPathway;
  lenderSanction: number;
  safeBorrowerCapacity: number;
  maxLenderEmi: number;
  maxSafeEmi: number;
  idealTenureMonths: number;
  guidance: string;
}

function known<T>(field: any): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

export function routeProduct(profile: BorrowerProfile): ProductPathway {
  const purpose = known<string>(profile.loanPurpose);
  const collateral = known<number>(profile.unencumberedCollateralValue) ?? 0;
  if ((purpose === 'LAP_PROPERTY' || (purpose === 'KIRANA_STOCK_VEHICLE' && collateral > 0)) && collateral > 0) {
    return 'LAP_SECURED';
  }
  if (purpose === 'TWO_WHEELER_EV') return 'TWO_WHEELER_EV';
  if (purpose === 'KIRANA_STOCK_VEHICLE') return 'BUSINESS_LOAN';
  return 'PERSONAL_LOAN';
}

function lenderRateFor(pathway: ProductPathway, rules: RuleConfig): number {
  const product = rules.productBaselines[
    pathway === 'LAP_SECURED' ? 'lapSecured' :
    pathway === 'TWO_WHEELER_EV' ? 'twoWheelerEV' :
    pathway === 'BUSINESS_LOAN' ? 'businessLoan' : 'personalLoan'
  ];
  return product.minRate;
}

export function calculateCapacities(
  profile: BorrowerProfile,
  rules: RuleConfig,
  fairRateHigh: number,
): CapacityResult {
  const normalized = normalizeBorrower(profile);
  const pathway = routeProduct(profile);
  const lenderCap = pathway === 'LAP_SECURED' ? rules.foirCaps.lenderSecuredMax : rules.foirCaps.lenderStandardMax;
  const statedIncome = Math.max(normalized.income.primaryNetIncome, normalized.income.effectiveIncome);
  const maxLenderEmi = Math.max(0, statedIncome * lenderCap - normalized.existingDebt);
  const lenderTenure = pathway === 'LAP_SECURED' ? 120 : 60;
  let lenderSanction = presentValueFromEmi(maxLenderEmi, lenderRateFor(pathway, rules), lenderTenure);

  const collateral = Math.max(0, known<number>(profile.unencumberedCollateralValue) ?? 0);
  if (pathway === 'LAP_SECURED' && collateral > 0) {
    lenderSanction = Math.min(lenderSanction, collateral * 0.5);
  }

  const safeCap = safeFoirCap(profile);
  const maxByFoir = Math.max(0, normalized.income.effectiveIncome * safeCap - normalized.existingDebt);
  const maxBySurplus = Math.max(0, normalized.monthlyCashSurplus * rules.affordability.surplusRetainedPercent);
  const maxSafeEmi = Math.max(0, Math.min(maxByFoir, maxBySurplus));
  const idealTenureMonths = pathway === 'LAP_SECURED' ? 84 : 36;
  const safeBorrowerCapacity = roundCurrency(presentValueFromEmi(maxSafeEmi, fairRateHigh, idealTenureMonths));

  const guidance = safeBorrowerCapacity < lenderSanction
    ? `The estimated lender-side capacity is ₹${Math.round(lenderSanction).toLocaleString('en-IN')}, but the safer borrower capacity is ₹${Math.round(safeBorrowerCapacity).toLocaleString('en-IN')}. Use the safer number.`
    : 'The estimated lender-side capacity is not materially above the safer borrower capacity under the current assumptions.';

  return {
    pathway,
    lenderSanction: roundCurrency(lenderSanction),
    safeBorrowerCapacity,
    maxLenderEmi: roundCurrency(maxLenderEmi),
    maxSafeEmi: roundCurrency(maxSafeEmi),
    idealTenureMonths,
    guidance,
  };
}

export function calculateRequestedEmi(profile: BorrowerProfile, fairRate: number, tenureMonths: number): number {
  const amount = known<number>(profile.requestedAmount) ?? 0;
  return roundCurrency(calculateEmi(amount, fairRate, tenureMonths));
}
