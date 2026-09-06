import { DEFAULT_RULES } from '../config/rules.config';
import type { BorrowerProfile, RuleConfig } from '../types';
import { calculateConfidence } from './confidence';
import { calculateCapacities, type CapacityResult } from './capacityEngine';
import { evaluateDecision, type DecisionResult } from './decisionEngine';
import { calculateEmiOutput, type EmiResult } from './emiEngine';
import { buildExplainability, type ExplanationTrace } from './explainability';
import { normalizeBorrower, type NormalizedProfile } from './normalizer';
import { calculatePricing, type PricingResult } from './pricingEngine';
import type { ConfidenceState } from '../types';

export interface FullAssessment {
  o1: DecisionResult;
  o2: CapacityResult;
  o3: PricingResult;
  o4: EmiResult;
  confidence: ConfidenceState;
  explainability: ExplanationTrace[];
  normalized: NormalizedProfile;
}

export function runAssessment(profile: BorrowerProfile, rules: RuleConfig = DEFAULT_RULES): FullAssessment {
  const normalized = normalizeBorrower(profile);
  const pricing = calculatePricing(profile, rules);
  const capacity = calculateCapacities(profile, rules, pricing.fairRateMax);
  const decision = evaluateDecision(profile, rules, pricing.fairRateMax);
  const emi = calculateEmiOutput(profile, rules, pricing.nominalRateUsedForApr, capacity.maxSafeEmi);
  const confidence = calculateConfidence(profile);
  const explainability = buildExplainability(normalized, decision, capacity, pricing, emi);

  return {
    o1: decision,
    o2: capacity,
    o3: pricing,
    o4: emi,
    confidence,
    explainability,
    normalized,
  };
}
