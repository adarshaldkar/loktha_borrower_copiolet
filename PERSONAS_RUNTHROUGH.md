# LOKTA BORROWER COPILOT — THREE BORROWER RUN-THROUGHS (`PERSONAS_RUNTHROUGH.md`)

> **Note on Live Dynamic Execution**: These figures are a captured benchmark run from the current main revision; the application recalculates them dynamically for arbitrary user inputs and session rule adjustments.

This document records the exact questions asked, computed outputs, and Negotiation Cards generated for the three benchmark test personas: **Priya**, **Ravi**, and **Anita**. Every figure below is computed deterministically by the live financial engine.

---

## 1. Persona 1: Priya (29, Bengaluru · Salaried Software Engineer)

### A. Borrower Profile Inputs
* **Age**: 29
* **Employment Type**: Salaried MNC (5 years with current employer)
* **Monthly Take-Home Income**: ₹1,10,000 (Recognized: ₹1,10,000)
* **Existing Debt Service**: ₹14,000 / month car loan
* **Essential Living Costs**: ₹28,000 rent and basic expenses
* **Credit Score Band**: Prime (750+)
* **Loan Purpose**: Wedding / Lifestyle (Non-Productive)
* **Requested Loan Amount**: ₹8,00,000

### B. Questions Asked by the Copilot
* **Tier 1 (Core Intake)**: Loan Purpose (`Wedding / Lifestyle`), Requested Amount (`₹8,00,000`), Employment Type (`Salaried MNC`), Monthly Take-Home Income (`₹1,10,000`), Existing Monthly EMIs (`₹14,000`), Essential Living Costs (`₹28,000`), Age (`29`), Credit Score Band (`Prime 750+`).
* **Tier 2 (Salaried Deepening)**: Years at Current Employer (`5`), Employer Category (`MNC`), Emergency Savings (`4 months`), Co-Applicant Income (`N/A`).

### C. The 4 Outputs Produced
1. **O1 Recommendation**: **`BORROW LESS`**
   * *Verdict*: `BORROW LESS`
   * *Headline Reason*: The requested ₹8,00,000 loan exceeds your safe borrowing capacity of ₹7,32,400 and pushes projected FOIR above conservative limits.
   * *FOIR Metrics*: Current FOIR: **12.7%** | Projected FOIR: **37.1%** | Safe FOIR Cap: **35.0%**
2. **O2 Capacity**:
   * *Estimated Lender Capacity*: **₹19,07,500** (bank underwriting at 50% FOIR without deducting actual rent).
   * *Safe Borrower Capacity*: **₹7,32,400** (preserves ₹33,000/mo uncommitted buffer).
   * *Guidance*: "Use this number: ₹7,32,400. ₹24,500 safe monthly EMI → approximately ₹7,32,400 safe borrowing capacity at 12.50% over 36 mo."
3. **O3 Pricing & True Cost**:
   * *Product Pathway*: **Unsecured Personal Loan**
   * *Fair Rate Band*: **9.50% – 12.50%** (Base: 10.50%–13.50%, Prime discount: -0.50%, 5-year corporate stability discount: -0.50%)
   * *Nominal Rate Used for APR*: **11.00%**
   * *Upfront Charges*: Processing fee (1.50% = ₹12,000) + 18% GST (₹2,160) = **₹14,160**
   * *Net In-Hand Disbursement*: **₹7,85,840**
   * *True Actuarial APR*: **12.24% APR**
4. **O4 Outflow & Stress Testing**:
   * *Safe Monthly EMI Ceiling*: **₹24,500 / month**
   * *Tenure Schedule (for ₹8,00,000 requested)*:
     * **24 Months**: EMI ₹37,300 | Total Interest ₹94,900 | Total Outflow ₹8,94,900
     * **36 Months**: EMI ₹26,200 | Total Interest ₹1,42,900 | Total Outflow ₹9,42,900
     * **60 Months**: EMI **₹17,400** | Total Interest ₹2,43,600 | Total Outflow ₹10,43,600 *(Fits within ₹24,500/mo safe ceiling)*
   * *Stress Testing*:
     * *Income Shock (-20%)*: Income becomes ₹88,000, surplus ₹42,700/mo (**Passes / Resilient**).
     * *Rate Spike (+2.00 pp)*: Rate becomes 13.00%, EMI +₹785/mo, surplus ₹63,900/mo (**Passes / Resilient**).

