// v1.0.3 | 2026-06-27 | Franco De Escondrillas

import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from 'react-icons/io';
import { forwardRef } from 'react';
import './TaskItem.css';

const TaskItem = forwardRef(function TaskItem({ task, onToggle, isCurrent, isSkipped }, ref) {
const CheckIcon = task.completed ? IoIosCheckmarkCircle : IoIosRadioButtonOff;
  return (
    <li ref={ref} className={`task-item${task.completed ? ' completed' : ''}`}>
      <button
        className="task-row"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Desmarcar: ${task.nombre}` : `Marcar como completada: ${task.nombre}`}
      >  
        <CheckIcon className="task-check-indicator" aria-hidden="true" />
        <span className="task-name">{task.nombre}</span>
      </button>
      {(isCurrent || isSkipped) && (
        <div className="task-details">
          <p className="task-desc">{task.descripcion}</p>
          {task.sub_checks.length > 0 && (
            <ul className="sub-checks">
              {task.sub_checks.map((sub, i) => (
                <li key={i}>{sub.descripcion}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
});

export default TaskItem;
