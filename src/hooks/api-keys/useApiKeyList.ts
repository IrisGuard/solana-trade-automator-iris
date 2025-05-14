
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { fetchApiKeys } from '@/services/api-keys/supabaseApiKeysService';
import { ApiKeyEntry, ApiKeyWithState } from '@/services/api-keys/types';
import { errorCollector } from '@/utils/error-handling/collector';

export function useApiKeyList() {
  const [apiKeys, setApiKeys] = useState<ApiKeyWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch API keys when component mounts or user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadApiKeys = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no user, we'll use demo data
        if (!user) {
          if (isMounted) {
            setApiKeys([
              {
                id: 'demo',
                name: 'Helius API Demo Key',
                service: 'helius',
                key_value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
                status: 'active',
                created_at: new Date().toISOString()
              }
            ]);
            setLoading(false);
          }
          return;
        }
        
        // Fetch real data from Supabase
        const data = await fetchApiKeys(user.id);
        
        if (isMounted) {
          // Add UI state properties to each key
          setApiKeys(data.map(key => ({
            ...key,
            isVisible: false,
            isWorking: key.status === 'active'
          })));
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading API keys:', err);
        
        if (isMounted) {
          setError('Failed to load API keys');
          setLoading(false);
          
          // Capture the error for monitoring
          errorCollector.captureError(err instanceof Error ? err : new Error(String(err)), {
            component: 'useApiKeyList'
          });
        }
      }
    };
    
    loadApiKeys();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Function to refresh the API key list
  const refreshApiKeys = async () => {
    setLoading(true);
    try {
      const data = await fetchApiKeys(user?.id);
      
      // Preserve visibility state of existing keys
      setApiKeys(data.map(newKey => {
        const existingKey = apiKeys.find(k => k.id === newKey.id);
        return {
          ...newKey,
          isVisible: existingKey?.isVisible || false,
          isWorking: newKey.status === 'active'
        };
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error refreshing API keys:', err);
      setError('Failed to refresh API keys');
      
      errorCollector.captureError(err instanceof Error ? err : new Error(String(err)), {
        component: 'useApiKeyList.refreshApiKeys'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    apiKeys,
    setApiKeys,
    loading,
    error,
    refreshApiKeys
  };
}
