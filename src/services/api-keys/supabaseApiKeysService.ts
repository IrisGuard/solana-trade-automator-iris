
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyEntry } from './types';
import { errorCollector } from '@/utils/error-handling/collector';
import { v4 as uuidv4 } from 'uuid';

export async function fetchApiKeys(userId: string): Promise<ApiKeyEntry[]> {
  try {
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      service: item.service,
      key_value: item.key_value,
      status: item.status as 'active' | 'expired' | 'revoked' | 'failing',
      created_at: item.created_at,
      description: item.description,
      is_encrypted: item.is_encrypted
    })) || [];
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
}

export async function saveApiKeys(keys: ApiKeyEntry[], userId: string): Promise<number> {
  try {
    if (!keys.length) return 0;
    
    // Insert keys one by one to properly handle the array
    let savedCount = 0;
    
    for (const key of keys) {
      const keyToSave = {
        id: key.id || uuidv4(),
        user_id: userId,
        name: key.name,
        service: key.service,
        key_value: key.key_value,
        status: key.status || 'active',
        description: key.description,
        is_encrypted: key.is_encrypted
      };
      
      const { error } = await supabase
        .from('api_keys_storage')
        .insert(keyToSave);
      
      if (error) {
        console.error('Error saving key:', error);
      } else {
        savedCount++;
      }
    }
    
    return savedCount;
  } catch (error) {
    console.error('Error saving API keys:', error);
    return 0;
  }
}

export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
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
    return false;
  }
}
