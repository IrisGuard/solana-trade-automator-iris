
import { ApiKey } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ApiKeyInsert {
  name: string;
  key_value: string;
  service: string;
  description?: string;
  status?: string;
  user_id: string;
  is_encrypted?: boolean;
}

export class ApiIntegrationService {
  static async saveKeyToSupabase(apiKey: ApiKey, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .insert({
          id: apiKey.id,
          name: apiKey.name,
          key_value: apiKey.key,
          service: apiKey.service,
          description: apiKey.description,
          status: apiKey.status || 'active',
          user_id: userId,
          is_encrypted: false, // Local encryption is handled separately
          created_at: apiKey.createdAt
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (e) {
      console.error('Error saving API key to Supabase:', e);
      return false;
    }
  }
  
  static async fetchKeysFromSupabase(userId: string): Promise<ApiKey[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        key: item.key_value,
        service: item.service,
        createdAt: item.created_at || new Date().toISOString(),
        description: item.description,
        status: item.status as 'active' | 'expired' | 'revoked',
        source: 'supabase'
      }));
      
    } catch (e) {
      console.error('Error fetching API keys from Supabase:', e);
      return [];
    }
  }
  
  static async deleteKeyFromSupabase(keyId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (e) {
      console.error('Error deleting API key from Supabase:', e);
      return false;
    }
  }
  
  static async updateKeyInSupabase(apiKey: ApiKey, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .update({
          name: apiKey.name,
          key_value: apiKey.key,
          service: apiKey.service,
          description: apiKey.description,
          status: apiKey.status || 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', apiKey.id)
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (e) {
      console.error('Error updating API key in Supabase:', e);
      return false;
    }
  }

  static async syncKeysWithSupabase(apiKeys: ApiKey[], userId: string): Promise<number> {
    if (!userId) {
      toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά σας");
      return 0;
    }
    
    try {
      let syncedCount = 0;
      
      // Get existing keys from Supabase
      const existingKeys = await this.fetchKeysFromSupabase(userId);
      const existingKeyIds = existingKeys.map(key => key.id);
      
      // Keys to add (not in Supabase yet)
      const keysToAdd = apiKeys.filter(key => !existingKeyIds.includes(key.id));
      
      // Add new keys
      for (const key of keysToAdd) {
        const success = await this.saveKeyToSupabase(key, userId);
        if (success) syncedCount++;
      }
      
      return syncedCount;
    } catch (e) {
      console.error('Error syncing API keys with Supabase:', e);
      return 0;
    }
  }
  
  // Method to detect service type from key pattern
  static detectServiceFromKey(key: string): string | null {
    if (!key) return null;
    
    const patterns = {
      solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      phantom: /^ph_[A-Za-z0-9]{32,}$/,
      helius: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      openai: /^sk-[A-Za-z0-9]{32,}$/,
      github: /^gh[ps]_[A-Za-z0-9]{36,}$/,
      stripe: /^(sk|pk)_(test|live)_[A-Za-z0-9]{24,}$/,
      supabase: /^eyJ.*$/,
      aws: /^AKIA[A-Z0-9]{16}$/
    };
    
    for (const [service, regex] of Object.entries(patterns)) {
      if (regex.test(key)) {
        return service;
      }
    }
    
    // Some simple pattern checks
    if (key.includes('solana')) return 'solana';
    if (key.includes('jupiter')) return 'jupiter';
    if (key.includes('helius')) return 'helius';
    
    return null;
  }
  
  // Return an example key for a given service
  static getExampleKeyForService(service: string): string {
    const examples: {[key: string]: string} = {
      solana: "4aK9Dz1dDN5GG9kGz6wsNJzpHiYCZjfCiTR8WgSQFrq2",
      phantom: "ph_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      helius: "ddb32813-1f4b-459d-8964-310b1b73a053",
      openai: "sk-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9",
      github: "ghp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
      stripe: "sk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      supabase: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      aws: "AKIAIOSFODNN7EXAMPLE",
      alchemy: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      other: "your-api-key-here-123456789abcdef"
    };
    
    return examples[service] || "api_key_example_123456789";
  }
}
