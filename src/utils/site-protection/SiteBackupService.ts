
import { toast } from "sonner";
import { SiteBackup, BackupOptions } from './types';
import { generateDataHash } from './backup-utils';
import { BackupStorageManager } from './BackupStorageManager';
import { SiteDataCollector } from './SiteDataCollector';

// Main service class for managing site backups
export class SiteBackupService {
  private static readonly VERSION = '1.0.0';
  
  // Create a backup of critical site data
  public static createBackup(options: BackupOptions = {}): boolean {
    try {
      // Collect critical site data
      const siteData = SiteDataCollector.collectSiteData();
      
      // Generate a simple hash for integrity checks
      const hash = generateDataHash(siteData);
      
      // Create a backup object
      const backup: SiteBackup = {
        timestamp: Date.now(),
        version: this.VERSION,
        data: siteData,
        hash
      };
      
      // Store the primary backup
      BackupStorageManager.savePrimaryBackup(backup);
      
      // Create redundant backups in rotation
      BackupStorageManager.rotateBackups(backup);
      
      // Show success notification if not silent
      if (!options.silent) {
        toast.success("Αντίγραφο ασφαλείας δημιουργήθηκε", {
          description: `Επιτυχής αποθήκευση δομής στις ${new Date().toLocaleTimeString()}`
        });
      }
      
      return true;
    } catch (error) {
      console.error("Failed to create site backup:", error);
      
      if (!options.silent) {
        toast.error("Σφάλμα δημιουργίας αντιγράφου", {
          description: "Δεν ήταν δυνατή η δημιουργία αντιγράφου ασφαλείας"
        });
      }
      
      return false;
    }
  }
  
  // Restore site from backup
  public static restoreFromBackup(showNotification = true): boolean {
    try {
      // First try the primary backup
      let backup = BackupStorageManager.loadBackup(BackupStorageManager.PRIMARY_KEY);
      
      // If primary backup fails, try the redundant backups
      if (!backup) {
        for (const key of BackupStorageManager.BACKUP_KEYS) {
          backup = BackupStorageManager.loadBackup(key);
          if (backup) break;
        }
      }
      
      if (!backup) {
        throw new Error("No valid backups found");
      }
      
      // Apply the backup data to restore site structure
      SiteDataCollector.applySiteData(backup.data);
      
      if (showNotification) {
        toast.success("Επαναφορά επιτυχής", {
          description: `Η δομή επαναφέρθηκε από αντίγραφο ${new Date(backup.timestamp).toLocaleString()}`
        });
      }
      
      return true;
    } catch (error) {
      console.error("Failed to restore site from backup:", error);
      
      if (showNotification) {
        toast.error("Αποτυχία επαναφοράς", {
          description: "Δεν ήταν δυνατή η επαναφορά από αντίγραφο ασφαλείας"
        });
      }
      
      return false;
    }
  }
  
  // Check if site structure is healthy
  public static checkSiteHealth(): boolean {
    try {
      // Load primary backup
      const backup = BackupStorageManager.loadBackup(BackupStorageManager.PRIMARY_KEY);
      if (!backup) return false;
      
      // Check if critical elements exist in the DOM
      const criticalElements = ['root', 'app-container', 'main-content'];
      for (const id of criticalElements) {
        if (document.getElementById(id) === null) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  // Count available backups
  public static countAvailableBackups(): number {
    return BackupStorageManager.countAvailableBackups();
  }
  
  // Get max backup count
  public static getMaxBackups(): number {
    return BackupStorageManager.getMaxBackups();
  }
}

// Create a global accessor for the backup service
declare global {
  interface Window {
    siteBackup: {
      create: (options?: any) => boolean;
      restore: (showNotification?: boolean) => boolean;
      check: () => boolean;
      countBackups: () => number;
      maxBackups: () => number;
    };
  }
}

// Initialize global accessor
window.siteBackup = {
  create: SiteBackupService.createBackup.bind(SiteBackupService),
  restore: SiteBackupService.restoreFromBackup.bind(SiteBackupService),
  check: SiteBackupService.checkSiteHealth.bind(SiteBackupService),
  countBackups: SiteBackupService.countAvailableBackups.bind(SiteBackupService),
  maxBackups: SiteBackupService.getMaxBackups.bind(SiteBackupService)
};
