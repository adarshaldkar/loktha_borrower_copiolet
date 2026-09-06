# LOKTA BORROWER COPILOT — FINAL EXECUTION ROADMAP
**Production-Grade, Explainable & Grounded Self-Assessment Engine for Indian Retail Borrowers**

---

## Final Roadmap Summary & Scoring Matrix

```
+-----------------------------------------------------------------------------------------------+
| PHASE 1: Project Skeleton, Types, Tri-State Models & Declarative Rules         [ ~2.0 Hours ] |
| PHASE 2: Deterministic Financial Engine, Precedence Cascade & Test Suite       [ ~3.5 Hours ] |
| PHASE 3: Adaptive Questionnaire, Tri-State Uncertainty & Persona Loaders       [ ~3.0 Hours ] |
| PHASE 4: 4 Output Dashboards, Audit Trails & "Why Not" Engine                  [ ~3.5 Hours ] |
| PHASE 5: Negotiation Card, Lender Quote Evaluator & Live Rule Inspector        [ ~2.0 Hours ] |
| PHASE 6: Documentation, RULES.md, Limitations & Final Verification             [ ~2.0 Hours ] |
+-----------------------------------------------------------------------------------------------+
| TOTAL TIME-BOX: ~16.0 Hours | DELIVERABLES: Complete App + RULES.md + Personas + Walkthrough  |
+-----------------------------------------------------------------------------------------------+
```

---

## Phase 1: Foundation, Types, Tri-State Models & Rule Config (~2.0 Hours)

### Objective
Initialize the React 18 + TypeScript + Vite project, configure typography and theme tokens, define strict data structures supporting four distinct input states (`KNOWN`, `UNKNOWN`, `ZERO`, `NOT_APPLICABLE`), and establish the declarative rule configuration file (`rules.config.ts`).

### Detailed Tasks
1. **Initialize Project Skeleton**:
   * Setup Vite + React 18 + TypeScript with Tailwind CSS.
   * Configure typography: `Newsreader` (Editorial Serif for headings), `Source Sans 3` (Body text), `IBM Plex Mono` (Tabular currency numerals).
   * Configure light/dark theme variables matching Lokta’s palette.

2. **Define Tri-State Data Types (`src/types/index.ts`)**:
   ```typescript
   export type FieldValue<T> = 
     | { status: 'KNOWN'; value: T }
     | { status: 'UNKNOWN'; reason: string }
     | { status: 'ZERO'; reason: string }
     | { status: 'NOT_APPLICABLE'; reason: string };
   ```
   * Strict typing for `UserProfile`, `RulePrecedence`, `EngineOutputs`, `LenderQuote`, `ConfidenceState`, and `AuditTraceStep`.

3. **Build Centralized Declarative Rule Config (`src/config/rules.config.ts`)**:
   * Centralize all thresholds with strict source metadata:
     * `foirCaps`: Salaried Safe (35%), Informal Safe (25%), Lender Max (50%), Secured LAP (60%).
     * `productBaselines`: Personal Loan (10.5%–13.5%), LAP (8.75%–10.5%), Two-Wheeler/EV (11.0%–14.5%), Business (13.5%–18.0%).
     * `cibilSpreads`: Prime (-0.5%), Good (+0.75%), Fair (+2.5%), Unknown (+1.5% delta with +3.0% spread).
     * `feesAndTaxes`: Processing fee 1.5% + Statutory 18% GST.
     * `stressShocks`: -20% Income Reduction, +200 bps Rate Shock.

### Definition of Done
- [ ] Vite dev server boots cleanly in `< 3 seconds` with zero warnings.
- [ ] All data models are strictly typed with zero `any` types.
- [ ] All financial thresholds are declared in `rules.config.ts`.

---

## Phase 2: Deterministic Calculation Engine, Precedence Cascade & Test Suite (~3.5 Hours)

### Objective
Implement pure calculation functions completely decoupled from UI components. Implement a strict Rule Precedence cascade and an automated test suite verifying mathematical invariants, persona behavior, and boundary edge cases.

### Detailed Tasks
1. **Income & Cashflow Normalizer (`src/engine/normalizer.ts`)**:
   * Calculate Net Monthly Take-Home ($I_{\text{net}}$), Debt Commitments ($E_{\text{exist}}$), Essential Living Costs ($X_{\text{living}}$).
   * Differentiate Documented Income, Stated Cashflow, and Co-applicant Income.
   * Compute Current Debt FOIR, Total Fixed Burden, and Monthly Discretionary Surplus.

2. **O1 Decision Engine with Rule Precedence Cascade (`src/engine/decisionEngine.ts`)**:
   * Explicit Precedence Order:
     ```typescript
     export const VERDICT_PRECEDENCE = [
       "SAFETY_STOP_DEBT_TRAP",  // Active >24% app debt + recent bounce -> 🛑 STOP NEW BORROWING
       "INSOLVENCY_STOP",        // FOIR >= 50% or Cash Surplus <= 0 -> DON'T BORROW
       "PRODUCT_ROUTER",         // Self-employed + Property Collateral -> BORROW VIA SECURED LAP
       "BORROW_LESS",            // Requested Loan EMI pushes FOIR > 35% -> BORROW LESS
       "BORROW"                  // Healthy surplus and manageable debt -> BORROW
     ] as const;
     ```

