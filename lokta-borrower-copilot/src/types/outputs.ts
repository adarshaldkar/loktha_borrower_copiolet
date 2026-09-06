import type {
  ConfidenceState,
  ProductPathway,
  Verdict,
} from './index';

export interface IncomeBreakdown {
  statedMonthlyIncome: number;
  documentedMonthlyIncome: number;
  recognizedMonthlyIncome: number;
  coApplicantRecognizedIncome: number;
  existingMonthlyDebt: number;
  essentialLivingCosts: number;
  currentDebtFoir: number; // e.g. 0.127 (12.7%)
  totalFixedBurden: number; // (Debt + Living) / Income
  monthlySurplus: number; // Disposable surplus after debt & living
}

export interface CapacityOutput {
  lenderSanctionAmount: number;
  lenderMaxMonthlyEmi: number;
  safeBorrowerCapacity: number;
  safeMonthlyEmiCeiling: number;
  guidanceText: string;
}

export interface PricingOutput {
  productPathway: ProductPathway;
  productName: string;
  minFairRate: number;
  maxFairRate: number;
  recommendedRate: number;
  isWideRangeDueToUncertainty: boolean;
  uncertaintyReason?: string;
  defaultProcessingFeePercent: number;
  processingFeeAmount: number;
  gstOnFeeAmount: number;
  totalUpfrontCharges: number;
  allInAprPercent: number;
}

export interface TenureOption {
  tenureMonths: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterestPaid: number;
  totalPayment: number;
  isRecommended: boolean;
}

export interface StressScenarioResult {
  scenarioName: string;
  description: string;
  monthlyEmiUnderStress: number;
  projectedFoirUnderStress: number;
  monthlySurplusUnderStress: number;
  isResilient: boolean;
  stressWarning?: string;
}

export interface OutflowOutput {
  maxSafeMonthlyEmi: number;
  tenureSchedules: TenureOption[];
  stressScenarios: {
    incomeShock: StressScenarioResult;
    rateShock: StressScenarioResult;
  };
}

export interface AuditStep {
  label: string;
  inputValue: string;
  ruleApplied: string;
  calculation: string;
  outputResult: string;
}

export interface ExplainabilityOutput {
  verdictReason: string;
  capacityExplanation: string;
  whyNotRequestedExplanation?: string;
  rateExplanation: string;
  emiExplanation: string;
  confidenceState: ConfidenceState;
  auditTrail: AuditStep[];
}

export interface EngineOutputs {
  verdict: Verdict;
  verdictHeadline: string;
  verdictAction: string;
  isDebtTrapWarning: boolean;
  incomeBreakdown: IncomeBreakdown;
  capacity: CapacityOutput;
  pricing: PricingOutput;
  outflow: OutflowOutput;
  explainability: ExplainabilityOutput;
}

export interface LenderQuoteInput {
  quotedAmount: number;
  quotedNominalRate: number;
  quotedTenureMonths: number;
  processingFeePercent: number;
  insuranceAmount: number;
  documentationCharges: number;
}

export interface LenderQuoteComparisonResult {
  quotedNominalRate: number;
  fairMinRate: number;
  fairMaxRate: number;
  quotedAllInApr: number;
  fairAllInApr: number;
  isRateAboveFairRange: boolean;
  rateDeltaPercent: number;
  aprDeltaPercent: number;
  totalExcessCost: number;
  evaluationVerdict: 'FAIR_OFFER' | 'ABOVE_FAIR_RANGE' | 'HIGH_COST_WARNING';
  counterOfferScript: string;
}
