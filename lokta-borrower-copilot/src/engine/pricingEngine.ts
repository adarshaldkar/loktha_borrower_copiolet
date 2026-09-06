import type { BorrowerProfile, ProductPathway, RateAdjustment, RuleConfig } from '../types';
import { calculateAllInApr, calculateEmi, roundRate } from './math';
import { routeProduct } from './capacityEngine';

export interface PricingResult {
  pathway: ProductPathway;
  fairRateMin: number;
  fairRateMax: number;
  nominalRateUsedForApr: number;
  processingFeePercent: number;
  documentationFee: number;
  upfrontCharges: number;
  netDisbursement: number;
  allInApr: number;
  pricingConfidenceNote: string;
}

function known<T>(field: any): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

function rateRuleFor(pathway: ProductPathway, rules: RuleConfig) {
  return rules.productBaselines[
    pathway === 'LAP_SECURED' ? 'lapSecured' :
    pathway === 'TWO_WHEELER_EV' ? 'twoWheelerEV' :
    pathway === 'BUSINESS_LOAN' ? 'businessLoan' : 'personalLoan'
  ];
}

function cibilAdjustment(profile: BorrowerProfile, rules: RuleConfig): RateAdjustment {
  const score = known<string>(profile.creditScoreBand);
  switch (score) {
    case 'PRIME_750_PLUS': return rules.cibilAdjustments.prime750Plus;
    case 'GOOD_700_749': return rules.cibilAdjustments.good700To749;
    case 'FAIR_650_699': return rules.cibilAdjustments.fair650To699;
    case 'SUBPRIME_UNDER_650': return rules.cibilAdjustments.subprimeLow;
    default: return rules.cibilAdjustments.unknownScore;
  }
}

export function calculatePricing(profile: BorrowerProfile, rules: RuleConfig): PricingResult {
  const pathway = routeProduct(profile);
  const product = rateRuleFor(pathway, rules);
  const adjustment = cibilAdjustment(profile, rules);
  const yearsAtEmployer = known<number>(profile.yearsAtCurrentEmployer) ?? 0;
  const collateral = known<number>(profile.unencumberedCollateralValue) ?? 0;
  const stabilityDiscount = yearsAtEmployer >= 3 ? 0.5 : 0;
  const collateralDiscount = pathway === 'LAP_SECURED' && collateral > 0 ? 1.0 : 0;

  let min = product.minRate + adjustment.rateDelta - stabilityDiscount - collateralDiscount;
  let max = product.maxRate + adjustment.rateDelta - stabilityDiscount - collateralDiscount;

  if (known<string>(profile.creditScoreBand) === 'UNKNOWN') {
    min -= 0.5;
    max += adjustment.spreadWidth * 0.5;
  }

  min = roundRate(Math.max(0, min));
  max = roundRate(Math.max(min, max));
  const nominalRate = roundRate((min + max) / 2);

  const amount = Math.max(0, known<number>(profile.requestedAmount) ?? 0);
  const productFee = product.defaultFeePercent;
  const processingFee = amount * productFee / 100;
  const documentationFee = rules.fees.defaultDocumentationFee;
  const upfrontCharges = processingFee * (1 + rules.fees.gstOnProcessingFeePercent / 100) + documentationFee;
  const netDisbursement = Math.max(0, amount - upfrontCharges);
  const tenure = pathway === 'LAP_SECURED' ? 84 : 36;
  const emi = calculateEmi(amount, nominalRate, tenure);
  const allInApr = calculateAllInApr(netDisbursement, emi, tenure);

  const pricingConfidenceNote = known<string>(profile.creditScoreBand) === 'UNKNOWN'
    ? 'Unverified credit score expands the fair-rate uncertainty band.'
    : 'Rate band reflects profile benchmarks and stability adjustments.';

  return {
    pathway,
    fairRateMin: min,
    fairRateMax: max,
    nominalRateUsedForApr: nominalRate,
    processingFeePercent: productFee,
    documentationFee,
    upfrontCharges: Math.round(upfrontCharges),
    netDisbursement: Math.round(netDisbursement),
    allInApr: roundRate(allInApr),
    pricingConfidenceNote,
  };
}