3. **O2 Capacity Engine (`src/engine/capacityEngine.ts`)**:
   * Calculate **Estimated Lender-Side Capacity ($A_{\text{lender}}$)** using PV on standard commercial 50% FOIR without living expense deduction.
   * Calculate **Safe Borrower Capacity ($A_{\text{safe}}$)** using PV on conservative 35% FOIR preserving 40% cashflow cushion.
   * Attach explicit advisory guidance on which number to use.

4. **O3 Pricing & All-in APR Engine (`src/engine/pricingEngine.ts`)**:
   * Compute Fair Interest Rate Band $[R_{\text{min}}, R_{\text{max}}]$.
   * Handle `UNKNOWN` CIBIL by widening the band width to $\pm 1.75\%$ with an explicit reason.
   * Calculate **All-in APR** via monthly IRR incorporating processing fees + 18% GST + documentation charges.

5. **O4 Safe EMI & Stress Test Engine (`src/engine/emiEngine.ts`)**:
   * Safe Monthly Outflow Ceiling calculation.
   * 3-Tenure Amortization Schedule (24, 36, 60 months) with total interest paid.
   * 2-Scenario Stress Test: **-20% Income Drop** and **+200 bps Rate Shock**.

6. **Audit Trail & "Why Not" Engine (`src/engine/auditEngine.ts`)**:
   * Generate step-by-step audit trace strings (`Input -> Rule -> Calculation -> Output`).
   * Generate explicit "Why Not Requested Amount?" calculations.

7. **Lender Offer Comparison Engine (`src/engine/offerEngine.ts`)**:
   * Compare user-entered bank quotes (Rate, Fee, GST, Insurance) against fair benchmark and calculate actual APR vs. fair APR.

8. **Automated Unit Test Suite (`src/engine/__tests__/engine.test.ts`)**:
   * **Invariant Tests**:
     * Priya: High CIBIL lowers rate; wedding is non-productive; Safe Capacity $<$ Lender Capacity.
     * Ravi: Property collateral activates secured LAP pathway; documented and stated cashflow remain distinguishable.
     * Anita: Recent bounce + high-cost debt triggers safety rule; safe new unsecured capacity becomes zero.
   * **Mathematical Tests**: EMI calculation, PV calculation, APR IRR, 18% GST on fees, rounding.
   * **Boundary Tests**: FOIR = 35%, 40%, 50%; Surplus = 0; Income = 0; Existing EMI $>$ Income; Requested = 0.

### Definition of Done
- [ ] All calculation functions are pure, deterministic, and free of UI side-effects.
- [ ] Automated test suite runs and passes 100% of mathematical, invariant, and boundary assertions.

---

## Phase 3: Adaptive Questionnaire & State Store (~3.0 Hours)

### Objective
Build the responsive questionnaire UI with dynamic branching skip logic, honest tri-state uncertainty controls, and 1-click preset persona loaders.

### Detailed Tasks
1. **Tier 1 (8 Must-Have Questions)**:
   * Purpose, Target Amount, Employment Type, Income, Existing EMIs, Living Costs, Age, Credit Score (with explicit *"I Don't Know"*).
2. **Tier 2 (Adaptive Deepening Branching)**:
   * *Salaried Branch*: Employer Corporate Tier, Years at Company.
   * *Self-Employed Branch*: Documented ITR Net Profit, Unencumbered Collateral Value.
   * *Informal Branch*: High-Cost 30%+ App Loans, Recent EMI Bounces (6 months).
   * *Common*: Emergency Savings, Productive Asset Revenue, Co-applicant Income.
3. **Tri-State Input Controls**:
   * Interactive toggles for `Known Value`, `I Don't Know` (Unknown), `None / Zero`, or `Not Applicable`.
4. **Preset Persona Quick-Loader**:
   * Top bar with 1-click loaders for **Priya**, **Ravi**, **Anita**, and **Reset / Custom**.
   * Loading a persona updates the questionnaire and dynamically recomputes all outputs through the engine.
5. **State Store (`src/store/borrowerStore.ts`)**:
   * Reactive state linking user inputs to calculation engines with 100% numerical consistency.

### Definition of Done
- [ ] Selecting different employment types dynamically surfaces only relevant Tier 2 questions.
- [ ] Selecting "I Don't Know" for credit score triggers wide confidence spreads.
- [ ] 1-Click persona loaders instantly populate questionnaire and recompute outputs dynamically.

---

## Phase 4: 4 Output Dashboards & Dynamic Explainability (~3.5 Hours)

