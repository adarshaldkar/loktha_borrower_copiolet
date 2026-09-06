import { create } from 'zustand';
import type { BorrowerProfile, ConfidenceState, RuleConfig } from '../types';
import { EMPTY_PROFILE, clearBranchFields } from '../questionnaire/schema';
import { DEFAULT_RULES } from '../config/rules.config';
import { runAssessment, type FullAssessment } from '../engine/assessmentEngine';
import { PERSONAS, type PersonaPreset } from '../data/personas';

interface BorrowerState {
  profile: BorrowerProfile;
  assessment: FullAssessment | null;
  rules: RuleConfig;
  activePersona: PersonaPreset['id'] | 'custom' | null;
  setField: <K extends keyof BorrowerProfile>(key: K, value: BorrowerProfile[K]) => void;
  setUnknown: <K extends keyof BorrowerProfile>(key: K) => void;
  loadPersona: (id: PersonaPreset['id']) => void;
  reset: () => void;
  setRules: (rules: RuleConfig) => void;
  recompute: () => void;
}

function compute(profile: BorrowerProfile, rules: RuleConfig): FullAssessment | null {
  const required = [
    profile.loanPurpose,
    profile.requestedAmount,
    profile.employmentType,
    profile.monthlyTakeHomeIncome,
    profile.existingMonthlyEmis,
    profile.essentialLivingCosts,
    profile.age,
    profile.creditScoreBand,
  ];
  if (required.some((field) => field.status !== 'KNOWN')) return null;
  return runAssessment(profile, rules);
}

export const useBorrowerStore = create<BorrowerState>((set, get) => ({
  profile: EMPTY_PROFILE,
  assessment: null,
  rules: DEFAULT_RULES,
  activePersona: null,

  setField: (key, value) => {
    const next = clearBranchFields({ ...get().profile, [key]: value });
    set({ profile: next, activePersona: 'custom', assessment: compute(next, get().rules) });
  },

  setUnknown: (key) => {
    const next = clearBranchFields({ ...get().profile, [key]: { status: 'UNKNOWN' } });
    set({ profile: next, activePersona: 'custom', assessment: compute(next, get().rules) });
  },

  loadPersona: (id) => {
    const persona = PERSONAS.find((p) => p.id === id);
    if (!persona) return;
    const profile = clearBranchFields({ ...persona.profile });
    set({ profile, activePersona: id, assessment: compute(profile, get().rules) });
  },

  reset: () => set({ profile: { ...EMPTY_PROFILE }, assessment: null, activePersona: null, rules: DEFAULT_RULES }),

  setRules: (rules) => {
    const profile = get().profile;
    set({ rules, assessment: compute(profile, rules) });
  },

  recompute: () => {
    const { profile, rules } = get();
    set({ assessment: compute(profile, rules) });
  },
}));

export function profileFieldValue<K extends keyof BorrowerProfile>(profile: BorrowerProfile, key: K): BorrowerProfile[K] {
  return profile[key];
}

export function confidenceForMissing(profile: BorrowerProfile): ConfidenceState {
  const missing: string[] = [];
  Object.entries(profile).forEach(([key, field]) => {
    if ((field as { status?: string } | undefined)?.status === 'UNKNOWN') missing.push(key);
  });
  return missing.length ? { rating: 'LOW', confidenceReason: `${missing.length} fields are still unknown.` } : { rating: 'HIGH', confidenceReason: 'All captured fields are known.' };
}
