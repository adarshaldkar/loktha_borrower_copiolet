import type { BorrowerProfile, EmploymentType, FieldValue } from '../types';

export type QuestionKind = 'select' | 'currency' | 'number' | 'boolean' | 'months';

export interface QuestionOption<T extends string> {
  label: string;
  value: T;
}

export interface QuestionNode<K extends keyof BorrowerProfile = keyof BorrowerProfile> {
  id: string;
  key: K;
  title: string;
  helper?: string;
  kind: QuestionKind;
  required: boolean;
  tier: 1 | 2;
  branch?: 'SALARIED' | 'SELF_EMPLOYED' | 'INFORMAL' | 'COMMON';
  showWhen?: (profile: BorrowerProfile) => boolean;
  options?: QuestionOption<string>[];
  min?: number;
  max?: number;
}

export const EMPTY_PROFILE: BorrowerProfile = {
  age: { status: 'UNKNOWN' },
  employmentType: { status: 'UNKNOWN' },
  loanPurpose: { status: 'UNKNOWN' },
  requestedAmount: { status: 'UNKNOWN' },
  monthlyTakeHomeIncome: { status: 'UNKNOWN' },
  existingMonthlyEmis: { status: 'UNKNOWN' },
  essentialLivingCosts: { status: 'UNKNOWN' },
  creditScoreBand: { status: 'UNKNOWN' },
};

export const QUESTION_NODES: QuestionNode[] = [
  {
    id: 'purpose', key: 'loanPurpose', title: 'What is the loan for?',
    helper: 'Your purpose affects product pathway and the borrow / borrow-less assessment.',
    kind: 'select', required: true, tier: 1,
    options: [
      { label: 'Wedding / personal lifestyle', value: 'WEDDING_LIFESTYLE' },
      { label: 'General personal need', value: 'GENERAL_PERSONAL' },
      { label: 'Kirana stock + delivery vehicle', value: 'KIRANA_STOCK_VEHICLE' },
      { label: 'Electric two-wheeler / EV', value: 'TWO_WHEELER_EV' },
      { label: 'Loan against property', value: 'LAP_PROPERTY' },
      { label: 'Home purchase / construction', value: 'HOME_PURCHASE' },
      { label: 'Gold jewellery / gold loan', value: 'GOLD_JEWELLERY' },
    ],
  },
  {
    id: 'requestedAmount', key: 'requestedAmount', title: 'How much do you want to borrow?',
    helper: 'Enter the amount you would actually request from the lender.', kind: 'currency', required: true, tier: 1, min: 1,
  },
  {
    id: 'employment', key: 'employmentType', title: 'How do you earn your primary income?',
    helper: 'Choose the closest fit. This determines the follow-up questions you see.', kind: 'select', required: true, tier: 1,
    options: [
      { label: 'Salaried — MNC / large corporation', value: 'SALARIED_MNC' },
      { label: 'Salaried — SME / startup', value: 'SALARIED_SME' },
      { label: 'Self-employed / business', value: 'SELF_EMPLOYED_BUSINESS' },
      { label: 'Informal / gig work', value: 'INFORMAL_GIG' },
    ],
  },
  {
    id: 'income', key: 'monthlyTakeHomeIncome', title: 'What is your monthly take-home income?',
    helper: 'Use the amount that reliably reaches you after normal deductions.', kind: 'currency', required: true, tier: 1, min: 0,
  },
  {
    id: 'existingEmis', key: 'existingMonthlyEmis', title: 'How much do you already pay in EMIs each month?',
    helper: 'Include active loan EMIs and minimum recurring credit-card dues.', kind: 'currency', required: true, tier: 1, min: 0,
  },
  {
    id: 'livingCosts', key: 'essentialLivingCosts', title: 'What are your essential monthly living costs?',
    helper: 'Include rent, groceries, utilities, education and healthcare — not discretionary shopping.', kind: 'currency', required: true, tier: 1, min: 0,
  },
  {
    id: 'age', key: 'age', title: 'How old are you?', kind: 'number', required: true, tier: 1, min: 18, max: 80,
  },
  {
    id: 'cibil', key: 'creditScoreBand', title: 'What is your CIBIL / credit score?',
    helper: 'Do not guess. “I don’t know” stays UNKNOWN and widens uncertainty.', kind: 'select', required: true, tier: 1,
    options: [
      { label: '750+ (Prime)', value: 'PRIME_750_PLUS' },
      { label: '700–749 (Good)', value: 'GOOD_700_749' },
      { label: '650–699 (Fair)', value: 'FAIR_650_699' },
      { label: 'Below 650', value: 'SUBPRIME_UNDER_650' },
      { label: 'I don’t know', value: 'UNKNOWN' },
    ],
  },
  {
    id: 'yearsAtEmployer', key: 'yearsAtCurrentEmployer', title: 'How many years have you been with your current employer?',
    helper: 'Longer stable employment can tighten the rate range.', kind: 'number', required: false, tier: 2, branch: 'SALARIED',
    showWhen: p => isEmployment(p, 'SALARIED_MNC', 'SALARIED_SME'), min: 0, max: 60,
  },
  {
    id: 'employerCategory', key: 'employerCategory', title: 'What type of employer is it?',
    helper: 'This is a prototype stability proxy, not a lender guarantee.', kind: 'select', required: false, tier: 2, branch: 'SALARIED',
    showWhen: p => isEmployment(p, 'SALARIED_MNC', 'SALARIED_SME'),
    options: [
      { label: 'MNC / large corporate', value: 'MNC' },
      { label: 'Government / public sector', value: 'GOVERNMENT' },
      { label: 'SME / startup', value: 'SME_STARTUP' },
    ],
  },
  {
    id: 'itrProfit', key: 'documentedMonthlyProfit', title: 'What monthly profit is shown by your ITR / business records?',
    helper: 'Enter documented monthly profit, not gross sales.', kind: 'currency', required: false, tier: 2, branch: 'SELF_EMPLOYED',
    showWhen: p => isEmployment(p, 'SELF_EMPLOYED_BUSINESS'), min: 0,
  },
  {
    id: 'collateral', key: 'unencumberedCollateralValue', title: 'Do you have unencumbered property you could pledge?',
    helper: 'Enter a conservative current value only if there is no existing charge.', kind: 'currency', required: false, tier: 2, branch: 'SELF_EMPLOYED',
    showWhen: p => isEmployment(p, 'SELF_EMPLOYED_BUSINESS'), min: 0,
  },
  {
    id: 'highCostDebt', key: 'highCostDebtApr', title: 'What is the approximate APR on your highest-cost existing debt?',
    helper: 'Think app loans / revolving debt. Use UNKNOWN rather than guessing.', kind: 'number', required: false, tier: 2, branch: 'INFORMAL',
    showWhen: p => isEmployment(p, 'INFORMAL_GIG'), min: 0, max: 100,
  },
  {
    id: 'recentBounce', key: 'recentEmiBounce', title: 'Have you had an EMI bounce / missed payment in the last 6 months?',
    helper: 'This is a safety signal and can override otherwise affordable borrowing.', kind: 'boolean', required: false, tier: 2, branch: 'INFORMAL',
    showWhen: p => isEmployment(p, 'INFORMAL_GIG'),
  },
  {
    id: 'emergencySavings', key: 'emergencySavingsMonths', title: 'How many months of essential expenses do you have in emergency savings?',
    helper: 'Use liquid savings you could access for an unexpected income or health shock.', kind: 'months', required: false, tier: 2, branch: 'COMMON', min: 0, max: 36,
  },
  {
    id: 'productiveIncome', key: 'productiveMonthlyIncomePotential', title: 'How much additional monthly income could the loan-funded asset/business generate?',
    helper: 'Use a conservative estimate. Leave it unknown if you cannot defend the number.', kind: 'currency', required: false, tier: 2, branch: 'COMMON',
    showWhen: p => isProductivePurpose(p), min: 0,
  },
  {
    id: 'coApplicant', key: 'coApplicantMonthlyIncome', title: 'What monthly income could a co-applicant contribute?',
    helper: 'Only include income you expect to be formally included in the application.', kind: 'currency', required: false, tier: 2, branch: 'COMMON', min: 0,
  },
];

