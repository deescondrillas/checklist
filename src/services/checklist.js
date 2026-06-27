// v1.0.2 | 2026-06-27 | Franco De Escondrillas

import checksData from '../data/checks.json';
import rolesData from '../data/roles.json';
import Treap from '../lib/Treap.js';

export function buildPhaseTreap(selectedRoles, phaseKey) {
  const merged = new Treap();
  for (const role of selectedRoles) {
    const ids = rolesData.roles[role]?.[phaseKey] ?? [];
    const roleTreap = new Treap();
    for (const id of ids) roleTreap.insert(id);
    merged.union(roleTreap);
  }
  return merged;
}

export function applyCompletion(treap, completedIds) {
  treap.get(node => { node.completed = completedIds.has(node.key); });
}

export function treapToTasks(treap) {
  const tasks = [];
  treap.get(node => {
    const check = checksData.checks[node.key];
    if (check) tasks.push({ id: node.key, completed: node.completed, ...check });
  });
  return tasks;
}