### D. Priya's Negotiation Card
* **Requested vs Safe**: `₹8,00,000 → ₹7,32,400`
* **Shortest Safe Tenure**: `60 mo` (for ₹8L request) or `36 mo` (at safe ₹7.32L cap)
* **Fair Rate Benchmark**: `9.50% – 12.50%`
* **Max Safe EMI**: `₹24,500 / month`
* **Confidence**: **HIGH** (Stable salaried income, verified prime credit score, 5-year corporate vintage).
* **Verbal Script**:
  > *"I am seeking a capped sanction of ₹7,32,400 (from an original ₹8,00,000 request). My credit score is prime (750+) with 5 years at my current employer. My estimated fair range is 9.50%–12.50% based on this assessment. If you can match around 11.00% with processing fees capped at 1.50%, I am prepared to finalize today. I do not require bundled insurance."*

---

## 2. Persona 2: Ravi (42, Mysuru · Self-Employed Kirana Store Owner)

### A. Borrower Profile Inputs
* **Age**: 42
* **Employment Type**: Self-Employed Business (Kirana Owner)
* **Monthly Net Cashflow**: ₹60,000 (Documented tax profit: ₹35,000; Unrecorded cashflow: ₹25,000)
* **Recognized Primary Income**: ₹35,000 + (₹25,000 × 50%) = ₹47,500 / month
* **Spouse Income**: ₹18,000 teaching (Recognized: ₹18,000)
* **Productive Income Potential**: ₹12,000 from stock expansion (Recognized at 50%: ₹6,000)
* **Effective Recognized Income**: ₹47,500 + ₹18,000 + ₹6,000 = **₹71,500 / month**
* **Unencumbered Property Collateral**: ₹45,00,000 commercial shop premises ($\ge ₹10L$ routing threshold)
* **Credit Score Band**: Unknown (No formal bureau history)
* **Existing Debt**: ₹0 / month
* **Essential Living Costs**: ₹18,000 / month
* **Loan Purpose**: Kirana Stock & Delivery Vehicle (Productive MSME)
* **Requested Loan Amount**: ₹15,00,000

### B. Questions Asked by the Copilot
* **Tier 1 (Core Intake)**: Loan Purpose (`Kirana Stock & Vehicle`), Requested Amount (`₹15,00,000`), Employment Type (`Self-Employed Business`), Monthly Net Cashflow (`₹60,000`), Existing Monthly EMIs (`₹0`), Essential Living Costs (`₹18,000`), Age (`42`), Credit Score Band (`Unknown`).
* **Tier 2 (MSME Deepening)**: Documented Monthly Profit (`₹35,000`), Unencumbered Collateral Value (`₹45,00,000`), Spouse / Co-Applicant Income (`₹18,000`), Emergency Savings (`3 months`), Productive Revenue Potential (`₹12,000`).

### C. The 4 Outputs Produced
1. **O1 Recommendation**: **`BORROW`**
   * *Verdict*: `BORROW`
   * *Headline Reason*: The requested ₹15,00,000 loan stays within your ₹16,92,700 safe capacity and current cashflow is resilient.
   * *FOIR Metrics*: Current FOIR: **0.0%** | Projected FOIR: **31.0%** | Safe FOIR Cap: **35.0%**
