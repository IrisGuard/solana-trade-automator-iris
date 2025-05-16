
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { errorCollector } from "@/utils/error-handling/collector";

export class HeliusKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex: number = 0;
  private isInitialized: boolean = false;
  private lastRotation: number = 0;
  private static instance: HeliusKeyManager;
  private apiKeyTestResults: Record<string, boolean> = {};

  constructor() {
    this.init();
  }

  public static getInstance(): HeliusKeyManager {
    if (!HeliusKeyManager.instance) {
      HeliusKeyManager.instance = new HeliusKeyManager();
    }
    return HeliusKeyManager.instance;
  }

  private async init() {
    try {
      await this.loadKeysFromStorage();
      this.isInitialized = true;
      this.lastRotation = Date.now();
      console.log("HeliusKeyManager initialized");
    } catch (error) {
      console.error("Error initializing HeliusKeyManager:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error("Failed to initialize HeliusKeyManager"), {
        component: "HeliusKeyManager",
        source: "client"
      });
    }
  }
  
  public async initialize(): Promise<void> {
    await this.forceReload();
    this.isInitialized = true;
    console.log("HeliusKeyManager initialized explicitly");
  }

  public async forceReload(): Promise<void> {
    await this.loadKeysFromStorage();
    this.lastRotation = Date.now();
  }

  public getKey(): string {
    if (!this.isInitialized || this.apiKeys.length === 0) {
      // No keys available - return empty string
      // The application should handle this case appropriately
      return "";
    }

    // Rotate key if it's been more than 1 hour
    if (Date.now() - this.lastRotation > 3600000) {
      this.rotateKey();
    }

    return this.apiKeys[this.currentKeyIndex];
  }

  public getAllKeys(): string[] {
    return [...this.apiKeys];
  }

  private rotateKey() {
    if (this.apiKeys.length <= 1) return;
    
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    this.lastRotation = Date.now();
    
    console.log(`Rotated to Helius API key #${this.currentKeyIndex + 1}/${this.apiKeys.length}`);
  }

  public async testKey(key: string): Promise<boolean> {
    try {
      // Cache results to avoid repeated tests
      if (this.apiKeyTestResults[key] !== undefined) {
        return this.apiKeyTestResults[key];
      }
      
      // No empty keys
      if (!key || key.trim() === "" || 
          key === "[Your Helius API Key]" ||
          key === "ΧΡΕΙΑΖΕΤΑΙ_ΚΛΕΙΔΙ_API") {
        this.apiKeyTestResults[key] = false;
        return false;
      }
      
      const url = `https://api.helius.xyz/v0/addresses/8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hZ6AbM9J/balances?api-key=${key}`;
      
      const response = await fetch(url);
      const isValid = response.status === 200;
      
      // Cache the result
      this.apiKeyTestResults[key] = isValid;
      
      return isValid;
    } catch (error) {
      console.error("Error testing Helius key:", error);
      this.apiKeyTestResults[key] = false;
      return false;
    }
  }

  public async testAllKeys(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const key of this.apiKeys) {
      results[key] = await this.testKey(key);
    }
    
    return results;
  }

  // Method to register a new key
  public async registerKey(key: string, name: string = "Helius API Key"): Promise<boolean> {
    try {
      // Skip empty or placeholder keys
      if (!key || key.trim() === "" || 
          key === "[Your Helius API Key]" ||
          key === "ΧΡΕΙΑΖΕΤΑΙ_ΚΛΕΙΔΙ_API") {
        toast.error("Παρακαλώ εισάγετε ένα έγκυρο κλειδί Helius API");
        return false;
      }

      // Check if the key is valid first
      const isValid = await this.testKey(key);
      
      if (!isValid) {
        toast.error("Μη έγκυρο κλειδί Helius API");
        return false;
      }
      
      // Check if key already exists
      if (this.apiKeys.includes(key)) {
        toast.info("Αυτό το κλειδί Helius API είναι ήδη καταχωρημένο");
        return false;
      }
      
      // Save to Supabase if possible
      if (supabase) {
        const response = await supabase
          .from('api_keys_storage')
          .insert({
            name,
            service: 'helius',
            key_value: key,
            status: 'active'
          });
          
        if (response.error) {
          console.error("Error saving key to Supabase:", response.error);
          throw new Error(response.error.message);
        }
      }
      
      // Add to local cache
      this.apiKeys.push(key);
      toast.success("Το κλειδί Helius API καταχωρήθηκε επιτυχώς");
      
      return true;
    } catch (error) {
      console.error("Error registering Helius key:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error("Failed to register Helius key"), {
        component: "HeliusKeyManager",
        source: "client"
      });
      return false;
    }
  }

  private async loadKeysFromStorage(): Promise<void> {
    try {
      // Try to load from Supabase first
      if (supabase) {
        const response = await supabase
          .from('api_keys_storage')
          .select()
          .eq('service', 'helius')
          .eq('status', 'active');
          
        if (response.error) {
          throw response.error;
        }
        
        if (response.data && response.data.length > 0) {
          // Extract API keys and filter out placeholders and empty keys
          const keys = response.data
            .map(item => item.key_value)
            .filter(key => 
              key && 
              key.trim() !== "" && 
              key !== "[Your Helius API Key]" &&
              key !== "ΧΡΕΙΑΖΕΤΑΙ_ΚΛΕΙΔΙ_API"
            );
            
          this.apiKeys = keys;
          console.log(`Loaded ${this.apiKeys.length} Helius API keys from Supabase`);
          return;
        }
      }
      
      console.log("No valid Helius API keys found in storage");
      this.apiKeys = [];
    } catch (error) {
      console.error("Error loading Helius API keys:", error);
      this.apiKeys = [];
    }
  }
  
  // No longer needed since we're not storing demo keys in localStorage
  private saveKeysToStorage(): void {
    // Method intentionally empty - we use Supabase for storage now
  }
}

// Export a singleton instance
export const heliusKeyManager = HeliusKeyManager.getInstance();
