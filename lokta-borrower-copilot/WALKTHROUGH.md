# LOKTA BORROWER COPILOT — 5-MINUTE WALKTHROUGH & DESIGN REFLECTION (`WALKTHROUGH.md`)

---

## 1. Five-Minute Product Walkthrough (Script / Executive Summary)

### The Core Problem
In Indian retail lending, the borrower walks into a branch at a structural disadvantage. Banks and NBFCs possess proprietary credit risk algorithms, aggressive debt-to-income (FOIR) limits, and multi-tier fee structures. The borrower has nothing. They accept bloated sanctions that consume 60% of their salary, high floating rates, and undisclosed processing fees.

**The Lokta Borrower Copilot is a borrower-first counter-model.** It turns lending judgement, statutory taxes (18% GST), and consumer credit protection into transparent, machine-executable rules.

### How the Product Works:
1. **Adaptive Questioning**:
   * A salaried engineer (Priya) is asked about corporate employer stability and corporate vintage.
   * A kirana store owner (Ravi) is asked about documented ITR vs. cashflow and unencumbered shop collateral, dynamically routing him to a **Secured LAP Pathway (8.75%–10.5%)** instead of an 18% unsecured loan.
   * An informal worker (Anita) is asked about high-cost app debt and recent bounces, activating an immediate **🛑 Stop New Borrowing / Restructure First** safety gate.
2. **The 4 Outputs**:
   * **O1 Decision**: Deterministic safety cascade (`BORROW`, `BORROW LESS`, `DONT_BORROW`, `RESTRUCTURE_FIRST`).
   * **O2 Capacity**: Explicitly separates **Estimated Lender Capacity** from **Safe Borrower Capacity**, explaining why lenders inflate sanctions and instructing which number to follow.
   * **O3 Fair Rate & All-in APR**: Calculates fair rate bands and the true actuarial APR (including processing fees + 18% GST).
   * **O4 Safe Monthly EMI & Stress**: Amortization schedules across tenures and interactive stress testing (-20% income reduction, +200 bps rate spike).
3. **1-Screen Negotiation Card & Offer Evaluator**:
   * A single, print-ready screen with red flags and verbal negotiation scripts.
   * Includes a **Lender Quote Comparator** where borrowers can plug in an actual bank sanction to detect overpricing and excess costs.
4. **Live Rule Inspector (For Evaluation)**:
   * Evaluators can modify safe FOIR (35% $\rightarrow$ 45%) or stress shocks live, watching the entire app and all 3 personas recalculate in real-time.

---

## 2. What We Would Build Next (Future Roadmap)

If given an additional 2–3 weeks of engineering and domain research:

1. **Direct Account Aggregator (AA) Consent-Driven Ingestion**:
   * Allow users to securely fetch their bank statement cashflows via RBI's Account Aggregator framework (e.g. Setu / Sahamati) without sharing credentials.
   * Automatically categorize essential vs. discretionary expenses to refine the Safe Cash Surplus buffer with zero user friction.
2. **Loan Clause & Sanction Letter Optical Scanner (OCR)**:
   * Allow borrowers to upload a PDF or photo of a bank sanction letter.
   * Automatically extract hidden clauses (prepayment foreclosure penalties, reset periods, mandatory credit insurance) and highlight predatory terms in red on the Negotiation Card.
3. **Multi-Lender Regional Benchmark Feed**:
   * Integrate anonymized, crowdsourced rate cards by pincode and employer tier across PSU banks, private banks, and NBFCs to tighten rate bands with real-time market data.

---

## 3. What We Would Cut (Scope & Simplicity Reflection)

To maintain focus and avoid over-engineering:

1. **Cut Heavy ML / Neural Underwriting Models**:
   * Black-box machine learning models destroy explainability. A borrower cannot take a neural network prediction to a bank manager; they need clear, defensible rules (`"My CIBIL is 780, my FOIR is 29%, therefore my fair rate is 11.25%"`).
2. **Cut Complex Multi-Page Questionnaires**:
   * Borrowers abandon long 30-question forms. We would strictly prune any question that does not mathematically tighten an output.
3. **Cut Backend Data Storage & Authentication**:
   * Storing borrower financial data creates privacy and compliance overhead. Keeping the tool 100% client-side and ephemeral maximizes borrower trust and guarantees instant local execution.

---
*Lokta Borrower Copilot — Walkthrough & Design Reflection Complete.*
