# Lokta Borrower Copilot

A borrower-first self-assessment copilot built for the **Lokta Borrower Copilot Build Challenge**.

> **Local Execution**: Runs locally in under 2 minutes with zero backend, database, or API setup.

---

## Quickstart Guide (< 2 Minutes)

```bash
# 1. Navigate to project directory
cd lokta-borrower-copilot

# 2. Install dependencies (React, TypeScript, Vite, Zustand, Lucide, Vitest)
npm install

# 3. Run automated tests (100% passing)
npm run test:run

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Submission Deliverables Overview

All four required challenge deliverables are present at the root of this repository:

1. **The Working Application**: [`lokta-borrower-copilot/`](./lokta-borrower-copilot/)
2. **RULES.md**: Complete registry of all rules, market benchmarks, fiduciary assumptions, and source classifications $\rightarrow$ [`RULES.md`](./RULES.md)
3. **Three Borrower Run-Throughs**: Step-by-step inputs, exact engine outputs, and Negotiation Cards for Priya, Ravi, and Anita $\rightarrow$ [`PERSONAS_RUNTHROUGH.md`](./PERSONAS_RUNTHROUGH.md)
4. **Five-Minute Walkthrough & Design Reflection**: Script, what we would build next, and what we would cut $\rightarrow$ [`WALKTHROUGH.md`](./WALKTHROUGH.md)

---

## Architecture & Product Capabilities

* **Six Product Pathways**: The configuration and routing layer supports **Personal Loan** (10.5–13.5%), **Home Loan** (8.4–9.8%), **Loan Against Property / LAP** (8.75–10.5%), **Gold Loan** (9.0–12.0%), **Two-Wheeler / EV** (11.0–14.5%), and **Business Loan** (13.5–18.0%). The assessment walkthrough and persona bar focus on the three supplied borrower personas.
* **Independent 8-Question Core**: Answering only the 8 mandatory intake questions computes full O1–O4 outputs immediately with wider uncertainty bands; Tier-2 questions progressively tighten estimates.
* **Tier-2 Output Mapping**: Every single deepening question is mapped to a mathematical engine dependency (stability rate discounts, collateral secured routing, emergency savings buffer haircut, productive cashflow recognition).
* **Pure Mathematical Engine**: 100% computed dynamically from actuarial formulas (`PV`, numerical root-finder `IRR` for APR, reducing-balance amortization, precedence safety cascades). Zero hardcoded mock outputs.
* **Ephemeral Privacy Design**: The application does not persist borrower inputs to `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or any remote server. All state resides strictly in browser session memory.
* **1-Screen Negotiation Card**: Summary grid (Requested vs Safe Ceiling, Shortest Safe Tenure, Fair Rate Benchmark, Max Safe EMI), lender red flags checklist, and copyable negotiation script.
* **Live Rule Playground**: Evaluators can modify safe FOIR caps or stress shocks live, observing instant real-time recalculations across all 4 output cards.

---

## Automated Test Suite

Run the full automated test suite containing mathematical verifications and persona run-through assertions:

```bash
cd lokta-borrower-copilot
npm run test:run
```

---
*Built for the Lokta Borrower Copilot Challenge.*
