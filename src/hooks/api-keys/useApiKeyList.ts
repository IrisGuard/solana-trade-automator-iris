
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
  includeDemoKeys = true
}: UseApiKeyListProps): UseApiKeyListResult {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKeys = async () => {
    if (!userId && !includeDemoKeys) {
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
        const { data, error } = await supabase
          .from('api_keys_storage')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        
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
      
      // If includeDemoKeys or no keys found, add demo keys
      if (includeDemoKeys && (fetchedKeys.length === 0 || !userId)) {
        fetchedKeys.push({
          id: 'demo-helius',
          user_id: userId || 'demo',
          name: 'Helius API Demo Key',
          service: 'helius',
          key_value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
          status: 'active',
          created_at: new Date().toISOString()
        });
      }
      
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
    if (keyId.startsWith('demo-')) {
      toast.error('Cannot delete demo keys');
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
      toast.success('API key deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      errorCollector.captureError(err instanceof Error ? err : new Error('Failed to delete API key'), {
        component: 'useApiKeyList',
        source: 'deleteKey',
        details: { keyId }
      });
      toast.error('Failed to delete API key');
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
