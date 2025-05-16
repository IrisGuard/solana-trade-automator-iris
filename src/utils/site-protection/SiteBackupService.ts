
import { toast } from "sonner";

// Define interfaces for our backup system
interface SiteBackup {
  timestamp: number;
  version: string;
  data: Record<string, any>;
  hash: string;
}

interface BackupOptions {
  name?: string;
  silent?: boolean;
}

// Main service class for managing site backups
export class SiteBackupService {
  private static readonly PRIMARY_KEY = 'site_structure_backup';
  // Increase the number of backup slots from 3 to 10
  private static readonly BACKUP_KEYS = [
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
  private static readonly VERSION = '1.0.0';
  
  // Create a backup of critical site data
  public static createBackup(options: BackupOptions = {}): boolean {
    try {
      // Collect critical site data
      const siteData = this.collectSiteData();
      
      // Generate a simple hash for integrity checks
      const hash = this.generateDataHash(siteData);
      
      // Create a backup object
      const backup: SiteBackup = {
        timestamp: Date.now(),
        version: this.VERSION,
        data: siteData,
        hash
      };
      
      // Store the primary backup
      localStorage.setItem(this.PRIMARY_KEY, JSON.stringify(backup));
      
      // Create redundant backups in rotation
      this.rotateBackups(backup);
      
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
      let backup = this.loadBackup(this.PRIMARY_KEY);
      
      // If primary backup fails, try the redundant backups
      if (!backup) {
        for (const key of this.BACKUP_KEYS) {
          backup = this.loadBackup(key);
          if (backup) break;
        }
      }
      
      if (!backup) {
        throw new Error("No valid backups found");
      }
      
      // Apply the backup data to restore site structure
      this.applySiteData(backup.data);
      
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
      const backup = this.loadBackup(this.PRIMARY_KEY);
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
  
  // Get max backup count
  public static getMaxBackups(): number {
    // Primary backup + all backup slots
    return 1 + this.BACKUP_KEYS.length;
  }
  
  // Private helper methods
  private static loadBackup(key: string): SiteBackup | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const backup = JSON.parse(data) as SiteBackup;
      
      // Verify hash for integrity
      if (this.generateDataHash(backup.data) !== backup.hash) {
        console.warn(`Backup integrity check failed for ${key}`);
        return null;
      }
      
      return backup;
    } catch {
      return null;
    }
  }
  
  private static collectSiteData(): Record<string, any> {
    // Collect critical site data
    return {
      localStorageKeys: this.getLocalStorageSnapshot(),
      errorCollectorState: this.getErrorCollectorState(),
      apiKeys: this.getApiKeysSnapshot(),
      uiState: this.getUIStateSnapshot()
    };
  }
  
  private static applySiteData(data: Record<string, any>): void {
    // Restore local storage items
    if (data.localStorageKeys) {
      Object.entries(data.localStorageKeys).forEach(([key, value]) => {
        if (typeof value === 'string' && !key.includes(this.PRIMARY_KEY)) {
          localStorage.setItem(key, value);
        }
      });
    }
    
    // Force reload to apply changes
    window.location.reload();
  }
  
  private static rotateBackups(backup: SiteBackup): void {
    // Βεβαιώνουμε πρώτα ότι έχουμε αποθηκεύσει το τελευταίο αντίγραφο
    // πριν το διαγράψουμε
    const lastIndex = this.BACKUP_KEYS.length - 1;
    const lastBackup = localStorage.getItem(this.BACKUP_KEYS[lastIndex]);
    
    // Εάν υπάρχει ένα αντίγραφο στην τελευταία θέση, το καταγράφουμε και το διαγράφουμε
    if (lastBackup) {
      try {
        const oldestBackup = JSON.parse(lastBackup) as SiteBackup;
        const date = new Date(oldestBackup.timestamp).toLocaleString();
        console.log(`Διαγραφή παλαιότερου αντιγράφου από ${date}`);
      } catch (e) {
        console.warn("Δεν ήταν δυνατή η ανάγνωση του τελευταίου αντιγράφου");
      }
      
      // Διαγράφουμε το παλιότερο αντίγραφο
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
  
  private static generateDataHash(data: any): string {
    // Simple hash function for integrity checks
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }
  
  private static getLocalStorageSnapshot(): Record<string, string> {
    const snapshot: Record<string, string> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes(this.PRIMARY_KEY)) {
        snapshot[key] = localStorage.getItem(key) || '';
      }
    }
    
    return snapshot;
  }
  
  private static getErrorCollectorState(): any {
    try {
      // Get error collector state if available
      const errorCollector = window.errorCollector || {};
      return errorCollector;
    } catch {
      return {};
    }
  }
  
  private static getApiKeysSnapshot(): any {
    try {
      // Safely get API keys (without actual key values for security)
      const apiKeysData = localStorage.getItem('api_keys_metadata');
      if (apiKeysData) {
        return JSON.parse(apiKeysData);
      }
      return {};
    } catch {
      return {};
    }
  }
  
  private static getUIStateSnapshot(): any {
    try {
      // Capture UI state
      return {
        theme: localStorage.getItem('theme') || 'dark',
        language: localStorage.getItem('language') || 'el',
        layout: localStorage.getItem('layout') || 'default'
      };
    } catch {
      return {};
    }
  }
}

// Create a global accessor for the backup service
declare global {
  interface Window {
    siteBackup: {
      create: (options?: BackupOptions) => boolean;
      restore: (showNotification?: boolean) => boolean;
      check: () => boolean;
      countBackups: () => number;
      maxBackups: () => number;
    };
    errorCollector: any;
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
