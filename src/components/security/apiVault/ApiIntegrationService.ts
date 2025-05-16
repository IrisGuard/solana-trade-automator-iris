
import { supabase } from "@/integrations/supabase/client";
import { ApiKey } from "./types";
import { toast } from "sonner";

export class ApiIntegrationService {
  // Sync API keys with Supabase
  static async syncKeysWithSupabase(apiKeys: ApiKey[], userId: string): Promise<number> {
    let syncCount = 0;
    
    try {
      // Get existing keys from Supabase
      const { data: existingKeys } = await supabase
        .from('api_keys_storage')
        .select('id')
        .eq('user_id', userId);
      
      const existingIds = existingKeys?.map(k => k.id) || [];
      
      // Filter out keys that shouldn't be synced
      const keysToSync = apiKeys.filter(key => {
        // Skip keys marked as do not sync (if property exists)
        if ('doNotSync' in key && key.doNotSync) {
          return false;
        }
        return true;
      });
      
      // Process each key
      for (const key of keysToSync) {
        // Check if key already exists
        if (existingIds.includes(key.id)) {
          // Update existing key
          const { error } = await supabase
            .from('api_keys_storage')
            .update({
              name: key.name,
              service: key.service,
              key_value: key.key || '', // Use key property if it exists
              description: key.description || '',
              status: key.status,
              is_encrypted: 'isEncrypted' in key ? key.isEncrypted : false,
              updated_at: new Date().toISOString()
            })
            .eq('id', key.id)
            .eq('user_id', userId);
          
          if (error) throw error;
        } else {
          // Insert new key
          const { error } = await supabase
            .from('api_keys_storage')
            .insert({
              id: key.id,
              user_id: userId,
              name: key.name,
              service: key.service,
              key_value: key.key || '', // Use key property if it exists
              description: key.description || '',
              status: key.status,
              is_encrypted: 'isEncrypted' in key ? key.isEncrypted : false,
              created_at: key.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (error) throw error;
          syncCount++;
        }
      }
      
      return syncCount;
    } catch (err) {
      console.error('Error syncing with Supabase:', err);
      throw err;
    }
  }
  
  // Fetch API keys from Supabase
  static async fetchKeysFromSupabase(userId: string): Promise<ApiKey[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert to ApiKey format
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        service: item.service,
        key: item.key_value,
        description: item.description,
        status: item.status,
        isEncrypted: item.is_encrypted,
        createdAt: item.created_at,
      }));
    } catch (err) {
      console.error('Error fetching from Supabase:', err);
      throw err;
    }
  }
  
  // Test an API key
  static async testApiKey(key: ApiKey): Promise<boolean> {
    try {
      // Simplified: Just check if key exists
      const keyValue = 'key' in key ? key.key : '';
      if (!keyValue) return false;
      
      // In a real app, this would do an actual API test
      return keyValue.length > 10;
    } catch (err) {
      console.error('Error testing API key:', err);
      return false;
    }
  }
  
  // Delete an API key
  static async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      return false;
    }
  }
  
  // Create or update an API key
  static async saveApiKey(key: ApiKey, userId: string): Promise<ApiKey | null> {
    try {
      const keyValue = 'key' in key ? key.key : '';
      
      const { data, error } = await supabase
        .from('api_keys_storage')
        .upsert({
          id: key.id,
          user_id: userId,
          name: key.name,
          service: key.service,
          key_value: keyValue,
          description: key.description || '',
          status: key.status,
          is_encrypted: 'isEncrypted' in key ? key.isEncrypted : false,
          created_at: key.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data ? {
        id: data.id,
        name: data.name,
        service: data.service,
        key: data.key_value,
        description: data.description,
        status: data.status,
        isEncrypted: data.is_encrypted,
        createdAt: data.created_at,
      } : null;
    } catch (err) {
      console.error('Error saving API key:', err);
      return null;
    }
  }
  
  // Detect service from key (utility method)
  static detectServiceFromKey(keyValue: string): string {
    if (!keyValue) return 'unknown';
    
    if (keyValue.startsWith('sk_live_') || keyValue.startsWith('sk_test_')) {
      return 'stripe';
    } else if (keyValue.startsWith('SG.')) {
      return 'sendgrid';
    } else if (keyValue.startsWith('pk_live_') || keyValue.startsWith('pk_test_')) {
      return 'stripe_public';
    } else if (keyValue.startsWith('sk-')) {
      return 'openai';
    } else if (keyValue.length > 40) {
      return 'helius';
    }
    
    return 'generic';
  }
}
