
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
}
