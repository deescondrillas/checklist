// v1.0.2 | 2026-06-27 | Franco De Escondrillas

const KEY = 'checklist_v1';

function parseAll() {
  const match = document.cookie.split('; ').find(c => c.startsWith(KEY + '='));
  if (!match) return {};
  try { return JSON.parse(decodeURIComponent(match.slice(KEY.length + 1))); } catch { return {}; }
}

function saveAll(map) {
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(map))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

export function getProgress(phaseIndex) {
  return new Set(parseAll()[phaseIndex] ?? []);
}

export function setProgress(phaseIndex, completedIds) {
  const map = parseAll();
  map[phaseIndex] = [...completedIds];
  saveAll(map);
}

export function getRoles() {
  return new Set(parseAll()['roles'] ?? []);
}

export function setRoles(roles) {
  const map = parseAll();
  map['roles'] = [...roles];
  saveAll(map);
}

export function clearProgress() {
  document.cookie = `${KEY}=; path=/; max-age=0; SameSite=Strict`;
}
