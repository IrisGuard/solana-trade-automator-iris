
interface BackupData {
  timestamp: number;
  data: any;
}

export class SiteBackupService {
  private static readonly BACKUP_KEY = 'site_backup_data';
  
  /**
   * Creates a backup of the current site state
   */
  static createBackup(): boolean {
    try {
      // Collect data to backup
      const backupData: BackupData = {
        timestamp: Date.now(),
        data: {
          localStorage: this.getLocalStorageData(),
          sessionStorage: this.getSessionStorageData()
        }
      };
      
      // Store backup
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupData));
      console.log('Site backup created:', backupData.timestamp);
      return true;
    } catch (error) {
      console.error('Failed to create site backup:', error);
      return false;
    }
  }
  
  /**
   * Restores the site from a backup
   */
  static restoreFromBackup(): boolean {
    try {
      // Get backup data
      const backupStr = localStorage.getItem(this.BACKUP_KEY);
      if (!backupStr) {
        console.warn('No backup data found');
        return false;
      }
      
      const backup: BackupData = JSON.parse(backupStr);
      console.log('Restoring site from backup:', backup.timestamp);
      
      // Restore local storage
      if (backup.data.localStorage) {
        Object.entries(backup.data.localStorage).forEach(([key, value]) => {
          if (key !== this.BACKUP_KEY) {
            localStorage.setItem(key, value as string);
          }
        });
      }
      
      // Restore session storage
      if (backup.data.sessionStorage) {
        Object.entries(backup.data.sessionStorage).forEach(([key, value]) => {
          sessionStorage.setItem(key, value as string);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to restore site from backup:', error);
      return false;
    }
  }
  
  /**
   * Gets all local storage data
   */
  private static getLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== this.BACKUP_KEY) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    
    return data;
  }
  
  /**
   * Gets all session storage data
   */
  private static getSessionStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        data[key] = sessionStorage.getItem(key) || '';
      }
    }
    
    return data;
  }
}
