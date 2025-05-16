
import { getLocalStorageSnapshot, getErrorCollectorState, getApiKeysSnapshot, getUIStateSnapshot } from './backup-utils';
import { BackupStorageManager } from './BackupStorageManager';

/**
 * Responsible for collecting and applying site data
 */
export class SiteDataCollector {
  /**
   * Collect all critical site data
   */
  public static collectSiteData(): Record<string, any> {
    return {
      localStorageKeys: this.getLocalStorageSnapshot(),
      errorCollectorState: getErrorCollectorState(),
      apiKeys: getApiKeysSnapshot(),
      uiState: getUIStateSnapshot()
    };
  }
  
  /**
   * Apply data from backup to restore site structure
   */
  public static applySiteData(data: Record<string, any>): void {
    // Restore local storage items
    if (data.localStorageKeys) {
      Object.entries(data.localStorageKeys).forEach(([key, value]) => {
        if (typeof value === 'string' && !key.includes(BackupStorageManager.PRIMARY_KEY)) {
          localStorage.setItem(key, value);
        }
      });
    }
    
    // Force reload to apply changes
    window.location.reload();
  }
  
  /**
   * Get snapshot of localStorage excluding backup keys
   */
  private static getLocalStorageSnapshot(): Record<string, string> {
    return getLocalStorageSnapshot([BackupStorageManager.PRIMARY_KEY]);
  }
}
