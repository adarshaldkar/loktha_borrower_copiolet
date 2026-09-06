import { PersonaBar } from './components/PersonaBar';
import { Questionnaire } from './components/Questionnaire';
import { ResultsDashboard } from './components/ResultsDashboard';
import { useBorrowerStore } from './store/borrowerStore';
import { NegotiationCard } from './components/NegotiationCard';
import { OfferComparator } from './components/OfferComparator';
import { RulePlayground } from './components/RulePlayground';

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function App() {
  const assessment = useBorrowerStore((s) => s.assessment);
  const ready = Boolean(assessment);
  const profile = useBorrowerStore((s) => s.profile);
  const rules = useBorrowerStore((s) => s.rules);
  const verdict = assessment?.o1.verdict;
  const verdictLabel = verdict === 'RESTRUCTURE_FIRST' ? 'RESTRUCTURE FIRST' : verdict?.replaceAll('_', ' ');

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Lokta · Borrower Copilot · Phase 5</p>
          <h1>Borrow with your eyes open.</h1>
          <p className="hero-lede">An adaptive self-assessment that turns your answers into a borrowing decision, affordability range, fair-rate band and negotiation-ready next step.</p>
        </div>
        <div className="hero-note"><strong>No bureau pull.</strong><span>Your answers stay in this browser session.</span></div>
      </header>

      <PersonaBar />

      <div className="layout">
        <Questionnaire />
        <aside className="summary-stack">
          <section className="panel sticky-panel">
            <div className="section-head compact"><span className="kicker">Live status</span><span className={`status-dot ${ready ? 'ready' : ''}`}></span></div>
            {!assessment ? (
              <div className="empty-state">Answer all 8 must-have questions to calculate the full assessment.</div>
            ) : (
              <>
                <div className={`verdict-card verdict-${assessment.o1.verdict.toLowerCase()}`}>
                  <span className="kicker">O1 · Recommendation</span>
                  <strong>{verdictLabel}</strong>
                  <p>{assessment.o1.reason}</p>
                </div>
                <div className="metric-grid">
                  <Metric label="Safe capacity" value={rupees.format(assessment.o2.safeBorrowerCapacity)} />
                  <Metric label="Lender estimate" value={rupees.format(assessment.o2.lenderSanction)} />
                  <Metric label="Fair rate" value={`${assessment.o3.fairRateMin.toFixed(2)}%–${assessment.o3.fairRateMax.toFixed(2)}%`} />
                  <Metric label="Safe EMI" value={`${rupees.format(assessment.o2.maxSafeEmi)} / mo`} />
                </div>
                <div className="confidence-box"><strong>{assessment.confidence.rating} confidence</strong><span>{assessment.confidence.confidenceReason}</span></div>
                <div className="trace-line">All figures are recomputed from current inputs and rules.</div>
              </>
            )}
          </section>
        </aside>
      </div>

      {assessment && <>
        <ResultsDashboard assessment={assessment} />
        <div className="phase5-grid">
          <OfferComparator assessment={assessment} rules={rules} />
          <NegotiationCard profile={profile} assessment={assessment} />
        </div>
        <RulePlayground />
      </>}

      <footer className="footer-note">Self-assessment only — actual approval, pricing and eligibility depend on lender-specific underwriting, verification and documentation.</footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}
