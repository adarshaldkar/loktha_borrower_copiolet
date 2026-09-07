# Lokta Borrower Copilot

A borrower-first self-assessment copilot built for the **Lokta Borrower Copilot Build Challenge**.

> **Live Demo & Local Execution**: Starts in under 2 minutes with zero backend, database, or API setup.

---

## Quickstart Guide (< 2 Minutes)

```bash
# 1. Navigate to project directory
cd lokta-borrower-copilot

# 2. Install dependencies (React, TypeScript, Vite, Zustand, Lucide)
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Submission Deliverables Overview

All required challenge deliverables are present at the root:

1. **The Working Application**: [`lokta-borrower-copilot/`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/lokta-borrower-copilot)
2. **RULES.md**: Complete registry of all rules, market benchmarks, fiduciary assumptions, and source classifications $\rightarrow$ [`RULES.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/RULES.md)
3. **Three Borrower Run-Throughs**: Step-by-step inputs, outputs, and Negotiation Cards for Priya, Ravi, and Anita $\rightarrow$ [`PERSONAS_RUNTHROUGH.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/PERSONAS_RUNTHROUGH.md)
4. **Five-Minute Walkthrough & Design Reflection**: Script, what we would build next, and what we would cut $\rightarrow$ [`WALKTHROUGH.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/WALKTHROUGH.md)

---

## Architecture & Product Capabilities

* **6 Product Pathways Supported**: The rule registry natively configures **Personal Loan** (10.5–13.5%), **Home Loan** (8.4–9.8%), **Loan Against Property / LAP** (8.75–10.5%), **Gold Loan** (9.0–12.0%), **Two-Wheeler / EV** (11.0–14.5%), and **Business Loan** (13.5–18.0%).
* **Independent 8-Question Core**: Answering only the 8 mandatory intake questions computes full O1–O4 outputs immediately with wider uncertainty bands; Tier-2 questions progressively tighten estimates.
* **Tier-2 Output Mapping**: Every single deepening question is mapped to a mathematical engine dependency (stability rate discounts, collateral secured routing, emergency savings buffer haircut, productive cashflow recognition).
* **Pure Mathematical Engine**: 100% computed dynamically from actuarial formulas (`PV`, `IRR`, reducing-balance amortization, precedence safety cascades). Zero hardcoded mock numbers.
* **Strict Ephemeral Privacy Guarantee**: No `localStorage`, no `sessionStorage`, no `IndexedDB`, no cookies, and no tracking scripts. All state resides strictly in browser session memory.
* **1-Screen Negotiation Card**: Summary grid (Requested vs Safe Ceiling, Shortest Safe Tenure, Fair Rate Benchmark, Max Safe EMI), lender red flags checklist, and copyable negotiation script.
* **Live Rule Playground**: Evaluators can modify safe FOIR caps or stress shocks live, observing instant real-time recalculations across all 4 output cards.

---

*Built for the Lokta Borrower Copilot Challenge.*
