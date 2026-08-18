/**
 * Investigation progress persistence.
 *
 * Everything the player builds up — discovered clues, interrogation transcripts,
 * journal notes, the corkboard — previously lived in React state only and was lost
 * on refresh. This stores it under a single versioned localStorage key.
 *
 * Bump STORAGE_VERSION whenever the shape of PersistedState changes; old payloads
 * are then discarded rather than half-restored.
 */

const STORAGE_KEY = 'ai-detective:save';
const STORAGE_VERSION = 1;

export interface PersistedState<T = unknown> {
  version: number;
  savedAt: string;
  data: T;
}

export function loadState<T>(): T | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedState<T>;
    if (parsed?.version !== STORAGE_VERSION) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    // Corrupt or unavailable storage (private mode, quota, disabled) — start fresh.
    return null;
  }
}

export function saveState<T>(data: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const payload: PersistedState<T> = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      data,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Over quota or storage disabled — the game still works, it just won't persist.
  }
}

export function clearState(): void {
  try {
    window.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
