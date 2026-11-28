'use client';

import { useSyncExternalStore } from 'react';
import { setSkipArcadeZoom, skipsArcadeZoom, subscribeToArcadeMotion } from './arcade-motion-preference';

export function ArcadeMotionToggle({ label }: { label: string }) {
  const enabled = useSyncExternalStore(subscribeToArcadeMotion, skipsArcadeZoom, () => false);

  return (
    <label className="nav-settings-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={enabled}
        onChange={(event) => setSkipArcadeZoom(event.currentTarget.checked)}
      />
    </label>
  );
}
