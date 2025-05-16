
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

class HeliusKeyManager {
  private apiKeys: Map<string, string> = new Map();
  private currentKeyIndex = 0;
  private apiKeysArray: string[] = [];
  private initialized = false;

  constructor() {
    this.initialize();
  }

  public async initialize(): Promise<void> {
    try {
      console.log('Αρχικοποίηση HeliusKeyManager');
      await this.loadApiKeysFromSupabase();
      this.initialized = true;
      console.log(`Το HeliusKeyManager αρχικοποιήθηκε με ${this.apiKeysArray.length} κλειδιά`);
    } catch (error) {
      console.error('Αποτυχία αρχικοποίησης HeliusKeyManager:', error);
      this.reportError(new Error('Αποτυχία αρχικοποίησης HeliusKeyManager'));
      
      // Add fallback key for development - using the provided key
      this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-key');
      this.initialized = true;
    }
  }

  public async forceReload(): Promise<void> {
    try {
      console.log('Αναγκαστική επαναφόρτωση κλειδιών API Helius');
      this.apiKeys.clear();
      this.apiKeysArray = [];
      await this.loadApiKeysFromSupabase();
      console.log(`Το HeliusKeyManager επαναφορτώθηκε με ${this.apiKeysArray.length} κλειδιά`);
    } catch (error) {
      console.error('Αποτυχία επαναφόρτωσης κλειδιών API Helius:', error);
      this.reportError(new Error('Αποτυχία επαναφόρτωσης κλειδιών API Helius'));
      
      // Make sure we have the default key
      this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-key');
    }
  }

  private async loadApiKeysFromSupabase(): Promise<void> {
    try {
      console.log('Φόρτωση κλειδιών API Helius από Supabase...');
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('id, key_value, name')
        .eq('service', 'helius')
        .eq('status', 'active');

      if (error) throw error;

      if (data && data.length > 0) {
        console.log(`Βρέθηκαν ${data.length} κλειδιά API Helius`);
        data.forEach(key => {
          this.registerApiKey(key.key_value, key.name || key.id);
        });
        console.log(`Φορτώθηκαν ${data.length} κλειδιά API Helius από Supabase`);
      } else {
        console.log('Δεν βρέθηκαν κλειδιά API Helius στο Supabase, χρήση εφεδρικού');
        // Use the provided key as fallback
        this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-fallback');
      }
    } catch (error) {
      console.error('Αποτυχία φόρτωσης κλειδιών API Helius από Supabase:', error);
      this.reportError(new Error('Αποτυχία φόρτωσης κλειδιών API Helius από Supabase'));
      // Εφεδρικό κλειδί
      this.registerApiKey('ddb32813-1f4b-459d-8964-310b1b73a053', 'default-error-fallback');
    }
  }

  public getApiKey(): string {
    if (!this.initialized) {
      console.warn('HeliusKeyManager δεν έχει αρχικοποιηθεί, επιστροφή προεπιλεγμένου κλειδιού');
      return 'ddb32813-1f4b-459d-8964-310b1b73a053';
    }
    
    if (this.apiKeysArray.length === 0) {
      this.reportError(new Error('Δεν υπάρχουν διαθέσιμα κλειδιά API Helius'));
      return 'ddb32813-1f4b-459d-8964-310b1b73a053';
    }

    const key = this.apiKeysArray[this.currentKeyIndex];
    this.rotateKey();
    return key;
  }

  private rotateKey(): void {
    if (this.apiKeysArray.length > 1) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeysArray.length;
    }
  }

  public registerApiKey(key: string, alias?: string): boolean {
    try {
      if (!key) {
        this.reportError(new Error('Μη έγκυρο κλειδί API'));
        return false;
      }

      const keyAlias = alias || `helius-key-${this.apiKeys.size + 1}`;
      this.apiKeys.set(keyAlias, key);
      this.apiKeysArray = Array.from(this.apiKeys.values());
      console.log(`Καταχωρήθηκε το κλειδί API Helius: ${key.substring(0, 8)}... ως ${keyAlias}`);
      return true;
    } catch (error) {
      this.reportError(new Error('Αποτυχία καταχώρησης κλειδιού API'));
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
      this.reportError(new Error('Αποτυχία αφαίρεσης κλειδιού API'));
      return false;
    }
  }

  public getAllKeys(): string[] {
    return this.apiKeysArray;
  }

  public getKeyCount(): number {
    return this.apiKeysArray.length;
  }
  
  public isInitialized(): boolean {
    return this.initialized;
  }

  private reportError(error: Error): void {
    console.error('HeliusKeyManager error:', error);
    errorCollector.captureError(error, {
      component: 'HeliusKeyManager',
      source: 'client',
      severity: 'medium'
    });
  }
}

export const heliusKeyManager = new HeliusKeyManager();
