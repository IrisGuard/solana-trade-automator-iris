export const SiteBackupService = {
  countAvailableBackups(): number {
    try {
      const backups = localStorage.getItem('site_backups');
      return backups ? JSON.parse(backups).length : 0;
    } catch {
      return 0;
    }
  },
  
  getMaxBackups(): number {
    return 5; // Maximum number of backups to keep
  },
  
  createBackup(): boolean {
    try {
      const backup = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        data: {
          // Add relevant app state here
          version: '1.0.0'
        }
      };
      
      const existingBackups = JSON.parse(localStorage.getItem('site_backups') || '[]');
      existingBackups.unshift(backup);
      
      // Keep only max backups
      const trimmedBackups = existingBackups.slice(0, this.getMaxBackups());
      localStorage.setItem('site_backups', JSON.stringify(trimmedBackups));
      
      return true;
    } catch {
      return false;
    }
  }
};
