# Lokta Borrower Copilot — Persona Run-Throughs

These are acceptance/demo inputs, not hardcoded result fixtures. Each preset populates the questionnaire and runs through the same engine used for a custom borrower.

## Priya — Salaried MNC

### Inputs
- 29, Bengaluru
- Net income ₹1,10,000/month
- Existing EMI ₹14,000/month
- Essential housing/living inputs include ₹28,000 rent
- CIBIL 780 / Prime
- 5 years at current employer
- Request ₹8,00,000 for wedding/personal consumption

### Dynamic path
All 8 Tier-1 questions are supplied. Salaried Tier-2 questions appear for employer category and employment vintage.

### What to verify
- O1 should be capable of returning `BORROW_LESS` because the request is large relative to the configured conservative rules and the purpose is non-productive.
- O2 must show separate lender-side and safe borrower capacity.
- O3 should produce a comparatively tight prime-profile rate band.
- O4 should show a safe EMI ceiling and tenure trade-off.
- Confidence should be high with the supplied inputs.

## Ravi — Self-employed Kirana Owner

### Inputs
- 42, Mysuru
- Reported cash income ₹40,000–₹80,000/month
- ITR income ₹35,000/month
- Unencumbered shop/property value ₹45,00,000
- No formal credit score / unknown
- Spouse income ₹18,000/month
- Request ₹15,00,000 for stock + delivery vehicle

### Dynamic path
Self-employed Tier-2 questions appear for documented income and collateral. Common questions can add emergency savings, productive income potential, and co-applicant income.

### What to verify
- Product routing should favour a secured pathway when the configured collateral condition is met.
- Documented and self-reported income should remain distinguishable.
- Unknown credit history should widen pricing uncertainty and reduce confidence.
- O2 should still separate lender-side and safe capacity.

## Anita — Informal / Gig

### Inputs
- 35, Hubballi
- Income ₹26,000–₹30,000/month
- Existing high-cost debt at 30%+ APR
- Recent EMI bounce
- Two children; spouse unemployed
- Request ₹1,50,000 for an EV scooter

### Dynamic path
Informal Tier-2 questions appear for high-cost digital debt and recent repayment bounces.

### What to verify
- `RESTRUCTURE_FIRST` should take precedence when high-cost debt and a recent bounce are both present.
- The productive purpose must not override a stronger debt-trap safety rule.
- Safe new unsecured capacity may be ₹0 under the configured rules.
- Stress testing should make the limited buffer visible.

## Dynamic verification

For all three personas, change an answer or a rule after loading the preset. The dashboard should recompute from the new state; no persona-specific result branch should be required.
