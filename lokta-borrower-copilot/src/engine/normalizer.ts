import { DEFAULT_RULES } from '../config/rules.config';
import type { BorrowerProfile, FieldValue, EmploymentType } from '../types';

export interface NormalizedIncome {
  primaryNetIncome: number;
  documentedMonthlyProfit: number;
  selfReportedAdditionalCashflow: number;
  recognizedPrimaryIncome: number;
  coApplicantRecognizedIncome: number;
  effectiveIncome: number;
}

export interface NormalizedProfile {
  income: NormalizedIncome;
  existingDebt: number;
  livingCosts: number;
  currentFoir: number;
  totalFixedBurden: number;
  monthlyCashSurplus: number;
}

function known<T>(field: FieldValue<T> | undefined): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

function incomeHaircut(type: EmploymentType): number {
  switch (type) {
    case 'SALARIED_MNC':
    case 'SALARIED_SME':
      return 1;
    case 'SELF_EMPLOYED_BUSINESS':
      return 0.5;
    case 'INFORMAL_GIG':
      return 0.65;
  }
}

export function normalizeBorrower(profile: BorrowerProfile): NormalizedProfile {
  const primary = Math.max(0, known(profile.monthlyTakeHomeIncome) ?? 0);
  const debt = Math.max(0, known(profile.existingMonthlyEmis) ?? 0);
  const living = Math.max(0, known(profile.essentialLivingCosts) ?? 0);
  const employment = known(profile.employmentType) ?? 'INFORMAL_GIG';
  const documentedProfit = Math.max(0, known(profile.documentedMonthlyProfit) ?? 0);

  let recognizedPrimary = primary;
  let additionalCashflow = 0;

  if (employment === 'SELF_EMPLOYED_BUSINESS' && documentedProfit > 0) {
    additionalCashflow = Math.max(0, primary - documentedProfit);
    recognizedPrimary = documentedProfit + additionalCashflow * 0.5;
  } else if (employment === 'INFORMAL_GIG') {
    recognizedPrimary = primary * incomeHaircut(employment);
  }

  if (employment === 'SALARIED_MNC' || employment === 'SALARIED_SME') {
    recognizedPrimary = primary * incomeHaircut(employment);
  }

  const coApplicant = Math.max(0, known(profile.coApplicantMonthlyIncome) ?? 0);
  const coApplicantRecognized = coApplicant;
  const effectiveIncome = recognizedPrimary + coApplicantRecognized;

  const currentFoir = effectiveIncome > 0 ? debt / effectiveIncome : Infinity;
  const totalFixedBurden = effectiveIncome > 0 ? (debt + living) / effectiveIncome : Infinity;
  const monthlyCashSurplus = effectiveIncome - debt - living;

  return {
    income: {
      primaryNetIncome: primary,
      documentedMonthlyProfit: documentedProfit,
      selfReportedAdditionalCashflow: additionalCashflow,
      recognizedPrimaryIncome: recognizedPrimary,
      coApplicantRecognizedIncome: coApplicantRecognized,
      effectiveIncome,
    },
    existingDebt: debt,
    livingCosts: living,
    currentFoir,
    totalFixedBurden,
    monthlyCashSurplus,
  };
}

export function safeFoirCap(profile: BorrowerProfile): number {
  return known(profile.employmentType) === 'INFORMAL_GIG'
    ? DEFAULT_RULES.foirCaps.informalSafe
    : DEFAULT_RULES.foirCaps.salariedSafe;
}