### Objective
Create rich, high-contrast visual output dashboards for O1–O4 with interactive "Why this number?" explainability drawers and step-by-step audit trails.

### Detailed Tasks
1. **O1 Verdict Card**:
   * High-contrast status badge (`BORROW`, `BORROW LESS`, `DON'T BORROW`, `🛑 STOP NEW BORROWING`).
   * Primary financial justification and high-cost offer warning banners.
2. **O2 Capacity Card (Lender Sanction vs. Safe Dual View)**:
   * Side-by-side comparison cards: **Estimated Lender-Side Capacity** vs. **Safe Borrower Capacity**.
   * Prominent advisory box instructing which number the borrower must follow.
3. **O3 Fair Rate & All-in APR Card**:
   * Visual range bar for fair rate band $[R_{\text{min}}, R_{\text{max}}]$.
   * Transparent upfront cost breakdown table (Nominal Rate, Processing Fee, 18% GST, All-in APR).
4. **O4 Safe EMI & Stress Simulator**:
   * Maximum monthly EMI ceiling gauge.
   * Multi-tenure comparison table showing total interest penalty.
   * Interactive stress test simulator with live toggles for **-20% Income Drop** and **+200 bps Rate Hike**.
5. **Interactive Explainability & "Why Not" Modal**:
   * Clickable `(?) Why this number?` and `(?) Why not my requested amount?` on all metrics displaying the full formula, applied rule, and plain-English explanation.

### Definition of Done
- [ ] All 4 outputs render with responsive layout on mobile and desktop viewports.
- [ ] Every single metric has a working "Why this number?" explainability drawer.
- [ ] Stress test simulator dynamically updates outflow figures on toggle.

---

## Phase 5: Negotiation Card, Offer Evaluator & Live Rule Inspector (~2.0 Hours)

### Objective
Deliver the 1-screen branch negotiation tool with actual lender quote comparison, and build the compact Live Rule Inspector for the 60-minute interview.

### Detailed Tasks
1. **1-Screen Negotiation Card (`src/components/NegotiationCard.tsx`)**:
   * Standalone, high-density, mobile-first card designed for branch visits.
   * Displays safe ceiling, fair rate band, all-in APR cap, red flag checklist, and profile-specific verbal negotiation scripts.
   * Configured with CSS `@media print` for clean single-page PDF/print export.
2. **Lender Offer Evaluator Component (`src/components/OfferComparator.tsx`)**:
   * Dedicated tool allowing borrowers to enter an actual bank quote (Amount, Rate, Tenure, Processing Fee, GST, Insurance).
   * Computes bank APR, compares against fair benchmark, and issues an overpayment warning and counter-offer script.
3. **Live Rule Inspector Panel (`src/components/RuleInspector.tsx`)**:
   * Compact, clean drawer allowing evaluators to adjust Safe FOIR, Lender FOIR, Income Shock, and Rate Shock.
   * Demonstrates instant live recalculation across all personas in real time.
4. **Embedded Test Runner UI (`src/components/TestRunnerPanel.tsx`)**:
   * Compact test drawer showing passing status for invariants, math tests, and boundary conditions.

### Definition of Done
- [ ] Negotiation Card prints cleanly on a single A4/mobile page with zero layout breaks.
- [ ] Modifying sliders in the Rule Inspector instantly updates all outputs and charts across all personas.
- [ ] Lender Offer Evaluator accurately compares quotes and displays APR deltas.

---

## Phase 6: Documentation, RULES.md, Limitations & Final Verification (~2.0 Hours)

### Objective
Generate all required submission deliverables, add in-app limitation disclosures, and verify end-to-end numerical consistency.

### Detailed Tasks
1. **Generate `RULES.md`**:
   * Complete markdown table documenting every rule, threshold, band, and assumption with explicit source classifications:
     $$\text{Rule Name} \quad|\quad \text{Value} \quad|\quad \text{Why It Exists} \quad|\quad \text{Source Classification}$$
2. **Generate `README.md`**:
   * Sub-5-minute quickstart guide (`npm install && npm run dev`), architectural overview, and demo instructions.
3. **Document Persona Run-Throughs (`WALKTHROUGH.md`)**:
   * Detailed breakdown for **Priya**, **Ravi**, and **Anita**:
     * Questions asked by the app
     * Four outputs generated
     * Full Negotiation Card and verbal script for each borrower
4. **In-App Consumer Disclaimer Banner**:
   * Persistent notice explaining self-assessment nature and limits of self-reported estimates.
5. **Final Quality Verification**:
   * Verify zero linter or TypeScript errors.
   * Verify clean mobile responsiveness.
   * Verify 100% numerical consistency across all views and documents.

### Definition of Done
- [ ] `RULES.md`, `README.md`, and `WALKTHROUGH.md` are complete and located at the repository root.
- [ ] Application builds with `npm run build` and runs cleanly with `npm run dev`.

---
*Lokta Borrower Copilot — Final Execution Roadmap.*
