
import { useState, useEffect, useCallback } from '../../react-compatibility';
import { toast } from 'sonner';
import { ApiKeyEntry } from '@/services/api-keys/types';

export function useApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load API keys
  const loadApiKeys = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Mock data - in a real app this would come from an API
      const mockApiKeys: ApiKeyEntry[] = [
        {
          id: '1',
          user_id: 'user123',
          name: 'Helius API Key',
          service: 'helius',
          key_value: 'hl_b865d0a3c9884e80a7a8af66f9846154',
          status: 'active',
          created_at: new Date().toISOString(),
          description: 'Main Helius API key for RPC calls',
          is_encrypted: false
        },
        {
          id: '2',
          user_id: 'user123',
          name: 'Jupiter API Key',
          service: 'jupiter',
          key_value: 'jp_4db7c1e98f5a4b01b2e9fcde3a9d7e27',
          status: 'active',
          created_at: new Date().toISOString(),
          description: 'Jupiter Swap API access',
          is_encrypted: true
        }
      ];
      
      setApiKeys(mockApiKeys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Effect to load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);
  
  return {
    apiKeys,
    isLoading,
    loadApiKeys
  };
}
