# LOKTA BORROWER COPILOT — RULES & ASSUMPTIONS REGISTRY (`RULES.md`)

This document records every rule, threshold, rate band, and modeling assumption implemented in the **Lokta Borrower Copilot**, categorized transparently by its source and domain justification.

---

## 1. Affordability & Debt Capacity Thresholds (FOIR & NDCF)

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_FOIR_SAFE_SALARIED` | Maximum Safe FOIR (Salaried Corporate) | **35.0%** of net income | Preserves 65% of net monthly take-home for non-negotiable living obligations (rent, food, dependent support) and liquid savings. | **Prototype Assumption / Conservative Fiduciary Standard** |
| `RULE_FOIR_SAFE_INFORMAL` | Maximum Safe FOIR (Informal / Gig Worker) | **25.0%** of recognized income | Irregular and volatile earnings require a wider cushion to withstand earning dips, illness, or vehicle downtime. | **Prototype Assumption / Microfinance Best Practice** |
| `RULE_FOIR_DECISION_CEILING` | Projected Hard FOIR Ceiling (`projectedFoirCap`) | **35.0%** of effective income | Triggers a `BORROW LESS` recommendation if total post-loan debt service exceeds 35% of recognized monthly income. | **Prototype Assumption / Fiduciary Guardrail** |
| `RULE_FOIR_LENDER_SALARIED` | Commercial Bank Underwriting FOIR | **50.0%** of stated income | Retail banks underwrite higher debt limits based on gross stated earnings without deducting actual rent or living costs. | **Market Benchmark — Retail Banking Underwriting Norms** |
| `RULE_FOIR_LENDER_SECURED` | Commercial Secured LAP FOIR | **60.0%** of gross cashflow | Lenders permit higher debt service caps when backed by real estate collateral. | **Market Benchmark — Housing Finance & LAP Norms** |
| `RULE_SURPLUS_BUFFER_RETAIN`| Discretionary Cash Surplus Retention | **60.0%** surplus cap | Ensures monthly loan EMIs do not consume more than 60% of uncommitted surplus cash after essential living costs. | **Prototype Assumption / Debt Safety Standard** |
| `RULE_LIFESTYLE_INCOME_LIMIT`| Non-Productive Lifestyle Loan Cap | **25.0%** of annual income | Caps unhedged personal and wedding consumption debt relative to annual earnings. | **Prototype Assumption / Consumer Credit Safety** |
| `RULE_LOW_SAVINGS_HAIRCUT` | Inadequate Savings FOIR Penalty | **-5.0%** FOIR penalty | Reduces safe FOIR by 5 percentage points when liquid emergency savings cover less than 3 months of living costs. | **Prototype Assumption / Resilience Buffer** |

---

## 2. Product Routing & Collateral Norms

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_PATHWAY_LAP_TRIGGER` | LAP Collateral Minimum Threshold | $\ge \mathbf{₹10,00,000}$ unencumbered property | Routes small business applicants with substantial unencumbered property to secured LAP (8.75%–12.75%) instead of costly unsecured business loans (13.5%–18.0%). | **Domain Reasoning / Product Optimization** |
| `RULE_LAP_LTV_MAX` | Maximum Loan-to-Value (LAP) | **50.0%** of property valuation | Provides a conservative 50% valuation cushion against real estate illiquidity and title risk. | **Market Benchmark — Standard Indian LAP Underwriting** |
| `RULE_PATHWAY_EV_MOBILITY` | Two-Wheeler / EV Product Routing | Purpose: Two-Wheeler / EV | Unlocks dedicated asset financing terms (24–48 months) with lower risk spreads than cash personal loans. | **Market Benchmark — Auto & EV Lending Norms** |
| `RULE_PATHWAY_HOME_LOAN` | Home Loan Routing | Purpose: Home Purchase | Applies long-tenure (15–25 years) residential mortgage rates. | **Market Benchmark — Prime Residential Mortgages** |
| `RULE_PATHWAY_GOLD_LOAN` | Gold Loan Routing | Purpose: Gold Jewellery | Liquid collateralized short-tenure (1–3 years) retail credit. | **Market Benchmark — Gold Loan NBFCs & Banks** |

---

