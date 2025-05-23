
export class HeliusKeyManager {
  private static instance: HeliusKeyManager;
  private currentKey: string | null = null;

  static getInstance(): HeliusKeyManager {
    if (!HeliusKeyManager.instance) {
      HeliusKeyManager.instance = new HeliusKeyManager();
    }
    return HeliusKeyManager.instance;
  }

  setApiKey(key: string): void {
    this.currentKey = key;
  }

  getApiKey(): string | null {
    return this.currentKey;
  }

  hasValidKey(): boolean {
    return this.currentKey !== null && this.currentKey.length > 0;
  }

  clearKey(): void {
    this.currentKey = null;
  }

  async forceReload(): Promise<void> {
    // Force reload implementation
    console.log('HeliusKeyManager: Force reloading keys...');
    // In a real implementation, this would reload keys from storage
    return Promise.resolve();
  }
}

export const heliusKeyManager = HeliusKeyManager.getInstance();
