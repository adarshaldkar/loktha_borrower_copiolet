import type { BorrowerProfile } from '../types';
import { EMPTY_PROFILE } from '../questionnaire/schema';

export interface PersonaPreset {
  id: 'priya' | 'ravi' | 'anita';
  name: string;
  subtitle: string;
  tone: 'good' | 'watch' | 'stop';
  profile: BorrowerProfile;
}

const known = <T>(value: T) => ({ status: 'KNOWN' as const, value });

export const PERSONAS: PersonaPreset[] = [
  {
    id: 'priya', name: 'Priya', subtitle: '29 · Salaried MNC · Bengaluru', tone: 'good',
    profile: {
      ...EMPTY_PROFILE,
      age: known(29),
      employmentType: known('SALARIED_MNC'),
      loanPurpose: known('WEDDING_LIFESTYLE'),
      requestedAmount: known(800000),
      monthlyTakeHomeIncome: known(110000),
      existingMonthlyEmis: known(14000),
      essentialLivingCosts: known(28000),
      creditScoreBand: known('PRIME_750_PLUS'),
      yearsAtCurrentEmployer: known(5),
      employerCategory: known('MNC'),
      emergencySavingsMonths: known(4),
      coApplicantMonthlyIncome: { status: 'NOT_APPLICABLE' },
    },
  },
  {
    id: 'ravi', name: 'Ravi', subtitle: '42 · Kirana owner · Mysuru', tone: 'watch',
    profile: {
      ...EMPTY_PROFILE,
      age: known(42),
      employmentType: known('SELF_EMPLOYED_BUSINESS'),
      loanPurpose: known('KIRANA_STOCK_VEHICLE'),
      requestedAmount: known(1500000),
      monthlyTakeHomeIncome: known(60000),
      existingMonthlyEmis: known(0),
      essentialLivingCosts: known(18000),
      creditScoreBand: known('UNKNOWN'),
      documentedMonthlyProfit: known(35000),
      unencumberedCollateralValue: known(4500000),
      emergencySavingsMonths: known(3),
      productiveMonthlyIncomePotential: known(12000),
      coApplicantMonthlyIncome: known(18000),
    },
  },
  {
    id: 'anita', name: 'Anita', subtitle: '35 · Informal gig · Hubballi', tone: 'stop',
    profile: {
      ...EMPTY_PROFILE,
      age: known(35),
      employmentType: known('INFORMAL_GIG'),
      loanPurpose: known('TWO_WHEELER_EV'),
      requestedAmount: known(150000),
      monthlyTakeHomeIncome: known(28000),
      existingMonthlyEmis: known(3500),
      essentialLivingCosts: known(16000),
      creditScoreBand: known('UNKNOWN'),
      highCostDebtApr: known(30),
      recentEmiBounce: known(true),
      emergencySavingsMonths: known(0),
      productiveMonthlyIncomePotential: known(7000),
    },
  },
];

export function personaById(id: PersonaPreset['id']): PersonaPreset {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
