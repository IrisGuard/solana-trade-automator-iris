
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Class responsible for managing multiple Helius API keys and implementing key rotation
 * to mitigate rate limit issues.
 */
export class HeliusKeyManager {
  private static instance: HeliusKeyManager;
  private keys: string[] = [];
  private currentKeyIndex: number = 0;
  private lastKeySwitch: number = 0;
  private isLoading: boolean = false;
  
  // Default demo key for fallback
  private readonly DEFAULT_KEY = "ddb32813-1f4b-459d-8964-310b1b73a053";
  
  // Service types for different Helius endpoints
  private readonly HELIUS_SERVICES = [
    'helius', 
    'helius-rpc', 
    'helius-api-v0', 
    'helius-websocket'
  ];
  
  // Key switch cool-down period (3 seconds)
  private readonly KEY_SWITCH_COOLDOWN = 3000;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of the key manager
   */
  public static getInstance(): HeliusKeyManager {
    if (!HeliusKeyManager.instance) {
      HeliusKeyManager.instance = new HeliusKeyManager();
    }
    return HeliusKeyManager.instance;
  }

  /**
   * Initialize the key manager by loading keys from Supabase
   */
  public async initialize(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Load keys from Supabase for all Helius service types
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('key_value')
        .in('service', this.HELIUS_SERVICES)
        .eq('status', 'active');
        
      if (error) throw error;
      
      // Extract keys from the results
      if (data && data.length > 0) {
        this.keys = data.map(item => item.key_value)
                       .filter(Boolean)
                       .filter((value, index, self) => self.indexOf(value) === index); // Unique keys only
        console.log(`Loaded ${this.keys.length} Helius API keys`);
      } else {
        console.warn("No Helius API keys found in database, using default key");
        this.keys = [this.DEFAULT_KEY];
      }
    } catch (error) {
      console.error("Error loading Helius API keys:", error);
      // Fallback to default key
      this.keys = [this.DEFAULT_KEY];
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get current API key
   */
  public getCurrentKey(): string {
    // If keys not loaded yet, return default
    if (this.keys.length === 0) {
      return this.DEFAULT_KEY;
    }
    
    return this.keys[this.currentKeyIndex];
  }

  /**
   * Rotate to the next available API key when rate limit is hit
   */
  public rotateKey(): string {
    const now = Date.now();
    
    // Check if we're rotating keys too quickly
    if (now - this.lastKeySwitch < this.KEY_SWITCH_COOLDOWN) {
      return this.getCurrentKey();
    }
    
    // Record the time of this key switch
    this.lastKeySwitch = now;
    
    // If we only have one key, there's nothing to rotate
    if (this.keys.length <= 1) {
      return this.getCurrentKey();
    }
    
    // Rotate to next key
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    
    const rotatedKey = this.getCurrentKey();
    console.log(`Rotated to Helius API key #${this.currentKeyIndex + 1}`);
    
    return rotatedKey;
  }

  /**
   * Add a new Helius API key to the database and key manager
   */
  public async addHeliusKey(key: string, userId: string, service: string = 'helius'): Promise<boolean> {
    try {
      // Check if key already exists
      const { data: existingKeys, error: checkError } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('key_value', key)
        .in('service', this.HELIUS_SERVICES);
      
      if (checkError) throw checkError;
      
      // If key already exists, don't add it again
      if (existingKeys && existingKeys.length > 0) {
        console.log('This Helius API key already exists');
        return true;
      }
      
      // Add new key to database
      const { error } = await supabase
        .from('api_keys_storage')
        .insert({
          name: `Helius API Key ${this.keys.length + 1}`,
          key_value: key,
          service: service,
          description: 'Added via key rotation system',
          status: 'active',
          user_id: userId,
          is_encrypted: false
        });
        
      if (error) throw error;
      
      // Add key to local array
      this.keys.push(key);
      
      console.log('Successfully added new Helius API key');
      return true;
    } catch (error) {
      console.error('Error adding Helius API key:', error);
      toast.error('Failed to add Helius API key');
      return false;
    }
  }

  /**
   * Get all available Helius keys
   */
  public getKeys(): string[] {
    return [...this.keys];
  }

  /**
   * Get the count of available keys
   */
  public getKeyCount(): number {
    return this.keys.length;
  }

  /**
   * Get the proper endpoint URL with key
   */
  public getEndpointWithKey(baseUrl: string): string {
    const key = this.getCurrentKey();
    
    // Check if the URL already contains an API key parameter
    if (baseUrl.includes('api-key=')) {
      return baseUrl;
    }
    
    // Determine how to append the API key
    if (baseUrl.includes('?')) {
      return `${baseUrl}&api-key=${key}`;
    } else {
      return `${baseUrl}?api-key=${key}`;
    }
  }
}

// Export a singleton instance
export const heliusKeyManager = HeliusKeyManager.getInstance();