2. **O2 Capacity (Explicit Formula)**:
   * *Lender Capacity Formula*: $\text{Lender Capacity} = \min(\text{FOIR-based Max Sanction}, \text{LTV Collateral Cap})$
     * *FOIR-based Max Sanction* ($60\%$ FOIR @ $8.75\%$ over $120\text{ mo}$): **₹29,35,000**
     * *LTV Collateral Cap* ($50\%$ LTV of $₹45\text{L}$): **₹22,50,000**
     * *Resulting Estimated Lender Capacity*: $\min(₹29.35\text{L}, ₹22.50\text{L}) =$ **₹22,50,000**
   * *Safe Borrower Capacity*: **₹16,92,700** (amortized over 120 months under LAP norms preserving cash buffers).
   * *Guidance*: "Use this number: ₹16,92,700. ₹25,000 safe monthly EMI → approximately ₹16,92,700 safe borrowing capacity at 12.75% over 120 mo."
3. **O3 Pricing & True Cost**:
   * *Product Pathway*: **Loan Against Property (LAP Secured)**
   * *Fair Rate Band*: **8.75% – 12.75%** (Base: 8.75%–10.50%, Unknown credit delta +1.50% with spread widening)
   * *Nominal Rate Used for APR*: **10.75%**
   * *Upfront Charges*: Processing fee (0.75% = ₹11,250) + 18% GST (₹2,025) = **₹13,275**
   * *Net In-Hand Disbursement*: **₹14,86,725**
   * *True Actuarial APR*: **10.97% APR**
4. **O4 Outflow & Stress Testing**:
   * *Safe Monthly EMI Ceiling*: **₹25,000 / month**
   * *Tenure Schedule (for ₹15,00,000 requested LAP)*:
     * **84 Months**: EMI ₹25,500 | Total Interest ₹6,40,900 | Total Outflow ₹21,40,900
     * **120 Months**: EMI **₹20,500** | Total Interest ₹9,54,100 | Total Outflow ₹24,54,100 *(Recommended)*
   * *Stress Testing*:
     * *Income Shock (-20%)*: Shocked income ₹57,200, surplus ₹18,700/mo (**Passes / Resilient**).
     * *Rate Spike (+2.00 pp)*: Rate becomes 12.75%, EMI +₹1,750/mo, surplus ₹31,250/mo (**Passes / Resilient**).

### D. Ravi's Negotiation Card
* **Requested vs Safe**: `₹15,00,000 → ₹16,92,700`
* **Shortest Safe Tenure**: `120 mo`
* **Fair Rate Benchmark**: `8.75% – 12.75%`
* **Max Safe EMI**: `₹25,000 / month`
* **Confidence**: **MEDIUM** (Unverified bureau history and self-reported cashflow expand uncertainty bands, but property collateral provides high downside security).
* **Verbal Script**:
  > *"I am applying for a ₹15,00,000 credit line under LAP SECURED against unencumbered commercial property valued at approximately ₹45,00,000. For this asset profile, my estimated fair range is 8.75%–12.75% based on this assessment. Please structure this as a term facility at 10.75% with processing fees capped at 0.75%."*

---

## 3. Persona 3: Anita (35, Hubballi · Informal Gig Worker & Tailor)

### A. Borrower Profile Inputs
* **Age**: 35
* **Employment Type**: Informal Gig Worker (Rider + Tailoring)
* **Monthly Net Earnings**: ₹28,000 (after 35% informal haircut: ₹18,200 recognized)
* **Productive Income Potential**: ₹7,000 expected EV revenue (Recognized at 50%: ₹3,500)
* **Effective Recognized Income**: ₹18,200 + ₹3,500 = **₹21,700 / month**
* **Existing Debt Burden**: ₹3,500 / month across high-cost digital app loans
* **High-Cost Debt APR**: **30.0% APR**
* **Recent Repayment Track Record**: **1 EMI bounce** in the last month
* **Essential Living Costs**: ₹16,000 / month
* **Emergency Buffer**: **0 Months** (triggers -5.0% low savings FOIR haircut $\rightarrow$ Safe FOIR = 20.0%)
* **Credit Score Band**: Unknown
* **Loan Purpose**: Two-Wheeler / EV (Mobility Asset)
* **Requested Loan Amount**: ₹1,50,000

