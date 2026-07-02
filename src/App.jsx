// v1.0.3 | 2026-07-01 | Franco De Escondrillas

import { MdOutlineToggleOff, MdToggleOn } from 'react-icons/md';
import { useState, useRef } from 'react';

import { useChecklist } from './hooks/useChecklist.js';
import { clearProgress } from './storage/cookies.js';
import { useRoles } from './hooks/useRoles.js';
import { PHASES } from './utils/phases.js';

import RoleSelector from './components/RoleSelector/RoleSelector.jsx';
import PhaseNav from './components/PhaseNav/PhaseNav.jsx';
import TaskList from './components/TaskList/TaskList.jsx';

function ChecklistView({ selectedRoles, onChangeRoles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { tasks, toggleTask, resetAll, completeAll, completedCount, totalCount, currentIndex, hasOutOfOrder } =
    useChecklist(selectedRoles, PHASES[activeIndex].key, activeIndex);
  const containerRef = useRef(null);
  const stickyRef = useRef(null);

  return (
    <>
      <div className="checklist-view" ref={containerRef}>
        <div className="sticky-top" ref={stickyRef}>
          <PhaseNav activeIndex={activeIndex} onChange={setActiveIndex} />
          <div className="task-header">
            <div className="task-header-row">
              <p className="progress-label">{completedCount} / {totalCount} tareas completadas</p>
              <button className="change-roles-btn" onClick={onChangeRoles}>Cambiar área</button>
            </div>
            <h2 class="title">Actividades pendientes</h2>
            {hasOutOfOrder && (
              <div className="warning-banner" role="alert">
                <strong>Tarea anterior pendiente</strong>
              </div>
            )}
          </div>
        </div>
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          currentIndex={currentIndex}
          stickyRef={stickyRef}
          containerRef={containerRef}
          phaseIndex={activeIndex}
        />
      </div>
      <button
        className={`fab ${completedCount === 0 ? 'fab--reset' : 'fab--complete'}`}
        onClick={completedCount > 0 ? resetAll : completeAll}
        aria-label={completedCount > 0 ? 'Desmarcar todo' : 'Marcar todo como completado'}
      >
        {completedCount === 0 ? <MdOutlineToggleOff size={28} /> : <MdToggleOn size={28} />}
      </button>
    </>
  );
}

export default function App() {
  const { selectedRoles, toggleRole, clearRoles } = useRoles();
  const [view, setView] = useState(() => selectedRoles.size > 0 ? 'checklist' : 'select');

  function handleConfirm() {
    setView('checklist');
  }

  function handleChangeRoles() {
    clearRoles();
    clearProgress();
    setView('select');
  }

  if (view === 'checklist') {
    return (
      <ChecklistView
        selectedRoles={selectedRoles}
        onChangeRoles={handleChangeRoles}
      />
    );
  }

  return (
    <RoleSelector
      selectedRoles={selectedRoles}
      onToggle={toggleRole}
      onConfirm={handleConfirm}
    />
  );
}
