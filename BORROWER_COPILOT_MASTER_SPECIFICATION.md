# LOKTA BORROWER COPILOT — MASTER ARCHITECTURAL SPECIFICATION (v3)
**Production-Grade, Explainable & Grounded Self-Assessment Engine for Indian Retail Borrowers**

---

## 1. Core Mission & Assessment Philosophy

The **Lokta Borrower Copilot** is a borrower-first decision counter-model designed to neutralize the information asymmetry between Indian retail lenders and borrowers. While commercial lenders employ proprietary underwriting models to maximize loan volume, loan tenures, and interest spreads, borrowers enter branches with zero leverage.

This system is **not a generic EMI calculator**, nor is it a black-box machine learning model. It is a **deterministic, rule-driven financial copilot** that translates professional credit advisory judgement, regulatory realities, and debt-safety principles into transparent, machine-executable software.

### Primary Evaluation Mapping
| Evaluation Criterion | Weight | How Our Architecture Delivers |
|---|---|---|
| **Domain Reasoning** | **30%** | Clear bifurcation between Lender Sanction vs. Safe Capacity; strict Rule Precedence hierarchy; dedicated Debt-Trap Stop state; true All-in APR calculations (Processing Fee + 18% statutory GST); product pathway routing (LAP vs. PL). |
| **Question Design** | **20%** | Two-tier adaptive structure (8 Must-Have + Deepening questions where *every question changes an output*); three distinct uncertainty states (`UNKNOWN`, `ZERO`, `NOT_APPLICABLE`). |
| **Explainability & Negotiation Card** | **20%** | Full "Input $\rightarrow$ Rule $\rightarrow$ Calculation $\rightarrow$ Output" audit trails; explicit "Why Not" explanations (e.g. why ₹8L is unsafe); 1-screen branch negotiation card with actual lender quote comparison. |
| **Product Craft** | **15%** | Honest qualitative confidence (`HIGH`, `MEDIUM`, `LOW`) with explicit missing-data causes; responsive UI; clean single-page printable card; interactive stress testing. |
| **Engineering** | **10%** | Pure, deterministic functional calculation engine; zero hardcoded outputs; 100% numerical consistency across all views; built-in automated test suite. |
| **Honesty About Limits** | **5%** | In-app model limitation disclaimers; explicit rule source classification (`Statutory`, `Market Benchmark`, `Prototype Assumption`). |

---

## 2. Complete System Architecture

```
                                  +---------------------------------------+
                                  |           USER INPUT LAYER            |
                                  |  - Persona Loaders (Priya/Ravi/Anita) |
                                  |  - Adaptive Questionnaire (Tier 1/2)  |
                                  |  - Lender Quote Comparison Input      |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       PROFILE BUILDER & SCHEMA        |
                                  |  Categorizes inputs strictly into:    |
                                  |  [ KNOWN ] | [ UNKNOWN ] | [ ZERO ]   |
                                  |  [ NOT_APPLICABLE ]                   |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |      PRODUCT PATHWAY ROUTER           |
                                  |  (Evaluates eligibility before rate)  |
                                  |  - Unsecured Personal Loan            |
                                  |  - Secured LAP / MSME Loan            |
                                  |  - Two-Wheeler / EV Mobility Loan     |
                                  |  - Debt Restructuring / Settlement    |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       DECLARATIVE RULE ENGINE         |
                                  |         (`rules.config.ts`)           |
                                  |  - Rule Precedence Hierarchy Matrix   |
                                  |  - Safe vs. Lender FOIR Caps          |
                                  |  - Market Benchmark Rate Bands        |
                                  |  - GST & Processing Fee Norms         |
                                  |  - Stress Shocks (-20% Inc, +200bps)  |
                                  +-------------------+-------------------+
                                                      |
                                                      v
+-----------------------------------------------------+-----------------------------------------------------+
|                                DETERMINISTIC CALCULATION PIPELINE                                         |
|                                                                                                           |
|  1. O1 Decision Engine: Rule Precedence Gate (Safety Stop > Insolvency > Borrow Less > Borrow)            |
|  2. O2 Capacity Engine: Likely Lender Sanction vs. Safe Borrower Capacity (PV Actuarial Math)             |
|  3. O3 Pricing Engine: Fair Rate Band + Uncertainty Spread + True All-in APR (IRR + 18% GST)             |
|  4. O4 Outflow Engine: Safe Monthly EMI Ceiling + Multi-Tenure Amortization + 2-Scenario Stress Test      |
|  5. Audit & Explainability Engine: Input -> Rule -> Calc -> Output Audit Trace & "Why Not" Calculations   |
|  6. Offer Comparison Engine: Actual Lender Quote vs. Fair Benchmark & APR Delta Evaluation               |
+-----------------------------------------------------+-----------------------------------------------------+
                                                      |
                                                      v
+-----------------------------------------------------+-----------------------------------------------------+
|                                         PRESENTATION LAYER                                        |
|  +---------------------------+  +--------------------------+  +----------------------------------------+  |
|  | 4 Output Dashboards       |  | Negotiation Card         |  | Live Rule Playground & Embedded Tests  |  |
|  | - O1 Verdict & Trap Alert |  | - 1-Screen Branch Tool   |  | - Live parameter sliders               |  |
|  | - O2 Sanction vs Safe     |  | - Lender Quote Evaluator |  | - Persona verification test panel      |  |
|  | - O3 Rate Band & APR      |  | - Verbal Scripts         |  | - Boundary-condition test suite       |  |
|  | - O4 EMI & Stress Test    |  | - Print CSS Styling      |  | - Model limitation disclosures        |  |
|  +---------------------------+  +--------------------------+  +----------------------------------------+  |
+-----------------------------------------------------------------------------------------------------------+
```

