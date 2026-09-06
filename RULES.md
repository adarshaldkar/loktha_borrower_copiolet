# LOKTA BORROWER COPILOT — RULES & ASSUMPTIONS REGISTRY (`RULES.md`)

This document records every rule, threshold, rate band, and modeling assumption implemented in the **Lokta Borrower Copilot**, categorized transparently by its source and justification.

---

## 1. Affordability & Debt Capacity Thresholds (FOIR & NDCF)

| Rule Identifier | Parameter / Threshold | Value | Why It Exists (Financial Justification) | Source Classification |
|---|---|---|---|---|
| `RULE_FOIR_SAFE_SALARIED` | Maximum Safe FOIR (Salaried Corporate) | **35.0%** of net income | Preserves 65% of net monthly take-home for non-negotiable living costs (rent, food, dependent expenses) and emergency savings. | **Prototype Assumption / Conservative Fiduciary Standard** |
| `RULE_FOIR_SAFE_INFORMAL` | Maximum Safe FOIR (Informal / Gig Worker) | **25.0%** of net income | Volatile, irregular income streams require a wider cash buffer to prevent default during earning lulls or health shocks. | **Prototype Assumption / Microfinance Best Practice** |
| `RULE_FOIR_LENDER_SALARIED` | Commercial Bank Underwriting FOIR | **50.0% – 55.0%** of stated pay | Commercial retail lenders underwrite aggressive debt caps on gross income without factoring in actual rent or living obligations. | **Market Benchmark — Observed Indian Retail Banking Policy** |
| `RULE_FOIR_LENDER_SECURED` | Commercial Secured LAP FOIR | **60.0%** of recognized profit | Lenders permit higher debt service ratios when secured by high-value real estate collateral. | **Market Benchmark — Housing Finance & LAP Norms** |
| `RULE_SURPLUS_BUFFER_RETAIN`| Discretionary Cash Surplus Retention | **40.0%** buffer retained | Ensures new loan EMIs do not consume more than 60% of uncommitted surplus cash at month-end. | **Prototype Assumption / Fiduciary Debt Safety** |
| `RULE_LIFESTYLE_INCOME_LIMIT`| Non-Productive Lifestyle Loan Cap | **25.0%** of annual pay | Limits unhedged personal/wedding consumption loans so borrowers do not pledge future earnings to lifestyle debt. | **Prototype Assumption / Consumer Credit Safety** |

---

## 2. Product Routing & Collateral Norms

| Rule Identifier | Parameter / Threshold | Value | Why It Exists (Financial Justification) | Source Classification |
|---|---|---|---|---|
| `RULE_PATHWAY_LAP_TRIGGER` | Property Collateral Secured Routing | Activated if unencumbered property $> ₹10L$ | Routes self-employed applicants with unencumbered real estate to secured LAP (8.75%–10.5%) instead of expensive unsecured loans (16%+). | **Domain Reasoning / Product Optimization** |
| `RULE_LAP_LTV_MAX` | Maximum Loan-to-Value (LAP) | **50.0%** of property value | Conservative valuation cushion ensuring loan principal is fully covered against real estate illiquidity. | **Market Benchmark — Standard LAP Underwriting** |
| `RULE_PATHWAY_EV_MOBILITY` | Two-Wheeler / EV Product Routing | Activated if purpose is EV / Scooter | Unlocks dedicated asset financing terms (24–48 months) with lower risk spreads compared to personal loans. | **Market Benchmark — Green Mobility Lending** |

---

## 3. Interest Rate Bands, Risk Premiums & Uncertainty

