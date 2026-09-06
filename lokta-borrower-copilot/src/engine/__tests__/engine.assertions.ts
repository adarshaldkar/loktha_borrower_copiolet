import { DEFAULT_RULES } from '../../config/rules.config';
import type { BorrowerProfile } from '../../types';
import { runAssessment } from '../assessmentEngine';

const known = <T>(value: T) => ({ status: 'KNOWN' as const, value });
const unknown = () => ({ status: 'UNKNOWN' as const });

export const TEST_PROFILES: Record<string, BorrowerProfile> = {
  priya: {
    age: known(29),
    employmentType: known('SALARIED_MNC'),
    loanPurpose: known('WEDDING_LIFESTYLE'),
    requestedAmount: known(800000),
    monthlyTakeHomeIncome: known(110000),
    existingMonthlyEmis: known(14000),
    essentialLivingCosts: known(46000),
    creditScoreBand: known('PRIME_750_PLUS'),
    yearsAtCurrentEmployer: known(5),
    employerCategory: known('MNC'),
    emergencySavingsMonths: unknown(),
  },
  ravi: {
    age: known(42),
    employmentType: known('SELF_EMPLOYED_BUSINESS'),
    loanPurpose: known('KIRANA_STOCK_VEHICLE'),
    requestedAmount: known(1500000),
    monthlyTakeHomeIncome: known(60000),
    existingMonthlyEmis: known(0),
    essentialLivingCosts: known(30000),
    creditScoreBand: unknown(),
    documentedMonthlyProfit: known(35000),
    unencumberedCollateralValue: known(4500000),
    coApplicantMonthlyIncome: known(18000),
    yearsAtCurrentEmployer: unknown(),
  },
  anita: {
    age: known(35),
    employmentType: known('INFORMAL_GIG'),
    loanPurpose: known('TWO_WHEELER_EV'),
    requestedAmount: known(150000),
    monthlyTakeHomeIncome: known(28000),
    existingMonthlyEmis: known(0),
    essentialLivingCosts: known(22000),
    creditScoreBand: unknown(),
    highCostDebtApr: known(30),
    recentEmiBounce: known(true),
    emergencySavingsMonths: known(0),
  },
};

export function runDevelopmentAssertions(): void {
  const priya = runAssessment(TEST_PROFILES.priya, DEFAULT_RULES);
  const ravi = runAssessment(TEST_PROFILES.ravi, DEFAULT_RULES);
  const anita = runAssessment(TEST_PROFILES.anita, DEFAULT_RULES);

  console.assert(priya.o2.safeBorrowerCapacity <= priya.o2.lenderSanction, 'Priya should have distinct lender vs safe capacity.');
  console.assert(ravi.o2.pathway === 'LAP_SECURED', 'Ravi should route to secured pathway.');
  console.assert(anita.o1.verdict === 'RESTRUCTURE_FIRST', 'Anita should trigger the highest-priority debt stress rule.');
  console.assert(priya.o3.fairRateMax > priya.o3.fairRateMin, 'Priya should receive a rate band.');
  console.assert(ravi.o3.fairRateMax > ravi.o3.fairRateMin, 'Unknown credit history should still produce a band.');
  console.assert(priya.o4.tenureRows.length === 3, 'Three tenure scenarios should be available.');
  console.assert(priya.explainability.length >= 6, 'Core metrics should have explainability traces.');
}
