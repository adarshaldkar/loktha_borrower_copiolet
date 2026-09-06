export type EmploymentType =
  | 'SALARIED_MNC'
  | 'SALARIED_SME'
  | 'SELF_EMPLOYED_BUSINESS'
  | 'INFORMAL_GIG';

export type LoanPurpose =
  | 'WEDDING_LIFESTYLE'
  | 'GENERAL_PERSONAL'
  | 'KIRANA_STOCK_VEHICLE'
  | 'TWO_WHEELER_EV'
  | 'LAP_PROPERTY';

export type CreditScoreBand =
  | 'PRIME_750_PLUS'
  | 'GOOD_700_749'
  | 'FAIR_650_699'
  | 'SUBPRIME_UNDER_650'
  | 'UNKNOWN';

export type FieldStatus = 'KNOWN' | 'UNKNOWN' | 'NOT_APPLICABLE';

export type ConfidenceRating = 'HIGH' | 'MEDIUM' | 'LOW';

export type Verdict =
  | 'BORROW'
  | 'BORROW_LESS'
  | 'DONT_BORROW'
  | 'RESTRUCTURE_FIRST';

export type ProductPathway =
  | 'PERSONAL_LOAN'
  | 'LAP_SECURED'
  | 'TWO_WHEELER_EV'
  | 'BUSINESS_LOAN';

export interface KnownValue<T> {
  status: 'KNOWN';
  value: T;
}

export interface UnknownValue {
  status: 'UNKNOWN';
}

export interface NotApplicableValue {
  status: 'NOT_APPLICABLE';
}

export type FieldValue<T> = KnownValue<T> | UnknownValue | NotApplicableValue;

export interface BorrowerProfile {
  age: FieldValue<number>;
  employmentType: FieldValue<EmploymentType>;
  loanPurpose: FieldValue<LoanPurpose>;
  requestedAmount: FieldValue<number>;
  monthlyTakeHomeIncome: FieldValue<number>;
  existingMonthlyEmis: FieldValue<number>;
  essentialLivingCosts: FieldValue<number>;
  creditScoreBand: FieldValue<CreditScoreBand>;

  yearsAtCurrentEmployer?: FieldValue<number>;
  employerCategory?: FieldValue<'MNC' | 'GOVERNMENT' | 'SME_STARTUP'>;
  documentedMonthlyProfit?: FieldValue<number>;
  unencumberedCollateralValue?: FieldValue<number>;
  highCostDebtApr?: FieldValue<number>;
  recentEmiBounce?: FieldValue<boolean>;
  emergencySavingsMonths?: FieldValue<number>;
  productiveMonthlyIncomePotential?: FieldValue<number>;
  coApplicantMonthlyIncome?: FieldValue<number>;
}

export interface ConfidenceState {
  rating: ConfidenceRating;
  confidenceReason: string;
}

export interface RuleConfig {
  foirCaps: {
    salariedSafe: number;
    informalSafe: number;
    lenderStandardMax: number;
    lenderSecuredMax: number;
    projectedFoirCap: number;
    existingFoirCap: number;
  };
  ltvCaps: {
    lapSecured: number;
  };
  incomeHaircuts: {
    salaried: number;
    informal: number;
    selfEmployed: number;
    selfReportedCashflow: number;
    coApplicant: number;
  };
  productBaselines: {
    personalLoan: ProductRateRule;
    lapSecured: ProductRateRule;
    twoWheelerEV: ProductRateRule;
    businessLoan: ProductRateRule;
  };
  cibilAdjustments: {
    prime750Plus: RateAdjustment;
    good700To749: RateAdjustment;
    fair650To699: RateAdjustment;
    subprimeLow: RateAdjustment;
    unknownScore: RateAdjustment;
  };
  stressScenarios: {
    incomeShockPercent: number;
    rateShockBps: number;
    highCostDebtAprThreshold: number;
  };
  fees: {
    defaultProcessingFeePercent: number;
    gstOnProcessingFeePercent: number;
    defaultDocumentationFee: number;
  };
  affordability: {
    surplusRetainedPercent: number;
    lifestyleAnnualIncomeLimit: number;
    lowSavingsFoirHaircut: number;
    productiveIncomeHaircut: number;
  };
};

export interface ProductRateRule {
  minRate: number;
  maxRate: number;
  defaultFeePercent: number;
  typicalTenuresMonths: number[];
}

export interface RateAdjustment {
  rateDelta: number;
  spreadWidth: number;
}
