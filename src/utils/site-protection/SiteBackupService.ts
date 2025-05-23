export const SiteBackupService = {
  // Count available backups
  countAvailableBackups(): number {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('site_backup_')) {
          count++;
        }
      }
      return count;
    } catch (e) {
      console.error('Error counting backups:', e);
      return 0;
    }
  },

  // Get maximum number of backups
  getMaxBackups(): number {
    return 11; // Default maximum backups
  },

  // Create a backup
  createBackup(): boolean {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage }
      };
      
      const backupKey = `site_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Keep only the last 11 backups
      this.cleanupOldBackups();
      
      return true;
    } catch (e) {
      console.error('Error creating backup:', e);
      return false;
    }
  },

  // Restore from backup
  restoreFromBackup(): boolean {
    try {
      const backupKey = this.getLatestBackupKey();
      if (!backupKey) {
        console.warn('No backup found to restore');
        return false;
      }
      
      const backupData = localStorage.getItem(backupKey);
      if (backupData) {
        const backup = JSON.parse(backupData);
        // Restore localStorage (excluding backups)
        Object.keys(backup.localStorage).forEach(key => {
          if (!key.startsWith('site_backup_')) {
            localStorage.setItem(key, backup.localStorage[key]);
          }
        });
        
        // Reload the page
        window.location.reload();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error restoring backup:', e);
      return false;
    }
  },

  // Get the latest backup key
  getLatestBackupKey(): string | null {
    const backupKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('site_backup_')) {
        backupKeys.push(key);
      }
    }
    
    if (backupKeys.length === 0) return null;
    
    // Sort by timestamp (newest first)
    backupKeys.sort((a, b) => {
      const timestampA = parseInt(a.split('_')[2]);
      const timestampB = parseInt(b.split('_')[2]);
      return timestampB - timestampA;
    });
    
    return backupKeys[0];
  },

  // Clean up old backups
  cleanupOldBackups(): void {
    const backupKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('site_backup_')) {
        backupKeys.push(key);
      }
    }
    
    // Sort by timestamp (oldest first)
    backupKeys.sort((a, b) => {
      const timestampA = parseInt(a.split('_')[2]);
      const timestampB = parseInt(b.split('_')[2]);
      return timestampA - timestampB;
    });
    
    // Remove old backups if we have more than the maximum
    const maxBackups = this.getMaxBackups();
    while (backupKeys.length > maxBackups) {
      const oldestKey = backupKeys.shift();
      if (oldestKey) {
        localStorage.removeItem(oldestKey);
      }
    }
  }
};
