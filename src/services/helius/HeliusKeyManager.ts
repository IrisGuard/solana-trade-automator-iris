
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
}

export const heliusKeyManager = HeliusKeyManager.getInstance();
