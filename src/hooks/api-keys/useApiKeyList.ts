
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { ApiKeyEntry } from '@/services/api-keys/types';

interface UseApiKeyListProps {
  userId?: string;
  includeDemoKeys?: boolean;
}

interface UseApiKeyListResult {
  keys: ApiKeyEntry[];
  loading: boolean;
  error: Error | null;
  refreshKeys: () => Promise<void>;
  deleteKey: (keyId: string) => Promise<boolean>;
}

export function useApiKeyList({ 
  userId,
  includeDemoKeys = false // Demo keys are disabled by default
}: UseApiKeyListProps): UseApiKeyListResult {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKeys = async () => {
    if (!userId) {
      setKeys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedKeys: ApiKeyEntry[] = [];
      
      // If user is logged in, fetch their keys
      if (userId) {
        const { data, error: fetchError } = await supabase
          .from('api_keys_storage')
          .select('*')
          .eq('user_id', userId);
          
        if (fetchError) throw fetchError;
        
        if (data) {
          fetchedKeys = data.map((item) => ({
            id: item.id,
            user_id: item.user_id,
            name: item.name,
            service: item.service,
            key_value: item.key_value,
            status: item.status as 'active' | 'expired' | 'revoked' | 'failing',
            created_at: item.created_at,
            description: item.description,
            is_encrypted: item.is_encrypted
          }));
        }
      }
      
      // No more demo keys included by default
      setKeys(fetchedKeys);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load API keys';
      setError(new Error(errorMessage));
      console.error('Error in useApiKeyList:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error(errorMessage), {
        component: 'useApiKeyList',
        source: 'fetchKeys',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [userId, includeDemoKeys]);

  const deleteKey = async (keyId: string): Promise<boolean> => {
    if (!userId) return false;
    
    // Demo keys should not exist anymore, but just in case
    if (keyId.startsWith('demo-')) {
      toast.error('Δεν είναι δυνατή η διαγραφή κλειδιών demo');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('Το κλειδί API διαγράφηκε επιτυχώς');
      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Failed to delete API key'), {
        component: 'useApiKeyList',
        source: 'deleteKey',
        details: { keyId }
      });
      toast.error('Αποτυχία διαγραφής κλειδιού API');
      return false;
    }
  };

  return {
    keys,
    loading,
    error,
    refreshKeys: fetchKeys,
    deleteKey
  };
}
