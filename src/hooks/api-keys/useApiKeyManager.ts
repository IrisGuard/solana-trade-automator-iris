
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { ApiKeyEntry } from '@/services/api-keys/types';

interface UseApiKeyManagerProps {
  userId?: string;
  onSuccess?: (key: ApiKeyEntry) => void;
}

export function useApiKeyManager({ userId, onSuccess }: UseApiKeyManagerProps = {}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const addKey = async (
    name: string, 
    service: string, 
    keyValue: string, 
    description?: string
  ): Promise<ApiKeyEntry | null> => {
    if (!userId) {
      toast.error('You need to be logged in to add API keys');
      return null;
    }
    
    setIsAdding(true);
    
    try {
      const newKey: ApiKeyEntry = {
        id: uuidv4(),
        user_id: userId,
        name,
        service,
        key_value: keyValue,
        // Use a valid literal value for status
        status: 'active',
        created_at: new Date().toISOString(),
        description
      };
      
      const { error } = await supabase
        .from('api_keys_storage')
        .insert({
          id: newKey.id,
          user_id: newKey.user_id,
          name: newKey.name,
          service: newKey.service,
          key_value: newKey.key_value,
          status: newKey.status,
          description: newKey.description
        });
      
      if (error) throw error;
      
      toast.success('API key added successfully');
      onSuccess?.(newKey);
      return newKey;
    } catch (err) {
      console.error('Error adding API key:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Failed to add API key'), {
        component: 'useApiKeyManager',
        source: 'addKey',
        details: { name, service }
      });
      toast.error('Failed to add API key');
      return null;
    } finally {
      setIsAdding(false);
    }
  };
  
  const updateKey = async (
    keyId: string, 
    updates: Partial<Omit<ApiKeyEntry, 'id' | 'created_at'>>
  ): Promise<ApiKeyEntry | null> => {
    if (!userId) {
      toast.error('You need to be logged in to update API keys');
      return null;
    }
    
    if (keyId.startsWith('demo-')) {
      toast.error('Cannot update demo keys');
      return null;
    }
    
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .update(updates)
        .eq('id', keyId)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('API key updated successfully');
      
      const updatedKey: ApiKeyEntry = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        service: data.service,
        key_value: data.key_value,
        status: data.status,
        created_at: data.created_at,
        description: data.description,
        is_encrypted: data.is_encrypted
      };
      
      onSuccess?.(updatedKey);
      return updatedKey;
    } catch (err) {
      console.error('Error updating API key:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Failed to update API key'), {
        component: 'useApiKeyManager',
        source: 'updateKey',
        details: { keyId }
      });
      toast.error('Failed to update API key');
      return null;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    addKey,
    updateKey,
    isAdding,
    isUpdating
  };
}