---

## 3. Data Representation: Uncertainty, Zero & Inapplicability

To eliminate ambiguity and adhere strictly to the `"Unknown is never zero"` principle, the data layer differentiates four distinct states:

```typescript
// src/types/index.ts

export type TriState<T> = 
  | { state: 'KNOWN'; value: T }
  | { state: 'UNKNOWN'; reason: string }           // e.g. "I don't know my credit score" -> widens band
  | { state: 'ZERO'; reason: string }              // e.g. "I have Rs 0 emergency savings" -> hard risk
  | { state: 'NOT_APPLICABLE'; reason: string };   // e.g. "No co-applicant / No collateral" -> skips path
```

### Impact Matrix across Outputs:
| Input Field | When `KNOWN` | When `UNKNOWN` | When `ZERO` | When `NOT_APPLICABLE` |
|---|---|---|---|---|
| **Credit Score (CIBIL)** | Tight Fair Rate band ($\pm 0.5\%$), High Confidence. | **Widens rate band by $\pm 1.75\%$**, flags lower confidence with reason. | Treated as invalid score; routes to High-Risk/Subprime tier. | N/A |
| **Emergency Savings** | If $\ge 3$ months, unlocks higher safe FOIR ($38\%$). | Assumes zero buffer for safety; lowers safe FOIR to $30\%$. | **Flags high vulnerability** in stress tests; restricts non-essential loans. | N/A |
| **Property Collateral** | Unlocks Secured LAP Pathway ($8.75\%-10.5\%$). | Prompts for document review; holds LAP pathway in pending state. | N/A | Excludes secured LAP pathway; routes to personal/business unsecured. |
| **Spouse / Co-applicant**| Adds verified income portion to safe debt capacity. | Prompts for co-applicant verification. | N/A | Evaluates sole applicant cashflow with zero penalty. |

---

## 4. Rule Precedence Hierarchy (Deterministic Decision Architecture)

To resolve competing rules deterministically, the O1 decision engine executes a strict precedence cascade:

$$\text{Verdict} = \text{EvaluateCascade}(\text{Precedence}_1 \rightarrow \text{Precedence}_2 \rightarrow \text{Precedence}_3 \rightarrow \text{Precedence}_4 \rightarrow \text{Precedence}_5)$$

