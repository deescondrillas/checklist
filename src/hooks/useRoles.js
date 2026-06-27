// v1.0.3 | 2026-06-27 | Franco De Escondrillas

import { getRoles, setRoles } from '../storage/cookies.js';
import { useState, useCallback } from 'react';

export function useRoles() {
  const [selectedRoles, setSelectedRoles] = useState(() => getRoles());

  const toggleRole = useCallback((key) => {
    setSelectedRoles(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      setRoles(next);
      return next;
    });
  }, []);

  const clearRoles = useCallback(() => {
    setRoles(new Set());
    setSelectedRoles(new Set());
  }, []);

  return { selectedRoles, toggleRole, clearRoles, hasRoles: selectedRoles.size > 0 };
}