## 3. Income Recognition & Haircuts

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_HAIRCUT_SALARIED` | Salaried MNC / SME Recognition | **100%** (0% haircut) | Direct bank credit salary with payslips provides stable, verifiable income. | **Market Benchmark — Prime Salaried Underwriting** |
| `RULE_HAIRCUT_SELF_EMPLOYED` | Business Documented Profit | **100%** of ITR profit | Income Tax Returns (ITRs) and audited financials represent verified baseline cashflow. | **Market Benchmark — MSME Underwriting Norms** |
| `RULE_HAIRCUT_UNRECORDED_CASH`| Self-Reported Additional Cashflow | **50%** recognition | Cash inflows above documented tax profit are recognized with a 50% haircut to reflect unverified volatility. | **Prototype Assumption / Prudent MSME Estimation** |
| `RULE_HAIRCUT_INFORMAL` | Informal / Gig Income Recognition | **65%** recognition (35% haircut) | Uncontracted, daily/weekly platform earnings fluctuate with demand, health, and vehicle upkeep. | **Prototype Assumption / Informal Sector Credit Modeling** |
| `RULE_HAIRCUT_COAPPLICANT` | Co-Applicant Documented Income | **100%** recognition | Stable secondary household income (e.g. spouse teaching salary) directly enhances debt servicing capacity. | **Market Benchmark — Household Underwriting Norms** |
| `RULE_HAIRCUT_PRODUCTIVE` | Productive Revenue Potential | **50%** recognition | Expected incremental revenue from income-generating assets (e.g. delivery EV, store stock) is discounted by 50% until realized. | **Prototype Assumption / Conservative Growth Credit** |

---

## 4. Interest Rate Bands, Risk Adjustments & Uncertainty

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_RATE_BASE_PERSONAL` | Base Personal Loan Rate Card | **10.50% – 13.50%** | Standard reducing-balance rate card for prime and near-prime salaried borrowers in India (2026). | **Market Benchmark — Indian Retail Bank & NBFC Rate Cards** |
| `RULE_RATE_BASE_HOME` | Base Home Loan Rate Card | **8.40% – 9.80%** | Floating residential mortgage rate pegged to repo-linked lending benchmarks (RLLR). | **Market Benchmark — Prime Residential Mortgages** |
| `RULE_RATE_BASE_LAP` | Base Secured LAP Rate Card | **8.75% – 10.50%** | Property-backed commercial/retail credit pegged to RLLR + spread. | **Market Benchmark — Prime Secured Mortgage / LAP** |
| `RULE_RATE_BASE_GOLD` | Base Gold Loan Rate Card | **9.00% – 12.00%** | Liquid gold jewelry collateralized lending benchmark. | **Market Benchmark — Gold Loan NBFCs & Banks** |
| `RULE_RATE_BASE_2W_EV` | Base Two-Wheeler / EV Rate Card | **11.00% – 14.50%** | Retail two-wheeler and green mobility asset financing benchmark. | **Market Benchmark — Auto Lending Rate Cards** |
| `RULE_RATE_BASE_BUSINESS` | Base Unsecured MSME Business Rate | **13.50% – 18.00%** | Risk premium for uncollateralized small business cashflow loans. | **Market Benchmark — NBFC Business Loan Cards** |
| `RULE_CIBIL_PRIME_DISCOUNT` | CIBIL 750+ Prime Adjustment | **-0.50%** delta, $\pm 0.50\%$ spread | Prime credit history lowers underwriting risk and tightens rate band confidence. | **Market Benchmark — Tier-1 Bank Pricing Policies** |
| `RULE_CIBIL_GOOD_ADJUSTMENT` | CIBIL 700–749 Good Adjustment | **+0.75%** delta, $\pm 0.625\%$ spread | Standard retail risk pricing for near-prime credit profiles. | **Market Benchmark — Bank & NBFC Standard Cards** |
| `RULE_CIBIL_FAIR_PREMIUM` | CIBIL 650–699 Adjustment | **+2.50%** delta, $\pm 1.00\%$ spread | Moderate credit track record requires elevated risk premium. | **Market Benchmark — NBFC Risk Pricing** |
| `RULE_CIBIL_SUBPRIME_PREMIUM`| CIBIL $<650$ Subprime Adjustment | **+5.50%** delta, $\pm 1.75\%$ spread | Delinquency history restricts borrower to specialized risk-based pricing. | **Market Benchmark — High-Risk NBFC Pricing** |
| `RULE_CIBIL_UNKNOWN_SPREAD` | Unknown Credit Score Adjustment | **+1.50%** delta, **$\pm 1.75\%$** spread width | Adheres to **"Unknown is never zero"**: missing bureau history widens uncertainty rather than assuming default. | **Prototype Assumption / Honest Uncertainty Model** |
| `RULE_VINTAGE_STABILITY_DISC`| Corporate Stability Discount | **-0.50%** delta | Borrowers with $\ge 3$ years at employer receive corporate salary scheme rate discounts. | **Market Benchmark — Corporate Salary Package Norms** |