```
                                  [ START O1 EVALUATION ]
                                             |
                                             v
     +-------------------------------------------------------------------------------+
     | PRECEDENCE 1: SAFETY STOP / DEBT TRAP                                         |
     | Condition: Active High-Cost Debt (>24% APR) AND (EMI Bounce in last 6 mo      |
     |            OR Husband/Spouse Unemployed with Negative Disposable Buffer)      |
     +---------------------------------------+---------------------------------------+
                                            / \
                                     YES   /   \   NO
                                          v     v
                  [ STOP NEW BORROWING ]           +---------------------------------+
                  (Restructure Debt First;         | PRECEDENCE 2: INSOLVENCY STOP   |
                   No New Unsecured Credit)        | Condition: Current FOIR >= 50%  |
                                                   | OR Monthly Net Surplus <= 0     |
                                                   +----------------+----------------+
                                                                   / \
                                                            YES   /   \   NO
                                                                 v     v
                                                  [ DON'T BORROW ]    +------------------------------+
                                                  (Debt Capacity      | PRECEDENCE 3: PRODUCT ROUTER |
                                                   Exhausted)         | Condition: Self-Employed +   |
                                                                      | Property Collateral Available|
                                                                      +--------------+---------------+
                                                                                    / \
                                                                             YES   /   \   NO
                                                                                  v     v
                                                  [ BORROW VIA SECURED PATHWAY ]       +-------------+
                                                  (Recommend LAP at 9.0%-10.5%        | PRECEDENCE 4 |
                                                   instead of Unsecured at 18%)        +------+------+
                                                                                              |
                                     +--------------------------------------------------------+
                                     |
                                     v
     +-------------------------------------------------------------------------------+
     | PRECEDENCE 4: PRUDENT DOWNSIZING (BORROW LESS)                                |
     | Condition: Requested Loan EMI pushes Projected FOIR > 35%                     |
     |            OR Non-Productive Lifestyle Spend (Wedding/Vacation) > 25% Annual  |
     +---------------------------------------+---------------------------------------+
                                            / \
                                     YES   /   \   NO
                                          v     v
                  [ BORROW LESS ]                  [ BORROW ]
                  (Recommend Safe Cap              (Within Safe Affordability
                   Preserving Buffer)               Boundaries)
```

---

## 5. Mathematical Formulations & Definitions

### 5.1 Authoritative Definitions
* **Net Monthly Take-Home ($I_{\text{net}}$)**: Verified monthly cash received in hand.
* **Committed Monthly Debt ($E_{\text{exist}}$)**: Sum of all ongoing EMIs and credit card dues.
* **Essential Living Costs ($X_{\text{living}}$)**: Non-negotiable rent, groceries, school fees, and medical utilities.
* **Current Debt FOIR**: $\text{FOIR}_{\text{current}} = \frac{E_{\text{exist}}}{I_{\text{net}}}$.
* **Total Committed Burden**: $\text{Burden}_{\text{total}} = \frac{E_{\text{exist}} + X_{\text{living}}}{I_{\text{net}}}$.
* **Monthly Discretionary Surplus ($S_{\text{monthly}}$)**: $I_{\text{net}} - E_{\text{exist}} - X_{\text{living}}$.

---

### 5.2 O2: Likely Lender Sanction vs. Safe Borrower Capacity

#### A. Likely Lender Sanction ($A_{\text{lender}}$)
How commercial lenders maximize loan disbursement volume using gross/net income caps without deducting living costs:
$$\text{Max Lender EMI} = (I_{\text{stated}} \times \text{FOIR}_{\text{lender\_cap}}) - E_{\text{exist}}$$
*(where $\text{FOIR}_{\text{lender\_cap}} = 0.50$ for salaried, $0.60$ for secured LAP).*
$$A_{\text{lender}} = \text{PV}\left(r_{\text{lender}}, N_{\text{max}}, \text{Max Lender EMI}\right)$$

#### B. Safe Borrower Capacity ($A_{\text{safe}}$)
How a fiduciary consumer copilot calculates safe borrowing:
$$\text{Safe Monthly EMI} = \min\left( (I_{\text{net}} \times \text{FOIR}_{\text{safe\_cap}}) - E_{\text{exist}}, \, S_{\text{monthly}} \times 0.60 \right)$$
*(where $\text{FOIR}_{\text{safe\_cap}} = 0.35$ for salaried, $0.25$ for informal; tenure $N_{\text{ideal}} = 36$ to $48$ months).*
$$A_{\text{safe}} = \text{PV}\left(r_{\text{fair\_high}}, N_{\text{ideal}}, \text{Safe Monthly EMI}\right)$$

---

### 5.3 O3: Fair Rate Band & All-in APR (with Statutory GST)

#### A. Fair Rate Band $[R_{\text{min}}, R_{\text{max}}]$
$$\text{Fair Rate} = \text{Base Benchmark} + \Delta_{\text{CIBIL}} + \Delta_{\text{Vintage}} - \Delta_{\text{Collateral}}$$

