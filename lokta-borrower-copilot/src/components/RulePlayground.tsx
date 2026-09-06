import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { DEFAULT_RULES } from '../config/rules.config';
import { useBorrowerStore } from '../store/borrowerStore';

export function RulePlayground() {
  const rules = useBorrowerStore((s) => s.rules);
  const setRules = useBorrowerStore((s) => s.setRules);

  const update = (patch: (next: typeof rules) => void) => {
    const next = JSON.parse(JSON.stringify(rules)) as typeof rules;
    patch(next);
    setRules(next);
  };


  return (
    <section className="rule-playground no-print">
      <div className="playground-head">
        <div><span className="kicker">Interview mode</span><h2>Live rule playground</h2><p>Change a core assumption and watch the same deterministic engine recompute the current borrower instantly.</p></div>
        <SlidersHorizontal size={22} />
      </div>
      <div className="playground-grid">
        <RuleSlider label="Salaried safe FOIR" value={rules.foirCaps.salariedSafe * 100} min={25} max={50} step={1} suffix="%" onChange={(value) => update((next) => { next.foirCaps.salariedSafe = value / 100; })} />
        <RuleSlider label="Lender FOIR cap" value={rules.foirCaps.lenderStandardMax * 100} min={40} max={70} step={1} suffix="%" onChange={(value) => update((next) => { next.foirCaps.lenderStandardMax = value / 100; })} />
        <RuleSlider label="Income shock" value={rules.stressScenarios.incomeShockPercent * 100} min={10} max={40} step={1} suffix="%" onChange={(value) => update((next) => { next.stressScenarios.incomeShockPercent = value / 100; })} />
        <RuleSlider label="Rate spike" value={rules.stressScenarios.rateShockBps} min={100} max={400} step={50} suffix=" bps" onChange={(value) => update((next) => { next.stressScenarios.rateShockBps = value; })} />
      </div>
      <button className="ghost-btn reset-rules" onClick={() => setRules(DEFAULT_RULES)}><RotateCcw size={14} /> Restore defaults</button>
      <span className="playground-note">Changes are session-only and do not rewrite source configuration.</span>
    </section>
  );
}

function RuleSlider({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="rule-slider"><span><b>{label}</b><strong>{value}{suffix}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}