---

## 5. Statutory Taxes, Origination Fees & True Actuarial APR

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_FEE_PERSONAL_LOAN` | Standard Upfront Processing Fee | **1.50%** of principal | File origination, underwriting, and KYC processing fee. | **Market Benchmark — Standard Bank Fee Schedule** |
| `RULE_FEE_LAP_SECURED` | LAP Secured Processing Fee | **0.75%** of principal | Standard secured mortgage loan documentation fee. | **Market Benchmark — Housing Finance Fee Norms** |
| `RULE_GST_ON_FEES` | Statutory GST on Processing Fees | **18.0%** on fee amount | Mandated Indian goods and services tax on financial services. | **Statutory Mandate — Indian Goods and Services Tax Act** |
| `RULE_APR_ACTUARIAL_IRR` | Effective All-in APR Formula | Actuarial Monthly Internal Rate of Return ($\text{IRR}$) | Solves for the exact discount rate matching net in-hand disbursement (principal minus all upfront charges and GST) against the monthly EMI outflow stream. | **Source**: RBI mandate for all-inclusive APR / Key Fact Statement (KFS) disclosure.<br>**Calculation Method**: Prototype numerical IRR root-finder implemented for this self-assessment. |

---

## 6. Stress Testing & High-Cost Debt Rules

| Rule Identifier | Parameter / Threshold | Value in Engine | Financial Justification | Source Classification |
|---|---|---|---|---|
| `RULE_STRESS_INCOME_SHOCK` | Stress Scenario 1: Income Drop | **-20.0%** reduction | Tests borrower resilience against temporary earnings drop, freelance lull, or unexpected expenses. | **Prototype Assumption / Prudent Retail Stress Test** |
| `RULE_STRESS_RATE_SPIKE` | Stress Scenario 2: Floating Rate Spike | **+200 bps** (+2.0%) hike | Tests whether the monthly cash surplus can absorb macroeconomic interest rate tightening cycles. | **Prototype Assumption / Macroeconomic Rate Shock** |
| `RULE_DEBT_TRAP_APR_THRESHOLD`| High-Cost Debt APR Threshold | $\mathbf{> 24.0\%}$ APR | Unregulated digital app loans and revolving credit cards above 24% APR erode borrower principal and trigger default cascades. | **Market Benchmark — Digital Lending Guidelines & Usury Risk** |

---

## 7. Deterministic Precedence Hierarchy

When evaluating the O1 recommendation, the engine executes a strict deterministic safety cascade:

```text
1. PRECEDENCE 1: RESTRUCTURE_FIRST
   Trigger: Active >24% APR high-cost debt + recent repayment bounce.
   Action: Halt new unsecured borrowing; prioritize debt consolidation and clearance.

2. PRECEDENCE 2: DONT_BORROW
   Trigger: Current debt FOIR >= 50% OR monthly cash surplus <= 0.
   Action: Unaffordable baseline cashflow cannot support any incremental debt.

3. PRECEDENCE 3: BORROW_LESS
   Trigger: Requested amount > Safe Capacity OR Projected FOIR > 35% OR Lifestyle Ask > 25% annual pay.
   Action: Downsize loan request to fit within the conservative safe borrowing ceiling.

4. PRECEDENCE 4: BORROW
   Trigger: Requested loan fits within safe capacity, FOIR <= 35%, and surplus is resilient under stress.
   Action: Proceed with borrowing under recommended product terms and tenure.
```

---

## 8. Data Reliability vs. Borrower Risk (Confidence Model)

> [!NOTE]
> **Confidence Model Definition**:
> In the Lokta Borrower Copilot, **Confidence measures data completeness and estimation reliability**, not creditworthiness or borrowing safety.
> * A borrower with complete, verified documentation but severe debt distress receives **HIGH confidence** with a **`DONT_BORROW`** or **`RESTRUCTURE_FIRST`** verdict (high certainty in an adverse recommendation).
> * A borrower with missing credit history and unverified informal earnings receives **LOW confidence**, widening output uncertainty bands to reflect incomplete data.

---
*Lokta Borrower Copilot — Complete Rules Registry.*