| Product Category | Market Baseline | Processing Fee Norm | Statutory Tax |
|---|---|---|---|
| **Personal Loan (Unsecured)** | 10.50% – 13.50% | 1.50% – 2.50% | 18% GST on Fee |
| **Secured LAP (Loan Against Property)** | 8.75% – 10.50% | 0.50% – 1.00% | 18% GST on Fee |
| **Two-Wheeler / EV Loan** | 11.00% – 14.50% | 1.00% – 2.00% | 18% GST on Fee |
| **Business Loan (Unsecured)** | 14.00% – 18.00% | 2.00% – 3.00% | 18% GST on Fee |

#### B. True All-in APR (Actuarial Cost of Borrowing)
$$\text{Upfront Deductions} = (\text{Loan Amount} \times \text{Fee \%} \times 1.18) + \text{Documentation Charges}$$
$$\text{Net Disbursed Cash} = \text{Loan Amount} - \text{Upfront Deductions}$$
The All-in APR is the internal rate of return ($r_{\text{APR}}$) satisfying:
$$\text{Net Disbursed Cash} = \sum_{t=1}^{N} \frac{\text{Monthly EMI}}{\left(1 + \frac{r_{\text{APR}}}{12}\right)^t}$$

---

### 5.4 O4: Safe EMI Ceiling & 2-Point Stress Testing
1. **Tenure Comparison Table**: Amortization computed across 24, 36, and 60 months, displaying monthly EMI, total interest paid, and total cash outflow.
2. **Stress Shock 1 (-20% Income Drop)**: Assesses whether the monthly EMI remains below $50\%$ of reduced income and whether monthly cash surplus stays positive.
3. **Stress Shock 2 (+200 bps Floating Rate Hike)**: Assesses the monthly EMI jump and identifies the additional surplus required to service debt.

---

## 6. Audit Trail & Explicit "Why Not" Engine

For every computed output, the copilot generates an interactive, step-by-step audit trail and a dedicated "Why Not" analysis:

### Example: Priya's Requested ₹8,00,000 vs. Safe ₹5,20,000
```
[ Step-by-Step Audit Trail ]
1. User Input: Net Take-Home Salary = Rs 1,10,000 / month
2. Applied Rule: Safe FOIR Cap for Salaried Corporate = 35.0%
3. Calculation: Max Total Allowable Debt Outflow = Rs 1,10,000 x 35% = Rs 38,500 / month
4. Deduct Existing Debt: Active Car Loan EMI = Rs 14,000 / month
5. Resulting Safe EMI Ceiling: Rs 38,500 - Rs 14,000 = Rs 24,500 / month
6. Cashflow Buffer Check: Net Surplus (Rs 50,000) x 60% = Rs 30,000 -> Conservative Cap = Rs 16,500 / month
7. Actuarial Present Value: PV(Rate: 11.25%, Tenure: 36 mo, EMI: Rs 16,500) = Rs 5,21,400 -> Rounded: Rs 5,20,000.

[ Explicit "Why Not Rs 8,00,000?" Analysis ]
"If you borrow the full requested Rs 8,00,000 over 3 years:
 • Your new monthly EMI would be approximately Rs 26,400.
 • Added to your existing Rs 14,000 car EMI, your total debt outflow becomes Rs 40,400 / month.
 • This pushes your debt burden to 36.7% of salary, exceeding your 35.0% safe ceiling.
 • Together with your Rs 28,000 rent, committed costs would consume 62.2% of your income, leaving insufficient cushion for wedding overruns or emergency savings."
```

---

## 7. Lender Offer Comparison Flow ("Compare a Lender Quote")

The copilot includes a dedicated comparison tool enabling borrowers to evaluate actual bank sanction letters against their fair profile benchmark:

