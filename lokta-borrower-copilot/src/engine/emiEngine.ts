import type { BorrowerProfile, RuleConfig } from '../types';
import { calculateEmi, calculateTotalInterest, roundCurrency, roundRate } from './math';
import { normalizeBorrower } from './normalizer';

export interface TenureRow {
  months: number;
  emi: number;
  totalInterest: number;
  totalOutflow: number;
}

export interface StressResult {
  incomeShock: {
    shockedIncome: number;
    shockedFoir: number;
    shockedSurplus: number;
    passes: boolean;
  };
  rateShock: {
    shockedRate: number;
    shockedEmi: number;
    emiIncrease: number;
    surplusAfterShock: number;
    passes: boolean;
  };
}

export interface EmiResult {
  safeEmiCeiling: number;
  chosenAmount: number;
  tenureRows: TenureRow[];
  stress: StressResult;
}

function known<T>(field: any): T | undefined {
  return field?.status === 'KNOWN' ? field.value : undefined;
}

export function calculateEmiOutput(
  profile: BorrowerProfile,
  rules: RuleConfig,
  fairRate: number,
  safeEmiCeiling: number,
): EmiResult {
  const normalized = normalizeBorrower(profile, rules);
  const amount = Math.max(0, known<number>(profile.requestedAmount) ?? 0);
  const tenures = [24, 36, 60];
  const tenureRows = tenures.map((months) => {
    const emi = calculateEmi(amount, fairRate, months);
    const totalInterest = calculateTotalInterest(amount, fairRate, months);
    return {
      months,
      emi: roundCurrency(emi),
      totalInterest: roundCurrency(totalInterest),
      totalOutflow: roundCurrency(amount + totalInterest),
    };
  });

  const incomeShockPercent = rules.stressScenarios.incomeShockPercent;
  const shockedIncome = normalized.income.effectiveIncome * (1 - incomeShockPercent);
  const shockedFoir = shockedIncome > 0
    ? (normalized.existingDebt + safeEmiCeiling) / shockedIncome
    : Infinity;
  const shockedSurplus = shockedIncome - normalized.existingDebt - safeEmiCeiling - normalized.livingCosts;

  const shockedRate = fairRate + rules.stressScenarios.rateShockBps / 100;
  
  const baselineAmount = amount > 0 ? amount : safeEmiCeiling * 36;
  const affordableRow = tenureRows.find(row => row.emi <= safeEmiCeiling) || tenureRows[1] || tenureRows[0];
  const shockTenure = affordableRow.months;
  
  const shockedEmi = calculateEmi(baselineAmount, shockedRate, shockTenure);
  const baseEmi = calculateEmi(baselineAmount, fairRate, shockTenure);
  const emiIncrease = Math.max(0, shockedEmi - baseEmi);
  
  const surplusAfterShock = normalized.monthlyCashSurplus - shockedEmi;

  return {
    safeEmiCeiling: roundCurrency(safeEmiCeiling),
    chosenAmount: amount,
    tenureRows,
    stress: {
      incomeShock: {
        shockedIncome: roundCurrency(shockedIncome),
        shockedFoir: roundRate(shockedFoir),
        shockedSurplus: roundCurrency(shockedSurplus),
        passes: shockedFoir <= rules.foirCaps.existingFoirCap && shockedSurplus >= 0,
      },
      rateShock: {
        shockedRate: roundRate(shockedRate),
        shockedEmi: roundCurrency(shockedEmi),
        emiIncrease: roundCurrency(emiIncrease),
        surplusAfterShock: roundCurrency(surplusAfterShock),
        passes: surplusAfterShock >= 0,
      },
    },
  };
}
