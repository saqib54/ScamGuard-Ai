/**
 * Safari & IFrame Safe Storage Utility
 * Wraps localStorage with in-memory fallback to prevent SecurityError / QuotaExceededError
 * in Safari Private Browsing mode, restricted iframes, or disabled cookies.
 */

const memoryStore = new Map<string, string>();

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__safari_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = isStorageAvailable();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (hasLocalStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback to in-memory store
    }
    return memoryStore.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (hasLocalStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore localStorage write error (e.g. quota exceeded in Safari private mode)
    }
    memoryStore.set(key, value);
  },

  removeItem(key: string): void {
    try {
      if (hasLocalStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore error
    }
    memoryStore.delete(key);
  },

  clear(): void {
    try {
      if (hasLocalStorage) {
        window.localStorage.clear();
      }
    } catch {
      // Ignore error
    }
    memoryStore.clear();
  }
};