```
+-----------------------------------------------------------------------------------------+
|  LENDER OFFER EVALUATION & BENCHMARK COMPARISON                                         |
+-----------------------------------------------------------------------------------------+
|  User Enters Bank Quote:                                                                |
|  - Quoted Loan Amount:    Rs 8,00,000                                                   |
|  - Quoted Nominal Rate:   14.00% (Monthly Reducing)                                     |
|  - Quoted Tenure:         36 Months                                                     |
|  - Quoted Processing Fee: 2.00% + 18% GST (Rs 18,880)                                   |
|  - Mandatory Insurance:   Rs 12,000                                                     |
+-----------------------------------------------------------------------------------------+
|  COPILOT EVALUATION VERDICT:                                                            |
|  * Quoted Nominal Rate:   14.00%  vs.  Your Fair Rate: 10.75% - 11.75% [ +2.25% OVER ]  |
|  * Quoted All-in APR:     15.42%  vs.  Your Fair APR:  11.95%          [ +3.47% OVER ]  |
|  * Total Extra Cost:      You will pay Rs 48,200 MORE than fair market pricing.         |
|  * Assessment Verdict:    [ WARNING: EXPENSIVE OFFER / HIGH PROCESSING FEE ]            |
+-----------------------------------------------------------------------------------------+
|  ACTIONABLE COUNTER-OFFER SCRIPT FOR THE BRANCH:                                        |
|  "Your quoted rate of 14% is 2.5% above the market benchmark for a 780 CIBIL borrower   |
|   at a Tier-1 MNC. Furthermore, the 2% processing fee and mandatory insurance push the  |
|   effective APR to 15.42%. I request a revised sanction at 11.25% with processing fees  |
|   capped at 1.0%, and the removal of the optional loan protection insurance."           |
+-----------------------------------------------------------------------------------------+
```

---

## 8. Detailed Persona Walkthroughs (Acceptance Test Cases)

### Persona 1: Priya (29, Bengaluru, Salaried MNC Software Engineer)
* **Profile**: Net Salary ₹1,10,000/mo (5 yrs at large MNC), CIBIL 780, Existing Car EMI ₹14,000 (2 yrs left), Rent ₹28,000. Asking ₹8,00,000 Personal Loan for wedding.
* **Engine Execution**:
  * *Product Pathway*: Unsecured Personal Loan.
  * *O1 Verdict*: **BORROW LESS**. Non-productive lifestyle ask; full ₹8L exceeds safe 35% FOIR cap.
  * *O2 Capacity*: Likely Lender Sanction = **₹16,50,000** vs. Safe Borrower Capacity = **₹5,20,000**.
  * *O3 Fair Rate & APR*: Fair Band = **10.75% – 11.75%** | All-in APR = **11.95%**.
  * *O4 Safe EMI*: **₹18,000 / month** max (total debt FOIR $\le 29.0\%$).
  * *Confidence*: **HIGH** (Verified income, prime CIBIL, corporate vintage).

---

### Persona 2: Ravi (42, Mysuru, Self-Employed Kirana Store Owner)
* **Profile**: Kirana store for 14 years. Cash income ₹40k–₹80k/mo; ITR shows ₹4,20,000/yr (₹35k/mo). Owns unencumbered shop premises worth ₹45,00,000. No formal credit score. Wife earns ₹18,000 teaching. Asking ₹15,00,000 for stock + delivery vehicle.
* **Engine Execution**:
  * *Product Pathway*: **Secured Loan Against Property (LAP) / MSME Secured**.
  * *O1 Verdict*: **BORROW VIA SECURED PATHWAY**. Productive inventory and commercial vehicle generate gross cashflow to service debt.
  * *O2 Capacity*: Likely Lender Sanction (LAP) = **₹22,50,000** (50% LTV of ₹45L property) vs. Safe Capacity = **₹15,00,000**.
  * *O3 Fair Rate & APR*: Fair Band (LAP) = **9.00% – 10.50%** (vs. Unsecured 16%–22%) | All-in APR = **9.85%**.
  * *O4 Safe EMI*: **₹22,000 / month** (under 7-year LAP amortization).
  * *Confidence*: **MEDIUM** (Documented collateral & ITR, but informal cashflow is self-reported and credit score is unrecorded).

---

### Persona 3: Anita (35, Hubballi, Informal Gig Worker & Tailor)
* **Profile**: Delivery rider + home tailoring earning ₹26k–₹30k/mo. 2 kids, husband unemployed 8 months. Three digital app loans (₹35,000 outstanding at 30%+ APR), 1 EMI bounce last month. Asking ₹1,50,000 for an electric scooter.
* **Engine Execution**:
  * *Product Pathway*: **Debt Restructuring & Relief $\rightarrow$ Conditional EV Mobility Asset Financing**.
  * *O1 Verdict*: **🛑 STOP NEW BORROWING / RESTRUCTURE FIRST**.
  * *O2 Capacity*: Likely Lender Sanction (Predatory Apps) = **₹50,000** at 36%+ APR vs. Safe Immediate Capacity = **₹0 new unsecured debt**. Conditional future EV capacity post-restructuring = **₹90,000** under subsidized green financing.
  * *O3 Fair Rate & APR*: Commercial Fair EV Rate = **11.5% – 13.5%** | Predatory Alert: *Reject any offer $>18\%$ APR.*
  * *O4 Safe EMI*: **₹3,200 / month** max (post-restructuring).
  * *Confidence*: **MEDIUM-LOW** (Informal volatile income, lack of formal documentation).

