import { X } from 'lucide-react';
import type { ExplanationTrace } from '../engine/explainability';

interface ExplainabilityModalProps {
  trace: ExplanationTrace | null;
  onClose: () => void;
}

export function ExplainabilityModal({ trace, onClose }: ExplainabilityModalProps) {
  if (!trace) return null;
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="explain-modal" role="dialog" aria-modal="true" aria-labelledby="explain-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="kicker">Audit trace</span>
            <h3 id="explain-title">Why this number?</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close explanation"><X size={18} /></button>
        </div>
        <div className="modal-value">{trace.value}</div>
        <p className="modal-reason">{trace.reason}</p>
        <div className="audit-block">
          <span className="audit-label">Calculation</span>
          <code>{trace.math}</code>
        </div>
      </div>
    </div>
  );
}
