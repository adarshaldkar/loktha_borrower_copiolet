/** Pure financial math helpers. All rates are expressed as annual percentages unless noted. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function monthlyRateFromAnnualPercent(annualPercent: number): number {
  return Math.max(0, annualPercent) / 100 / 12;
}

/** Present value of an ordinary annuity (monthly EMI stream). */
export function presentValueFromEmi(
  emi: number,
  annualRatePercent: number,
  months: number,
): number {
  if (emi <= 0 || months <= 0) return 0;
  const monthlyRate = monthlyRateFromAnnualPercent(annualRatePercent);
  if (monthlyRate === 0) return emi * months;
  const factor = Math.pow(1 + monthlyRate, months);
  return emi * ((factor - 1) / (monthlyRate * factor));
}

/** Monthly EMI for an amortizing loan. */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = monthlyRateFromAnnualPercent(annualRatePercent);
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * ((monthlyRate * factor) / (factor - 1));
}

/** Total interest paid over the full amortization schedule. */
export function calculateTotalInterest(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  const emi = calculateEmi(principal, annualRatePercent, months);
  return Math.max(0, emi * months - principal);
}

/**
 * Solves the monthly discount rate that equates a net disbursement to an EMI annuity.
 * Returns the annual nominal rate (monthly rate * 12), matching the specification's APR equation.
 */
export function calculateAllInApr(
  netDisbursement: number,
  emi: number,
  months: number,
): number {
  if (netDisbursement <= 0 || emi <= 0 || months <= 0) return 0;
  if (Math.abs(netDisbursement - emi * months) < 1e-9) return 0;

  // Binary search is robust for the positive-rate domain relevant to loan pricing.
  let low = -0.99;
  let high = 1;

  const pvAt = (monthlyRate: number): number => {
    if (Math.abs(monthlyRate) < 1e-12) return emi * months;
    const factor = Math.pow(1 + monthlyRate, months);
    return emi * ((1 - 1 / factor) / monthlyRate);
  };

  // Expand the upper bound if needed.
  while (pvAt(high) > netDisbursement && high < 100) high *= 2;

  for (let i = 0; i < 120; i += 1) {
    const mid = (low + high) / 2;
    const pv = pvAt(mid);
    if (pv > netDisbursement) low = mid;
    else high = mid;
  }

  return ((low + high) / 2) * 12 * 100;
}

export function roundCurrency(value: number): number {
  return Math.round(value / 100) * 100;
}

export function roundRate(value: number, decimals = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