| Rule Identifier | Parameter / Threshold | Value | Why It Exists (Financial Justification) | Source Classification |
|---|---|---|---|---|
| `RULE_RATE_BASE_PERSONAL` | Base Personal Loan Rate Band | **10.50% – 13.50%** | Standard reducing-balance rate card for prime/near-prime salaried borrowers in India (2026). | **Market Benchmark — Bank & NBFC Rate Cards** |
| `RULE_RATE_BASE_LAP` | Base Secured LAP Rate Band | **8.75% – 10.50%** | Property-backed credit benchmark pegged to repo-linked lending rates (RLLR). | **Market Benchmark — Prime Secured Mortgage / LAP** |
| `RULE_RATE_BASE_2W_EV` | Base Two-Wheeler / EV Rate Band | **11.00% – 14.50%** | Standard retail vehicle asset financing benchmark. | **Market Benchmark — Auto Lending Rates** |
| `RULE_RATE_BASE_BUSINESS` | Base Unsecured MSME Business Rate | **13.50% – 18.00%** | Higher risk premium charged for uncollateralized small business cashflow lending. | **Market Benchmark — NBFC Business Loan Cards** |
| `RULE_CIBIL_PRIME_DISCOUNT` | CIBIL 750+ Prime Adjustment | **-0.50%** delta, $\pm 0.5\%$ spread | Prime credit history lowers underwriting risk and tightens rate band confidence. | **Market Benchmark — Tier-1 Bank Pricing** |
| `RULE_CIBIL_FAIR_PREMIUM` | CIBIL 650–699 Adjustment | **+2.50%** delta, $\pm 1.0\%$ spread | Moderate credit track record requires elevated risk premium. | **Market Benchmark — NBFC Risk Pricing** |
| `RULE_CIBIL_SUBPRIME_PREMIUM`| CIBIL $<650$ Subprime Adjustment | **+5.50%** delta, $\pm 1.75\%$ spread | High delinquency probability restricts borrower to specialized subprime lenders. | **Market Benchmark — High-Risk Lending Policy** |
| `RULE_CIBIL_UNKNOWN_SPREAD` | Unknown Credit Score Band Expansion | **+1.50%** delta, **$\pm 1.75\%$** spread width | Adheres to **"Unknown is never zero"**: missing credit history widens uncertainty rather than assuming default. | **Prototype Assumption / Honest Uncertainty Model** |
| `RULE_VINTAGE_STABILITY_DISC`| Corporate Stability Discount | **-0.25% to -0.50%** delta | Borrowers with $>3$ years at Tier-1 MNC/Govt employers receive premier banking waivers. | **Market Benchmark — Corporate Salary Schemes** |

---

## 4. Statutory Taxes, Fees & True All-in APR

| Rule Identifier | Parameter / Threshold | Value | Why It Exists (Financial Justification) | Source Classification |
|---|---|---|---|---|
| `RULE_FEE_PERSONAL_LOAN` | Standard Upfront Processing Fee | **1.50%** of principal | Standard origination and file processing fee charged by Indian retail lenders. | **Market Benchmark — Standard Bank Fee Schedule** |
| `RULE_GST_ON_FEES` | Statutory GST on Processing Fees | **18.0%** on fee amount | Mandated Indian goods and services tax on financial intermediation fees. | **Statutory Mandate — Indian GST Act** |
| `RULE_APR_ACTUARIAL_IRR` | Effective All-in APR Formula | Monthly Internal Rate of Return ($\text{IRR}$) | Solves for true discount rate matching net in-hand disbursement against monthly EMI stream. | **RBI Standard on All-in APR Cost Disclosure** |

---

## 5. Stress Testing Parameters

| Rule Identifier | Parameter / Threshold | Value | Why It Exists (Financial Justification) | Source Classification |
|---|---|---|---|---|
| `RULE_STRESS_INCOME_SHOCK` | Stress Scenario 1: Income Drop | **-20.0%** reduction | Tests borrower resilience against temporary gig lull, freelance dip, or economic downturn. | **Prototype Assumption / Prudent Retail Stress Test** |
| `RULE_STRESS_RATE_SPIKE` | Stress Scenario 2: Floating Rate Spike | **+200 bps** (+2.0%) hike | Tests whether the monthly cash surplus can absorb macroeconomic interest rate tightening cycles. | **Prototype Assumption / Macroeconomic Rate Shock** |

---

## 6. Deterministic Rule Precedence Hierarchy

When evaluating the O1 verdict, the engine executes a strict precedence cascade:

```
1. PRECEDENCE 1: SAFETY_STOP_DEBT_TRAP  (Active >24% APR app debt + recent bounce -> 🛑 STOP NEW BORROWING)
2. PRECEDENCE 2: INSOLVENCY_STOP        (Current FOIR >= 50% or Cash Surplus <= 0 -> DON'T BORROW)
3. PRECEDENCE 3: PRUDENT_DOWNSIZING     (Requested EMI pushes FOIR > 35% or Ask > Safe Cap -> BORROW LESS)
4. PRECEDENCE 4: SAFE_APPROVAL          (Debt FOIR <= 35%, healthy surplus, no bounces -> BORROW)
```

---
*Lokta Borrower Copilot — Complete Rules Registry.*
