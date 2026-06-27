// v1.0.3 | 2026-06-27 | Franco De Escondrillas

import { buildPhaseTreap, applyCompletion, treapToTasks } from '../services/checklist.js';
import { getProgress, setProgress } from '../storage/cookies.js';
import { useMemo, useState } from 'react';

export function useChecklist(selectedRoles, phaseKey, phaseIndex) {
  const [stored, setStored] = useState(() => ({ phaseIndex, ids: getProgress(phaseIndex) }));
  const completedIds = stored.phaseIndex === phaseIndex ? stored.ids : getProgress(phaseIndex);
  const treap = useMemo(() => buildPhaseTreap(selectedRoles, phaseKey), [selectedRoles, phaseKey]);

  const tasks = useMemo(() => {
    applyCompletion(treap, completedIds);
    return treapToTasks(treap);
  }, [treap, completedIds]);

  function toggleTask(id) {
    const next = new Set(completedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setProgress(phaseIndex, next);
    setStored({ phaseIndex, ids: next });
  }

  const lastCompletedIdx = tasks.reduce((acc, t, i) => (t.completed ? i : acc), -1);

  let currentIndex;
  if (lastCompletedIdx === -1) currentIndex = tasks.findIndex(t => !t.completed);
  else {
    const afterLast = tasks.findIndex((t, i) => i > lastCompletedIdx && !t.completed);
    currentIndex = afterLast !== -1 ? afterLast : tasks.findIndex(t => !t.completed);
  }

  const firstUncompletedIdx = tasks.findIndex(t => !t.completed);
  const hasOutOfOrder =
    firstUncompletedIdx !== -1 &&
    lastCompletedIdx !== -1 &&
    firstUncompletedIdx < lastCompletedIdx;

  function resetAll() {
    const empty = new Set();
    setProgress(phaseIndex, empty);
    setStored({ phaseIndex, ids: empty });
  }

  function completeAll() {
    const all = new Set(tasks.map(t => t.id));
    setProgress(phaseIndex, all);
    setStored({ phaseIndex, ids: all });
  }

  return {
    tasks, toggleTask, resetAll, completeAll,
    completedCount: tasks.filter(t => t.completed).length,
    totalCount: tasks.length, currentIndex, hasOutOfOrder,
  };
}
