const storageKey = 'maxy-motion-sickness-proof';
const changeEvent = 'maxy-arcade-motion-change';
let unsavedPreference: boolean | undefined;

export function skipsArcadeZoom() {
  if (unsavedPreference !== undefined) return unsavedPreference;
  try {
    return window.localStorage.getItem(storageKey) === 'true';
  } catch {
    return false;
  }
}

export function setSkipArcadeZoom(enabled: boolean) {
  try {
    window.localStorage.setItem(storageKey, String(enabled));
    unsavedPreference = undefined;
  } catch {
    unsavedPreference = enabled;
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeToArcadeMotion(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) listener();
  }

  window.addEventListener(changeEvent, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener('storage', onStorage);
  };
}
