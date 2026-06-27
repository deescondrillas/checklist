// v1.0.1 | 2026-06-26 | Franco De Escondrillas

import { PHASES } from '../../utils/phases.js';
import './PhaseNav.css';

export default function PhaseNav({ activeIndex, onChange }) {
  return (
    <nav className="phase-nav" aria-label="Fases del evento">
      {PHASES.map((phase, i) => (
        <button
          key={i}
          className={`phase-btn${i === activeIndex ? ' active' : ''}`}
          onClick={() => onChange(i)}
          aria-current={i === activeIndex ? 'page' : undefined}
        >
          {phase.label}
        </button>
      ))}
    </nav>
  );
}