### B. Questions Asked by the Copilot
* **Tier 1 (Core Intake)**: Loan Purpose (`Two-Wheeler EV`), Requested Amount (`₹1,50,000`), Employment Type (`Informal Gig`), Monthly Net Income (`₹28,000`), Existing Monthly EMIs (`₹3,500`), Essential Living Costs (`₹16,000`), Age (`35`), Credit Score Band (`Unknown`).
* **Tier 2 (Informal Deepening)**: High-Cost Debt APR (`30%`), Recent EMI Bounce (`Yes`), Emergency Savings (`0 Months`), Productive Revenue Potential (`₹7,000`).

### C. The 4 Outputs Produced
1. **O1 Recommendation**: **`RESTRUCTURE_FIRST`**
   * *Verdict*: `RESTRUCTURE_FIRST`
   * *Headline Reason*: Recent repayment stress combined with high-cost debt (30% APR) makes new unsecured borrowing unsafe.
   * *FOIR Metrics*: Current FOIR: **16.1%** | Projected FOIR: **41.0%** | Safe FOIR Cap: **20.0%**
2. **O2 Capacity (Pre-Safety vs Actionable Borrowing Capacity)**:
   * *Estimated Lender Capacity (Digital Apps)*: **₹4,82,900** (predatory digital app limit).
   * *Pre-Safety Mathematical Cashflow Capacity*: **₹23,300** (nominal cashflow capacity before risk override).
   * *Actionable Safe New-Borrowing Capacity*: **₹0** (Restructuring priority: New unsecured borrowing is unsafe while active 30% APR debt and repayment stress persist).
   * *Guidance*: "Use this number: ₹0. Restructuring recommended: Clear high-cost 30% APR debt first before taking on any new liabilities."
3. **O3 Pricing & True Cost**:
   * *Product Pathway*: **Two-Wheeler / EV Financing**
   * *Fair Rate Band*: **12.00% – 17.75%** (Subsidized asset loan benchmark with unknown score spread)
   * *Nominal Rate Used for APR*: **14.88%**
   * *Predatory Warning*: *Reject any short-term credit app quoting $>18\%$ APR.*
4. **O4 Outflow & Stress Testing**:
   * *Safe Monthly EMI Ceiling*: **₹800 / month** (achievable post-restructuring).
   * *Tenure Schedule (for ₹1,50,000)*:
     * **24 Months**: EMI ₹7,300 | Total Interest ₹24,300 | Total Outflow ₹1,74,300
     * **36 Months**: EMI ₹5,200 | Total Interest ₹36,900 | Total Outflow ₹1,86,900
     * **48 Months**: EMI ₹4,200 | Total Interest ₹49,900 | Total Outflow ₹1,99,900
   * *Stress Testing*:
     * *Income Shock (-20%)*: Any further earnings reduction pushes monthly cashflow into immediate deficit (**Deficit / Unsafe**).

### D. Anita's Negotiation Card & Action Plan
* **Requested vs Safe**: `₹1,50,000 → ₹0 (Restructure)`
* **Priority**: `Debt clearance`
* **Fair Rate Benchmark**: `12.00% – 17.75%`
* **Max Safe EMI**: `₹0 new EMI`
* **Confidence**: **LOW** (Informal earnings volatility, zero liquid buffer, active 30% APR app debt, and recent bounce severely constrain estimation reliability).
* **Verbal Script**:
  > *"I am currently prioritizing restructuring and clearing my existing high-cost credit (30% APR) before taking on any new unsecured borrowing. For essential mobility or asset requirements, I am only exploring structured, subsidized schemes (targeting 12.00%–17.75%) and will not accept high-cost digital app credit."*

---
*Lokta Borrower Copilot — Complete Persona Run-Throughs.*
