
/**
 * Utility functions for the backup system
 */

// Generate a simple hash for data integrity checks
export function generateDataHash(data: any): string {
  // Simple hash function for integrity checks
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// Collect local storage items into a snapshot
export function getLocalStorageSnapshot(excludeKeys: string[]): Record<string, string> {
  const snapshot: Record<string, string> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !excludeKeys.some(exclude => key.includes(exclude))) {
      snapshot[key] = localStorage.getItem(key) || '';
    }
  }
  
  return snapshot;
}

// Get error collector state if available
export function getErrorCollectorState(): any {
  try {
    return window.errorCollector || {};
  } catch {
    return {};
  }
}

// Safely get API keys metadata (without actual key values for security)
export function getApiKeysSnapshot(): any {
  try {
    const apiKeysData = localStorage.getItem('api_keys_metadata');
    if (apiKeysData) {
      return JSON.parse(apiKeysData);
    }
    return {};
  } catch {
    return {};
  }
}

// Capture UI state
export function getUIStateSnapshot(): any {
  try {
    return {
      theme: localStorage.getItem('theme') || 'dark',
      language: localStorage.getItem('language') || 'el',
      layout: localStorage.getItem('layout') || 'default'
    };
  } catch {
    return {};
  }
}
