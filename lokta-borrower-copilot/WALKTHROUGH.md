# Lokta Borrower Copilot — Five-Minute Walkthrough

## 0:00–0:30 — Problem

The product addresses the information gap between a lender's underwriting model and the borrower's ability to judge a loan offer. The copilot produces four outputs plus a Negotiation Card.

## 0:30–1:15 — Adaptive questionnaire

Start with the 8 must-have questions. Change employment type and demonstrate that only relevant Tier-2 questions appear. Show that `UNKNOWN`, `KNOWN(0)`, and `NOT_APPLICABLE` are different states.

## 1:15–2:15 — Runtime engine

Load Priya. Explain that the persona is only an input preset. Open the O1–O4 results and then a **Why this number?** panel showing the input, applied rule, calculation, and plain-English reason.

## 2:15–3:00 — Lender-offer comparison

Enter a hypothetical lender quote. Show nominal rate, fees, net disbursement, EMI, and all-in APR. Compare those figures with the borrower's estimated fair-rate range and safe EMI ceiling.

## 3:00–3:45 — Negotiation Card

Open the one-screen card. Point out the safe ceiling, safe EMI, fair-rate range, confidence, offer checks, and dynamically generated negotiation script.

## 3:45–4:30 — Live rule change

Open the Rule Playground and change the salaried safe FOIR. Show the dependent outputs recomputing instantly. Restore defaults afterward.

## 4:30–5:00 — What we would build next / what we would cut

### Build next
- Verified, dated market/lender data sources
- More product-specific pathways
- Stronger fee normalization across lender offers
- More formal regression and boundary testing
- Better evidence/document capture for income quality

### Cut / avoid in this prototype
- Real bureau integration
- Backend/database infrastructure
- Machine-learning approval model
- Huge lender-product catalog
- Pixel-perfect work that does not improve borrower decisions

The central design goal remains: turn lending judgement into transparent rules that a borrower can understand and the machine can run.
