# Lokta Borrower Copilot

A borrower-first self-assessment copilot built for the **Lokta Borrower Copilot Build Challenge**.

> **Live Demo & Local Execution**: Starts in under 5 minutes with zero backend or database setup.

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

## Submission Deliverables

All four required deliverables are complete and available at the root:

1. **The Working Application**: Located in [`lokta-borrower-copilot/`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/lokta-borrower-copilot)
2. **RULES.md**: Complete registry of all rules, thresholds, and source classifications $\rightarrow$ [`RULES.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/RULES.md)
3. **Three Borrower Run-Throughs**: Step-by-step outputs and Negotiation Cards for Priya, Ravi, and Anita $\rightarrow$ [`PERSONAS_RUNTHROUGH.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/PERSONAS_RUNTHROUGH.md)
4. **Five-Minute Walkthrough & Design Reflection**: What we would build next and what we would cut $\rightarrow$ [`WALKTHROUGH.md`](file:///c:/Users/shrut/Desktop/Loktha%20Assignment/WALKTHROUGH.md)

---

## Key Features & Product Highlights

* **Pure, Dynamic Calculation Engine**: 100% computed at runtime from formulas (`PV`, `IRR`, `Amortization`, `Precedence Cascades`). Zero hardcoded mock results.
* **Two-Tier Adaptive Questionnaire**: Tier 1 (8 Must Questions) + Tier 2 (Deepening branches for Salaried, Self-Employed, and Informal).
* **"Unknown is Never Zero"**: Tri-state data model (`KNOWN`, `UNKNOWN`, `NOT_APPLICABLE`). Unknown credit score widens uncertainty bands honestly.
* **4 Core Outputs (O1–O4)**:
  * **O1 Decision**: Deterministic Precedence Cascade (`BORROW`, `BORROW_LESS`, `DONT_BORROW`, `RESTRUCTURE_FIRST`).
  * **O2 Capacity**: Clear separation of **Estimated Lender Capacity** vs. **Safe Borrower Capacity** with explicit guidance.
  * **O3 Pricing**: Fair Rate Band + True All-in APR (including processing fees + 18% statutory GST).
  * **O4 Outflow**: Maximum safe monthly EMI, 3-tenure trade-off schedules, and 2-scenario stress simulations (-20% income, +200 bps rate).
* **1-Screen Negotiation Card**: Branch-ready weapon with red flags checklist and verbal negotiation scripts.
* **Compare a Lender Offer**: Dedicated tool to plug in actual bank sanction quotes to detect overpricing and APR deltas.
* **Live Rule Inspector**: Floating sandbox allowing evaluators to adjust Safe FOIR (35% $\rightarrow$ 45%) or stress shocks live with instant recalculation.
* **Automated Invariant Test Suite**: Embedded test panel verifying Priya, Ravi, Anita, mathematical formulas, and boundary edge cases.
