
// Simple key manager for Helius API
class HeliusKeyManager {
  private apiKey: string | null = null;
  private backupKey: string | null = null;
  
  constructor() {
    // Try to load from localStorage initially
    this.loadFromStorage();
  }
  
  public getApiKey(): string | null {
    return this.apiKey || this.backupKey || null;
  }
  
  public setApiKey(key: string): void {
    this.apiKey = key;
    this.saveToStorage();
  }
  
  public setBackupKey(key: string): void {
    this.backupKey = key;
    this.saveToStorage();
  }
  
  private loadFromStorage(): void {
    try {
      const storedKey = localStorage.getItem('helius_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
      }
      
      const storedBackupKey = localStorage.getItem('helius_backup_key');
      if (storedBackupKey) {
        this.backupKey = storedBackupKey;
      }
    } catch (e) {
      console.error('Error loading Helius API keys from storage:', e);
    }
  }
  
  private saveToStorage(): void {
    try {
      if (this.apiKey) {
        localStorage.setItem('helius_api_key', this.apiKey);
      }
      
      if (this.backupKey) {
        localStorage.setItem('helius_backup_key', this.backupKey);
      }
    } catch (e) {
      console.error('Error saving Helius API keys to storage:', e);
    }
  }
}

export const heliusKeyManager = new HeliusKeyManager();
