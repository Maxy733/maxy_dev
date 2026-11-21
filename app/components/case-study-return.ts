'use client';

import { useSyncExternalStore } from 'react';

let requestedProject: { slug: string } | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getCaseStudyReturn() {
  return requestedProject;
}

export function setCaseStudyReturn(slug: string | null) {
  if (!slug && !requestedProject) return;
  requestedProject = slug ? { slug } : null;
  for (const listener of listeners) listener();
}

export function useCaseStudyReturn() {
  return useSyncExternalStore(subscribe, getCaseStudyReturn, () => null);
}
