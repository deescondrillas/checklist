// v1.0.3 | 2026-06-28 | Franco De Escondrillas

import TaskItem from '../TaskItem/TaskItem.jsx';
import { useEffect, useRef } from 'react';
import './TaskList.css';

export default function TaskList({ tasks, onToggle, currentIndex, stickyRef, containerRef, phaseIndex }) {
  const currentTaskRef = useRef(null);

  useEffect(() => {
    if (currentIndex === -1 || !currentTaskRef.current || !stickyRef?.current || !containerRef?.current) return;
    const id = requestAnimationFrame(() => {
      if (!currentTaskRef.current || !stickyRef?.current || !containerRef?.current) return;
      const containerEl = containerRef.current;
      const containerTop = containerEl.getBoundingClientRect().top;
      const taskTop = currentTaskRef.current.getBoundingClientRect().top;
      const stickyHeight = stickyRef.current.offsetHeight;
      const target = containerEl.scrollTop + (taskTop - containerTop) - stickyHeight;
      containerEl.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(id);
  }, [phaseIndex, currentIndex, stickyRef, containerRef]);

  if (tasks.length === 0) return (<p className="no-tasks">No hay tareas</p>);
  const lastCompletedIdx = tasks.reduce((acc, t, i) => (t.completed ? i : acc), -1);

  return (
    <div className="task-list-wrapper">
      <ul className="task-list">
        {tasks.map((task, i) => (
          <TaskItem
            key={task.id}
            task={task}
            index={i}
            onToggle={onToggle}
            isCurrent={i === currentIndex}
            isSkipped={!task.completed && i < lastCompletedIdx}
            ref={i === currentIndex ? currentTaskRef : null}
          />
        ))}
      </ul>
    </div>
  );
}
