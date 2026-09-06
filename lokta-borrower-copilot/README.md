# Lokta Borrower Copilot

Client-side prototype for the Lokta Software Engineering Intern — Borrower Copilot build challenge.

## What it does

The app is a deterministic, transparent self-assessment for an Indian borrower. It covers the four required outputs: borrowing decision, lender-side vs safe capacity, fair-rate band and all-in APR, and safe EMI with stress testing. It also includes a Negotiation Card and lender-offer comparison.

## Core principle

**There are no hardcoded assessment results.** Priya, Ravi, and Anita are input presets only. Every result is recomputed at runtime from borrower answers and the active rule configuration.

## Quick start

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

The app is frontend-only. No database, backend, login, or bureau integration is required.

## Architecture

```text
Adaptive Questionnaire
        ↓
Borrower Profile / State
        ↓
Product Pathway Router
        ↓
Declarative Rules (src/config/rules.config.ts)
        ↓
Deterministic Engine
  ├─ O1 Decision
  ├─ O2 Capacity
  ├─ O3 Pricing / APR
  └─ O4 EMI / Stress
        ↓
Explainability Traces
        ↓
Results Dashboard
        ↓
Negotiation Card + Offer Comparison
```

## Repository structure

```text
src/
├── components/              # questionnaire, outputs, card, offer comparison, rule playground
├── config/                  # declarative financial rules
├── data/                    # borrower input presets only
├── engine/                  # pure calculation and decision functions
├── questionnaire/           # Tier 1 / Tier 2 question definitions
├── store/                   # answers + active session rules
└── types/                   # strict domain types

RULES.md
PERSONAS_RUNTHROUGH.md
WALKTHROUGH.md
SUBMISSION_CHECKLIST.md
```

## Assumptions and limits

Prototype assumptions are explicitly labelled in `RULES.md`. They are not universal lender policy, financial advice, or a substitute for lender underwriting. Actual approval, pricing, documentation, collateral valuation, and eligibility depend on lender-specific verification and applicable rules.

## Persona demo

Use the persona selector to load Priya, Ravi, or Anita. The selector populates input fields; the same engine processes the profile.

## Live rule demo

The Rule Playground changes session-only parameters such as safe FOIR, lender FOIR, income shock, and rate shock. Dependent calculations update through the same engine.
