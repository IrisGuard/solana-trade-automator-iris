
import { errorCollector } from '@/utils/error-handling/collector';

// Mock implementation of HeliusKeyManager class
class HeliusKeyManager {
  private apiKeys: Map<string, string> = new Map();
  private currentKeyIndex = 0;
  private apiKeysArray: string[] = [];

  constructor() {
    this.loadApiKeys();
  }

  private loadApiKeys(): void {
    try {
      // Mock loading API keys
      this.apiKeys.set('default', 'mock-helius-api-key-1');
      this.apiKeys.set('backup', 'mock-helius-api-key-2');
      this.apiKeysArray = Array.from(this.apiKeys.values());
    } catch (error) {
      console.error('Failed to load Helius API keys:', error);
      this.reportError(new Error('Failed to load Helius API keys'));
    }
  }

  public getApiKey(): string {
    if (this.apiKeysArray.length === 0) {
      this.reportError(new Error('No Helius API keys available'));
      return '';
    }

    const key = this.apiKeysArray[this.currentKeyIndex];
    this.rotateKey();
    return key;
  }

  private rotateKey(): void {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeysArray.length;
  }

  public registerApiKey(key: string, alias?: string): boolean {
    try {
      if (!key) {
        this.reportError(new Error('Invalid API key'));
        return false;
      }

      const keyAlias = alias || `helius-key-${this.apiKeys.size + 1}`;
      this.apiKeys.set(keyAlias, key);
      this.apiKeysArray = Array.from(this.apiKeys.values());
      return true;
    } catch (error) {
      this.reportError(new Error('Failed to register API key'));
      return false;
    }
  }

  public removeApiKey(keyOrAlias: string): boolean {
    try {
      // Try to remove by alias
      if (this.apiKeys.has(keyOrAlias)) {
        this.apiKeys.delete(keyOrAlias);
        this.apiKeysArray = Array.from(this.apiKeys.values());
        return true;
      }

      // Try to remove by value
      for (const [alias, key] of this.apiKeys.entries()) {
        if (key === keyOrAlias) {
          this.apiKeys.delete(alias);
          this.apiKeysArray = Array.from(this.apiKeys.values());
          return true;
        }
      }

      return false;
    } catch (error) {
      this.reportError(new Error('Failed to remove API key'));
      return false;
    }
  }

  public getAllKeys(): string[] {
    return this.apiKeysArray;
  }

  public getKeyCount(): number {
    return this.apiKeysArray.length;
  }

  private reportError(error: Error): void {
    errorCollector.captureError(error, {
      component: 'HeliusKeyManager',
      source: 'client',
      severity: 'medium'
    });
  }
}

export const heliusKeyManager = new HeliusKeyManager();
