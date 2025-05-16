
import { ApiKey } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class ApiIntegrationService {
  // Sync API keys with Supabase
  static async syncKeysWithSupabase(apiKeys: ApiKey[], userId: string): Promise<number> {
    try {
      if (!apiKeys || apiKeys.length === 0) return 0;
      
      let syncCount = 0;
      
      // Process each key
      for (const key of apiKeys) {
        // Skip keys that shouldn't be synced
        if (key.doNotSync) continue;
        
        // Try to find existing key in Supabase
        const { data: existingKey, error: fetchError } = await supabase
          .from('api_keys_storage')
          .select('*')
          .eq('user_id', userId)
          .eq('name', key.name)
          .eq('service', key.service)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking for existing key:', fetchError);
          continue;
        }
        
        if (existingKey) {
          // Update existing key
          const { error: updateError } = await supabase
            .from('api_keys_storage')
            .update({
              key_value: key.value,
              description: key.description || '',
              status: key.status || 'active',
              is_encrypted: key.isEncrypted || false,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingKey.id);
          
          if (!updateError) syncCount++;
        } else {
          // Insert new key
          const { error: insertError } = await supabase
            .from('api_keys_storage')
            .insert({
              user_id: userId,
              name: key.name,
              service: key.service,
              key_value: key.value,
              description: key.description || '',
              status: key.status || 'active',
              is_encrypted: key.isEncrypted || false
            });
          
          if (!insertError) syncCount++;
        }
      }
      
      return syncCount;
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      throw error;
    }
  }
  
  // Fetch API keys from Supabase
  static async fetchKeysFromSupabase(userId: string): Promise<ApiKey[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Map Supabase data to ApiKey format
      return data.map(item => ({
        id: item.id,
        name: item.name,
        service: item.service,
        value: item.key_value,
        description: item.description || '',
        status: item.status || 'active',
        isEncrypted: item.is_encrypted || false,
        created: new Date(item.created_at).toISOString()
      }));
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
  }
  
  // Test API key validity
  static async testApiKey(key: ApiKey): Promise<boolean> {
    try {
      // Simple validation
      if (!key || !key.value || key.value.length < 5) {
        return false;
      }
      
      // Here we could add actual API validation based on service
      // For now, just return true for all valid-looking keys
      return true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }
  
  // Delete API key
  static async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Σφάλμα κατά τη διαγραφή του κλειδιού API');
      return false;
    }
  }
  
  // Add new API key
  static async addApiKey(key: ApiKey, userId: string): Promise<string | null> {
    try {
      // Validate key
      if (!key.name || !key.service || !key.value) {
        toast.error('Λείπουν απαραίτητα πεδία');
        return null;
      }
      
      const { data, error } = await supabase
        .from('api_keys_storage')
        .insert({
          user_id: userId,
          name: key.name,
          service: key.service,
          key_value: key.value,
          description: key.description || '',
          status: key.status || 'active',
          is_encrypted: key.isEncrypted || false
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (data && data.id) {
        toast.success('Το κλειδί API προστέθηκε επιτυχώς');
        return data.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding API key:', error);
      toast.error('Σφάλμα κατά την προσθήκη του κλειδιού API');
      return null;
    }
  }
}
