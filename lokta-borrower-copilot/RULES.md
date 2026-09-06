# Lokta Borrower Copilot — Rules & Assumptions Registry

This document records the current prototype's configurable rules.

> **Important:** Values labelled **My Judgement / Prototype Assumption** are modelling choices for the assessment. They should not be presented as universal lender policy or regulatory mandates without separate verification.

| Rule | Value | Why | Source / classification |
|---|---:|---|---|
| Safe FOIR — Salaried | 35% | Conservative debt-service ceiling with room for living costs and shocks. | My Judgement / Prototype Assumption |
| Safe FOIR — Informal / Gig | 25% | Larger buffer for irregular income. | My Judgement / Prototype Assumption |
| Estimated lender FOIR — Standard | 50% | Illustrative lender-side sizing benchmark. | My Judgement / Prototype Benchmark |
| Estimated lender FOIR — Secured | 60% | Illustrative secured-credit sizing benchmark. | My Judgement / Prototype Benchmark |
| Personal loan base band | 10.50%–13.50% | Range-based pricing rather than false precision. | My Judgement / Prototype Market Benchmark |
| LAP base band | 8.75%–10.50% | Prototype secured-credit range. | My Judgement / Prototype Market Benchmark |
| EV two-wheeler base band | 11.00%–14.50% | Prototype asset-financing range. | My Judgement / Prototype Market Benchmark |
| Business loan base band | 13.50%–18.00% | Prototype unsecured business range. | My Judgement / Prototype Market Benchmark |
| Prime CIBIL delta | -0.50% | Rewards stronger observed credit quality. | My Judgement / Prototype Assumption |
| Good CIBIL delta | +0.75% | Modest risk spread. | My Judgement / Prototype Assumption |
| Fair CIBIL delta | +2.50% | Larger risk spread. | My Judgement / Prototype Assumption |
| Subprime CIBIL delta | +5.50% | Materially higher prototype risk spread. | My Judgement / Prototype Assumption |
| Unknown CIBIL | +1.50% delta + wider spread | Missing credit history increases pricing uncertainty. | My Judgement / Uncertainty Principle |
| Default processing fee | 1.50% | Illustrative comparison benchmark. | My Judgement / Prototype Benchmark |
| GST on processing fee | 18% | Used in the prototype's fee calculation; verify for production/legal use. | Regulatory/tax treatment to verify |
| Documentation fee default | ₹0 | Neutral baseline when no fee is quoted. | My Judgement / Prototype Default |
| Surplus retained factor | 60% | Retains part of monthly surplus as a safety buffer. | My Judgement / Prototype Assumption |
| Lifestyle annual-income limit | 25% | Limits large non-productive personal borrowing. | My Judgement / Prototype Safety Rule |
| Income shock | -20% | Tests resilience to income reduction. | My Judgement / Prototype Stress Assumption |
| Rate shock | +200 bps | Tests floating-rate sensitivity. | My Judgement / Prototype Stress Assumption |
| Current FOIR stop | ≥ 50% | Treats high existing debt service as a stop condition. | My Judgement / Prototype Safety Threshold |
| Monthly surplus stop | ≤ ₹0 | No residual cash after essentials leaves no buffer for new debt. | My Judgement / Prototype Safety Threshold |
| High-cost debt trigger | >24% APR + recent bounce | Combines expensive existing debt with recent repayment stress. | My Judgement / Prototype Safety Threshold |
| Borrow-less projected FOIR | >40% | Requested loan exceeds the conservative affordability range. | My Judgement / Prototype Safety Threshold |

## Metric definitions

### Current FOIR
`Existing monthly debt commitments / monthly net take-home`

### Total fixed burden
`(Existing EMIs + essential living costs) / monthly net take-home`

### Monthly cash surplus
`Net take-home - existing EMIs - essential living costs`

### Safe EMI
`min(net income × safe FOIR cap - existing EMIs, monthly surplus × retained-surplus factor)`

### Projected FOIR
`(Existing EMIs + proposed EMI) / net income`

## Decision precedence

The engine evaluates safety constraints in this order:

1. `RESTRUCTURE_FIRST`
2. `DONT_BORROW`
3. `BORROW_LESS`
4. `BORROW`

Higher-priority safety rules override lower-priority affordability recommendations.

## Unknown-data policy

`KNOWN(0)`, `UNKNOWN`, and `NOT_APPLICABLE` are distinct. Unknown information lowers confidence and/or widens uncertainty; it is never silently converted into numeric zero.

## Product pathway note

The product router is advisory. It suggests a more suitable pathway from the available inputs; it does not approve, reject, or guarantee a real lender product.

## Model limitations

The prototype does not perform bureau pulls, document verification, fraud detection, collateral valuation, lender-specific underwriting, legal compliance checks, or production credit-risk modelling.
