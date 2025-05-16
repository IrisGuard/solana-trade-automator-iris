
import { supabase } from '@/integrations/supabase/client';
import { ApiKey } from './types';
import { v4 as uuidv4 } from 'uuid';

export class ApiIntegrationService {
  // Sync keys with Supabase
  static async syncKeysWithSupabase(apiKeys: ApiKey[], userId: string): Promise<number> {
    if (!userId) {
      throw new Error('User ID is required for syncing with Supabase');
    }

    try {
      let syncedCount = 0;
      
      // Get existing keys from Supabase for this user
      const { data: existingKeys, error: fetchError } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      
      // Create map of existing keys by service and name for easy lookup
      const existingKeysMap = new Map();
      if (existingKeys) {
        existingKeys.forEach(key => {
          const mapKey = `${key.service}-${key.name}`;
          existingKeysMap.set(mapKey, key);
        });
      }
      
      // Process each key from local storage
      for (const key of apiKeys) {
        // Skip placeholder keys
        if (!key.key || key.key.includes('[Your') || key.key === 'development-key') {
          continue;
        }
        
        const mapKey = `${key.service}-${key.name}`;
        const existingKey = existingKeysMap.get(mapKey);
        
        if (existingKey) {
          // Key exists, check if it needs updating
          if (existingKey.key_value !== key.key) {
            const { error: updateError } = await supabase
              .from('api_keys_storage')
              .update({
                key_value: key.key,
                status: key.status || 'active',
                updated_at: new Date().toISOString()
              })
              .eq('id', existingKey.id);
              
            if (updateError) throw updateError;
            
            syncedCount++;
          }
        } else {
          // Key doesn't exist, insert it
          const { error: insertError } = await supabase
            .from('api_keys_storage')
            .insert({
              id: key.id || uuidv4(),
              user_id: userId,
              name: key.name,
              service: key.service,
              key_value: key.key,
              status: key.status || 'active',
              description: key.description || '',
              is_encrypted: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) throw insertError;
          
          syncedCount++;
        }
      }
      
      return syncedCount;
    } catch (error) {
      console.error('Error syncing keys with Supabase:', error);
      throw error;
    }
  }
  
  // Fetch keys from Supabase
  static async fetchKeysFromSupabase(userId: string): Promise<ApiKey[]> {
    if (!userId) {
      throw new Error('User ID is required for fetching from Supabase');
    }
    
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (!data) return [];
      
      // Map to ApiKey format
      return data.map(key => ({
        id: key.id,
        name: key.name,
        service: key.service,
        key: key.key_value,
        status: key.status as 'active' | 'expired' | 'revoked',
        description: key.description,
        createdAt: key.created_at,
        isWorking: key.status === 'active'
      }));
    } catch (error) {
      console.error('Error fetching keys from Supabase:', error);
      throw error;
    }
  }
  
  // Delete key from Supabase
  static async deleteKeyFromSupabase(keyId: string, userId: string): Promise<boolean> {
    if (!userId || !keyId) {
      throw new Error('User ID and Key ID are required for deletion');
    }
    
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting key from Supabase:', error);
      return false;
    }
  }
  
  // Add key to Supabase
  static async addKeyToSupabase(key: ApiKey, userId: string): Promise<ApiKey | null> {
    if (!userId) {
      throw new Error('User ID is required to add a key');
    }
    
    try {
      const keyData = {
        id: key.id || uuidv4(),
        user_id: userId,
        name: key.name,
        service: key.service,
        key_value: key.key,
        status: key.status || 'active',
        description: key.description || '',
        is_encrypted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('api_keys_storage')
        .insert(keyData)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return {
          id: data[0].id,
          name: data[0].name,
          service: data[0].service,
          key: data[0].key_value,
          status: data[0].status as 'active' | 'expired' | 'revoked',
          description: data[0].description,
          createdAt: data[0].created_at,
          isWorking: data[0].status === 'active'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error adding key to Supabase:', error);
      throw error;
    }
  }
}
