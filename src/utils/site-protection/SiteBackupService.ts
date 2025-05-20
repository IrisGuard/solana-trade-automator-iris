/**
 * Service for site backup and restoration functionality
 */

import { toast } from 'sonner';

/**
 * SiteBackupService provides functionality to create and restore backups
 * of important site data and configuration
 */
export class SiteBackupService {
  // Maximum number of backups to keep
  private static readonly MAX_BACKUPS = 10;

  /**
   * Create a backup of the current site state
   */
  public static createBackup(): boolean {
    try {
      console.log("Creating site backup");
      
      // Get all localStorage data
      const backup: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          backup[key] = localStorage.getItem(key) || '';
        }
      }
      
      // Store the backup with timestamp
      const timestamp = new Date().toISOString();
      localStorage.setItem('site_backup_' + timestamp, JSON.stringify(backup));
      localStorage.setItem('latest_backup', timestamp);
      
      toast.success("Επιτυχής δημιουργία αντιγράφου ασφαλείας");
      return true;
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Σφάλμα κατά τη δημιουργία αντιγράφου ασφαλείας");
      return false;
    }
  }
  
  /**
   * Restore the site from the latest backup
   */
  public static restoreFromBackup(): boolean {
    try {
      console.log("Restoring site from backup");
      
      // Get latest backup timestamp
      const latestBackup = localStorage.getItem('latest_backup');
      if (!latestBackup) {
        toast.error("Δεν βρέθηκε αντίγραφο ασφαλείας");
        return false;
      }
      
      // Get backup data
      const backupData = localStorage.getItem('site_backup_' + latestBackup);
      if (!backupData) {
        toast.error("Κατεστραμμένο αντίγραφο ασφαλείας");
        return false;
      }
      
      // Parse backup
      const backup = JSON.parse(backupData);
      
      // Restore data
      Object.keys(backup).forEach(key => {
        localStorage.setItem(key, backup[key]);
      });
      
      toast.success("Επιτυχής επαναφορά από αντίγραφο ασφαλείας");
      return true;
    } catch (error) {
      console.error("Error restoring from backup:", error);
      toast.error("Σφάλμα κατά την επαναφορά από αντίγραφο ασφαλείας");
      return false;
    }
  }

  /**
   * Count the number of available backups
   */
  public static countAvailableBackups(): number {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('site_backup_')) {
          count++;
        }
      }
      return count;
    } catch (error) {
      console.error("Error counting backups:", error);
      return 0;
    }
  }

  /**
   * Get the maximum number of backups allowed
   */
  public static getMaxBackups(): number {
    return SiteBackupService.MAX_BACKUPS;
  }
}
