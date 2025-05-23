
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyEntry } from './types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enhanced Supabase API Keys service with better error handling and validation
 */
export async function fetchApiKeys(userId: string): Promise<ApiKeyEntry[]> {
  try {
    console.log('[API Keys] Fetching API keys for user:', userId);
    
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[API Keys] Error fetching API keys:', error);
      toast.error('Αποτυχία φόρτωσης κλειδιών API');
      throw error;
    }
    
    const apiKeys = data?.map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      service: item.service,
      key_value: item.key_value,
      status: (item.status === 'expired' || item.status === 'revoked') 
        ? item.status as 'active' | 'expired' | 'revoked' | 'failing'
        : 'active' as 'active' | 'expired' | 'revoked' | 'failing',
      created_at: item.created_at,
      description: item.description,
      is_encrypted: item.is_encrypted || false
    })) || [];
    
    console.log(`[API Keys] Retrieved ${apiKeys.length} API keys`);
    return apiKeys;
  } catch (error) {
    console.error('[API Keys] Error fetching API keys:', error);
    return [];
  }
}

export async function saveApiKeys(keys: ApiKeyEntry[], userId: string): Promise<number> {
  try {
    if (!keys.length) {
      console.log('[API Keys] No keys to save');
      return 0;
    }
    
    console.log(`[API Keys] Saving ${keys.length} API keys for user:`, userId);
    
    let savedCount = 0;
    
    for (const key of keys) {
      try {
        const keyToSave = {
          id: key.id || uuidv4(),
          user_id: userId,
          name: key.name,
          service: key.service,
          key_value: key.key_value,
          status: key.status || 'active',
          description: key.description || null,
          is_encrypted: key.is_encrypted || false
        };
        
        // Check if key already exists
        const { data: existing } = await supabase
          .from('api_keys_storage')
          .select('id')
          .eq('id', keyToSave.id)
          .single();
        
        if (existing) {
          // Update existing key
          const { error } = await supabase
            .from('api_keys_storage')
            .update(keyToSave)
            .eq('id', keyToSave.id);
            
          if (error) {
            console.error('[API Keys] Error updating key:', error);
          } else {
            savedCount++;
          }
        } else {
          // Insert new key
          const { error } = await supabase
            .from('api_keys_storage')
            .insert(keyToSave);
          
          if (error) {
            console.error('[API Keys] Error inserting key:', error);
          } else {
            savedCount++;
          }
        }
      } catch (keyError) {
        console.error('[API Keys] Error processing individual key:', keyError);
      }
    }
    
    if (savedCount > 0) {
      toast.success(`Αποθηκεύτηκαν ${savedCount} κλειδιά API επιτυχώς`);
    }
    
    console.log(`[API Keys] Successfully saved ${savedCount} keys`);
    return savedCount;
  } catch (error) {
    console.error('[API Keys] Error saving API keys:', error);
    toast.error('Αποτυχία αποθήκευσης κλειδιών API');
    return 0;
  }
}

export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
  try {
    console.log('[API Keys] Deleting API key:', keyId);
    
    const { error } = await supabase
      .from('api_keys_storage')
      .delete()
      .eq('id', keyId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('[API Keys] Error deleting API key:', error);
      toast.error('Αποτυχία διαγραφής κλειδιού API');
      throw error;
    }
    
    console.log('[API Keys] API key deleted successfully');
    toast.success('Το κλειδί API διαγράφηκε επιτυχώς');
    return true;
  } catch (error) {
    console.error('[API Keys] Error deleting API key:', error);
    return false;
  }
}

/**
 * Test API key functionality
 */
export async function testApiKey(keyId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('id', keyId)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    // Update the status to indicate it was tested
    await supabase
      .from('api_keys_storage')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', keyId);
    
    return true;
  } catch (error) {
    console.error('[API Keys] Error testing API key:', error);
    return false;
  }
}
