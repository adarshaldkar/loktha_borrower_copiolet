import type { RuleConfig } from '../types';

/**
 * Central rule registry.
 *
 * These values are prototype assumptions derived from the current Lokta
 * specification. Regulatory and market claims should be independently
 * verified before being presented as authoritative in the final submission.
 */
export const DEFAULT_RULES: RuleConfig = {
  foirCaps: {
    salariedSafe: 0.35,
    informalSafe: 0.25,
    lenderStandardMax: 0.50,
    lenderSecuredMax: 0.60,
    projectedFoirCap: 0.40,
    existingFoirCap: 0.50,
  },

  ltvCaps: {
    lapSecured: 0.50,
  },

  incomeHaircuts: {
    salaried: 1.0,
    informal: 0.65,
    selfEmployed: 0.50,
    selfReportedCashflow: 0.50,
    coApplicant: 1.0,
  },

  productBaselines: {
    personalLoan: {
      minRate: 10.5,
      maxRate: 13.5,
      defaultFeePercent: 1.5,
      typicalTenuresMonths: [24, 36, 60],
    },
    lapSecured: {
      minRate: 8.75,
      maxRate: 10.5,
      defaultFeePercent: 0.75,
      typicalTenuresMonths: [84, 120],
    },
    twoWheelerEV: {
      minRate: 11.0,
      maxRate: 14.5,
      defaultFeePercent: 1.25,
      typicalTenuresMonths: [24, 36, 48],
    },
    businessLoan: {
      minRate: 13.5,
      maxRate: 18.0,
      defaultFeePercent: 2.0,
      typicalTenuresMonths: [24, 36, 60],
    },
    homeLoan: {
      minRate: 8.4,
      maxRate: 9.8,
      defaultFeePercent: 0.5,
      typicalTenuresMonths: [180, 240, 300],
    },
    goldLoan: {
      minRate: 9.0,
      maxRate: 12.0,
      defaultFeePercent: 0.5,
      typicalTenuresMonths: [12, 24, 36],
    },
  },

  cibilAdjustments: {
    prime750Plus: { rateDelta: -0.5, spreadWidth: 1.0 },
    good700To749: { rateDelta: 0.75, spreadWidth: 1.25 },
    fair650To699: { rateDelta: 2.5, spreadWidth: 2.0 },
    subprimeLow: { rateDelta: 5.5, spreadWidth: 3.5 },
    unknownScore: { rateDelta: 1.5, spreadWidth: 3.5 },
  },

  stressScenarios: {
    incomeShockPercent: 0.20,
    rateShockBps: 200,
    highCostDebtAprThreshold: 24,
  },

  fees: {
    defaultProcessingFeePercent: 1.5,
    gstOnProcessingFeePercent: 18.0,
    defaultDocumentationFee: 0,
  },

  affordability: {
    surplusRetainedPercent: 0.60,
    lifestyleAnnualIncomeLimit: 0.25,
    lowSavingsFoirHaircut: 0.05,
    productiveIncomeHaircut: 0.50,
  },
};