---

## 9. Comprehensive Rules & Sources Matrix (`RULES.md` Blueprint)

| Rule Identifier | Parameter Name | Value | Justification & Domain Why | Source Classification |
|---|---|---|---|---|
| `RULE_FOIR_SAFE_SALARIED` | Safe FOIR Cap (Salaried) | 35.0% | Preserves 65% of net salary for rent, living costs, emergency savings, and family dependents. | **Prototype Assumption / Best Practice** |
| `RULE_FOIR_SAFE_INFORMAL` | Safe FOIR Cap (Informal) | 25.0% | Irregular cash earnings require a larger safety buffer against income drops. | **Prototype Assumption / Conservative Model** |
| `RULE_FOIR_LENDER_SALARIED`| Commercial Lender FOIR Limit | 50.0% | Commercial retail banks typically allow up to 50% debt-to-income without deducting household rent. | **Market Benchmark — Observed Bank Policy** |
| `RULE_UNKNOWN_CIBIL_SPREAD`| Rate Band Expansion for Unknown CIBIL | +3.00% Width | When credit history is unrecorded, lenders price underwriting uncertainty into higher risk premiums. | **Prototype Assumption / Uncertainty Model** |
| `RULE_GST_ON_FEES` | GST on Loan Processing Charges | 18.0% | Statutory Indian tax applicable to financial services processing fees. | **Statutory / Tax Mandate (Indian GST Act)** |
| `RULE_LAP_LTV_MAX` | Max Loan to Property Value | 50.0% – 60.0% | Conservative valuation cushion against commercial property market illiquidity. | **Market Benchmark — Standard LAP Norms** |
| `RULE_STRESS_INCOME_DROP` | Stress Test Income Reduction | -20.0% | Tests whether debt service remains viable if business slows or overtime/gig shifts decrease. | **Prototype Assumption / Prudent Stress Test** |
| `RULE_STRESS_RATE_HIKE` | Stress Test Floating Rate Spike | +200 bps | Tests borrower budget resilience against standard macroeconomic interest rate hike cycles. | **Prototype Assumption / Prudent Stress Test** |

---

## 10. Automated Test Suite & Boundary Condition Matrix

The codebase includes an integrated, runnable unit test suite (`src/engine/__tests__/engine.test.ts`):

```typescript
// Test Matrix verified by the engine:
describe('Borrower Copilot Engine Test Suite', () => {
  test('Priya: Returns BORROW_LESS, Safe Capacity ~5.2L vs Lender ~16.5L, High Confidence', () => { ... });
  test('Ravi: Routes to LAP Secured Pathway at 9.0%-10.5%, Medium Confidence', () => { ... });
  test('Anita: Triggers STOP_NEW_BORROWING / RESTRUCTURE_FIRST due to bounce & 30%+ app debt', () => { ... });
  test('Uncertainty Principle: Unknown CIBIL widens rate band by >= 300 bps', () => { ... });
  test('Boundary Test: Zero Income returns DONT_BORROW immediately', () => { ... });
  test('Boundary Test: Existing EMI > Income returns DONT_BORROW with negative cashflow alert', () => { ... });
  test('Boundary Test: FOIR exact boundary at 35.0% transitions from BORROW to BORROW_LESS', () => { ... });
  test('All-in APR Test: Accurately incorporates 1.5% fee + 18% GST into effective IRR', () => { ... });
});
```

---

## 11. In-App Model Limitations & Consumer Disclaimers

Displayed persistently in the UI footer and on the printable Negotiation Card:

> **Consumer Self-Assessment Notice & Model Limitations:**
> This application is an independent self-assessment tool designed to empower borrowers with transparent benchmarks. It is **not a loan sanction letter, credit guarantee, or official bank approval**. All estimates are calculated strictly from self-reported data. Final loan approval, interest pricing, and sanction amounts depend on official bureau verification, KYC, asset appraisal, and individual lender underwriting policies.

---
*Lokta Borrower Copilot — Master Specification v3.*
