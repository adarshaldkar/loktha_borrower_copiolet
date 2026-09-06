import { useBorrowerStore } from '../store/borrowerStore';
import { PERSONAS } from '../data/personas';

export function PersonaBar() {
  const loadPersona = useBorrowerStore((s) => s.loadPersona);
  const activePersona = useBorrowerStore((s) => s.activePersona);
  const reset = useBorrowerStore((s) => s.reset);
  return (
    <div className="persona-bar">
      <div className="persona-copy"><span className="kicker">Demo presets</span><strong>Load one of Lokta’s acceptance borrowers</strong></div>
      <div className="persona-actions">
        {PERSONAS.map((persona) => (
          <button key={persona.id} className={`persona-btn ${persona.tone} ${activePersona === persona.id ? 'active' : ''}`} onClick={() => loadPersona(persona.id)}>
            <span>{persona.name}</span><small>{persona.subtitle}</small>
          </button>
        ))}
        <button className="ghost-btn" onClick={reset}>Reset / custom</button>
      </div>
    </div>
  );
}
