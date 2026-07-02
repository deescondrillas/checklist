// v1.0.5 | 2026-07-01 | Franco De Escondrillas

import { IoMdCheckboxOutline } from 'react-icons/io';
import './RoleSelector.css';

const ROLES = [
  { key: 'ventas',          label: 'Ventas'                                 },
  { key: 'plata',           label: 'Plata'                                  },
  { key: '10k',             label: 'Oro 10K'                                },
  { key: '14k',             label: 'Oro 14K'                                },
  { key: 'utileria',        label: 'Utilería'                               },
  { key: 'administracion',  label: 'Administración',  shortLabel: 'Admón.'  },
  { key: 'cafeteria',       label: 'Cafetería'                              },
  { key: 'seguridad',       label: 'Seguridad'                              },
  { key: 'ti',              label: 'Fotografía / TI', shortLabel: 'TI'      },
];

export default function RoleSelector({ selectedRoles, onToggle, onConfirm }) {
  return (
    <div className="role-selector">
      <h1><IoMdCheckboxOutline /> Expo Joya</h1>
      <p className="role-hint">Selecciona tu(s) área(s)</p>
      <div className="role-grid">
        {ROLES.map(({ key, label, shortLabel }) => (
          <button
            key={key}
            className={`role-card${selectedRoles.has(key) ? ' selected' : ''}`}
            onClick={() => onToggle(key)}
            aria-pressed={selectedRoles.has(key)}
          >
            {shortLabel ? (
              <>
                <span className="role-label-full">{label}</span>
                <span className="role-label-short">{shortLabel}</span>
              </>
            ) : label}
          </button>
        ))}
      </div>
      <button
        className="confirm-btn"
        onClick={onConfirm}
        disabled={selectedRoles.size === 0}
      >
        Continuar
      </button>
    </div>
  );
}
