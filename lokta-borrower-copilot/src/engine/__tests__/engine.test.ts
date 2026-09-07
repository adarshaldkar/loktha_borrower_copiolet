import { describe, it, expect } from 'vitest';
import { DEFAULT_RULES } from '../../config/rules.config';
import { personaById } from '../../data/personas';
import { runAssessment } from '../assessmentEngine';
import { calculateEmi, calculateAllInApr, presentValueFromEmi } from '../math';

describe('Lokta Financial Engine — Core Mathematical Operations', () => {
  it('calculates reducing balance EMI accurately', () => {
    // 10,00,000 at 10.0% p.a. for 120 months
    const emi = calculateEmi(1000000, 10.0, 120);
    expect(Math.round(emi)).toBe(13215);
  });

  it('calculates present value (loan capacity) matching EMI in reverse', () => {
    const emi = calculateEmi(1000000, 10.0, 120);
    const pv = presentValueFromEmi(emi, 10.0, 120);
    expect(Math.round(pv)).toBe(1000000);
  });

  it('calculates true actuarial all-in APR factoring upfront fees and GST', () => {
    // ₹5,00,000 loan, 12% nominal, 36 months, net disbursed ~₹4,91,150
    const emi = calculateEmi(500000, 12.0, 36);
    const upfront = 500000 * 0.015 * 1.18; // 1.5% fee + 18% GST = ₹8,850
    const net = 500000 - upfront;
    const apr = calculateAllInApr(net, emi, 36);
    expect(apr).toBeGreaterThan(12.0); // APR must be strictly greater than nominal rate
    expect(apr).toBeCloseTo(13.25, 1);
  });
});

describe('Persona Run-Throughs — Exact Alignment with Persona Presets', () => {
  it('evaluates Priya (Salaried MNC) with high confidence and BORROW LESS recommendation', () => {
    const priya = personaById('priya');
    const result = runAssessment(priya.profile, DEFAULT_RULES);

    expect(result.confidence.rating).toBe('HIGH');
    expect(result.o1.verdict).toBe('BORROW_LESS');
    expect(result.o3.pathway).toBe('PERSONAL_LOAN');
    expect(result.o2.lenderSanction).toBeGreaterThan(result.o2.safeBorrowerCapacity);
    expect(result.o2.safeBorrowerCapacity).toBe(732400);
    expect(result.o3.fairRateMin).toBe(9.5);
    expect(result.o3.fairRateMax).toBe(12.5);
    expect(result.o4.tenureRows.length).toBe(3);
  });

  it('evaluates Ravi (Kirana Owner) routing to LAP Secured with medium confidence and BORROW recommendation', () => {
    const ravi = personaById('ravi');
    const result = runAssessment(ravi.profile, DEFAULT_RULES);

    expect(result.confidence.rating).toBe('MEDIUM');
    expect(result.o3.pathway).toBe('LAP_SECURED');
    expect(result.o1.verdict).toBe('BORROW');
    expect(result.o2.lenderSanction).toBe(2250000);
    expect(result.o2.safeBorrowerCapacity).toBe(1692700);
    expect(result.o3.fairRateMin).toBe(8.75);
    expect(result.o3.fairRateMax).toBe(12.75);
  });

  it('evaluates Anita (Informal Gig) with low confidence and RESTRUCTURE FIRST safety stop', () => {
    const anita = personaById('anita');
    const result = runAssessment(anita.profile, DEFAULT_RULES);

    expect(result.confidence.rating).toBe('LOW');
    expect(result.o1.verdict).toBe('RESTRUCTURE_FIRST');
    expect(result.o1.flags).toContain('HIGH_COST_DEBT_WITH_RECENT_BOUNCE');
    expect(result.o3.pathway).toBe('TWO_WHEELER_EV');
    expect(result.o2.safeBorrowerCapacity).toBe(23300);
  });
});

describe('Deterministic Precedence Cascade & Dynamic Rule Propagation', () => {
  it('propagates custom rule configurations dynamically to all calculations', () => {
    const priya = personaById('priya');
    const baseline = runAssessment(priya.profile, DEFAULT_RULES);

    // Increase safe FOIR from 35% to 45%
    const relaxedRules = {
      ...DEFAULT_RULES,
      foirCaps: {
        ...DEFAULT_RULES.foirCaps,
        salariedSafe: 0.45,
      },
    };
    const updated = runAssessment(priya.profile, relaxedRules);

    // Safe borrower capacity should dynamically increase
    expect(updated.o2.safeBorrowerCapacity).toBeGreaterThan(baseline.o2.safeBorrowerCapacity);
    expect(updated.o4.safeEmiCeiling).toBeGreaterThan(baseline.o4.safeEmiCeiling);
  });
});
