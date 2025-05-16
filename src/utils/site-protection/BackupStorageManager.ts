
import { SiteBackup } from './types';
import { generateDataHash } from './backup-utils';

/**
 * Manages storage operations for backups
 */
export class BackupStorageManager {
  // Storage keys
  public static readonly PRIMARY_KEY = 'site_structure_backup';
  // Backup slots
  public static readonly BACKUP_KEYS = [
    'site_structure_backup_1',
    'site_structure_backup_2',
    'site_structure_backup_3',
    'site_structure_backup_4',
    'site_structure_backup_5',
    'site_structure_backup_6',
    'site_structure_backup_7',
    'site_structure_backup_8',
    'site_structure_backup_9',
    'site_structure_backup_10'
  ];
  
  /**
   * Load a backup from storage
   */
  public static loadBackup(key: string): SiteBackup | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const backup = JSON.parse(data) as SiteBackup;
      
      // Verify hash for integrity
      if (generateDataHash(backup.data) !== backup.hash) {
        console.warn(`Backup integrity check failed for ${key}`);
        return null;
      }
      
      return backup;
    } catch {
      return null;
    }
  }
  
  /**
   * Store backup in primary storage
   */
  public static savePrimaryBackup(backup: SiteBackup): void {
    localStorage.setItem(this.PRIMARY_KEY, JSON.stringify(backup));
  }
  
  /**
   * Rotate backups to maintain history
   */
  public static rotateBackups(backup: SiteBackup): void {
    // Check if we need to delete the oldest backup before rotation
    const lastIndex = this.BACKUP_KEYS.length - 1;
    const lastBackup = localStorage.getItem(this.BACKUP_KEYS[lastIndex]);
    
    // If there's a backup in the last slot, log and delete it
    if (lastBackup) {
      try {
        const oldestBackup = JSON.parse(lastBackup) as SiteBackup;
        const date = new Date(oldestBackup.timestamp).toLocaleString();
        console.log(`Διαγραφή παλαιότερου αντιγράφου από ${date}`);
      } catch (e) {
        console.warn("Δεν ήταν δυνατή η ανάγνωση του τελευταίου αντιγράφου");
      }
      
      // Delete the oldest backup
      localStorage.removeItem(this.BACKUP_KEYS[lastIndex]);
    }
    
    // Move each backup one position (starting from the last position and moving backwards)
    for (let i = lastIndex; i > 0; i--) {
      const prevBackup = localStorage.getItem(this.BACKUP_KEYS[i - 1]);
      if (prevBackup) {
        localStorage.setItem(this.BACKUP_KEYS[i], prevBackup);
      }
    }
    
    // Store new backup in first position
    localStorage.setItem(this.BACKUP_KEYS[0], JSON.stringify(backup));
  }
  
  /**
   * Count available backups
   */
  public static countAvailableBackups(): number {
    let count = 0;
    
    // Check primary backup
    if (localStorage.getItem(this.PRIMARY_KEY)) {
      count++;
    }
    
    // Check all backup slots
    for (const key of this.BACKUP_KEYS) {
      if (localStorage.getItem(key)) {
        count++;
      }
    }
    
    return count;
  }
  
  /**
   * Get max backup count
   */
  public static getMaxBackups(): number {
    // Primary backup + all backup slots
    return 1 + this.BACKUP_KEYS.length;
  }
}