export function getVisibleQuestions(profile: BorrowerProfile, includeTier2 = true): QuestionNode[] {
  return QUESTION_NODES.filter((question) => {
    if (!includeTier2 && question.tier === 2) return false;
    return question.showWhen ? question.showWhen(profile) : true;
  });
}

function isEmployment(profile: BorrowerProfile, ...types: EmploymentType[]): boolean {
  return profile.employmentType.status === 'KNOWN' && types.includes(profile.employmentType.value);
}

function isProductivePurpose(profile: BorrowerProfile): boolean {
  if (profile.loanPurpose.status !== 'KNOWN') return false;
  return profile.loanPurpose.value === 'KIRANA_STOCK_VEHICLE' || profile.loanPurpose.value === 'TWO_WHEELER_EV';
}

export function toFieldValue<T>(value: T | undefined | null): FieldValue<T> {
  if (value === undefined || value === null || value === '') return { status: 'UNKNOWN' };
  return { status: 'KNOWN', value };
}

export function clearBranchFields(profile: BorrowerProfile): BorrowerProfile {
  const next = { ...profile };
  const employment = profile.employmentType.status === 'KNOWN' ? profile.employmentType.value : undefined;
  if (!employment || !['SALARIED_MNC', 'SALARIED_SME'].includes(employment)) {
    next.yearsAtCurrentEmployer = undefined;
    next.employerCategory = undefined;
  }
  if (employment !== 'SELF_EMPLOYED_BUSINESS') {
    next.documentedMonthlyProfit = undefined;
    next.unencumberedCollateralValue = undefined;
  }
  if (employment !== 'INFORMAL_GIG') {
    next.highCostDebtApr = undefined;
    next.recentEmiBounce = undefined;
  }
  return next;
}
