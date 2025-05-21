
import { useState, useEffect, useCallback } from 'react';
import { ApiKey, ApiKeyEntry } from '@/services/api-keys/types';

/**
 * Hook to manage API keys
 */
export function useApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);
  
  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);
  
  // Load API keys from storage or API
  const loadApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockKeys: ApiKeyEntry[] = [
        {
          id: '1',
          name: 'Helius API',
          service: 'Helius',
          key_value: 'demo-key-xxxx-yyyy',
          status: 'active',
          user_id: 'demo-user',
          description: 'Demo Helius API key',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Quicknode',
          service: 'Quicknode',
          key_value: 'qn-api-xxxx-yyyy',
          status: 'active',
          user_id: 'demo-user',
          created_at: new Date().toISOString()
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Toggle key visibility
  const toggleKeyVisibility = useCallback((id: string) => {
    setVisibleKeyIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(keyId => keyId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  // Copy key to clipboard
  const handleCopy = useCallback((id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      navigator.clipboard.writeText(key.key_value);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  }, [apiKeys]);
  
  // Add a new API key
  const handleAddNewKey = useCallback((key: Omit<ApiKeyEntry, 'id' | 'created_at'>) => {
    const newKey: ApiKeyEntry = {
      ...key,
      id: `new-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    setApiKeys(prev => [...prev, newKey]);
  }, []);
  
  return {
    apiKeys,
    isLoading,
    copiedKeyId,
    visibleKeyIds,
    loadApiKeys,
    handleCopy,
    handleAddNewKey,
    toggleKeyVisibility
  };
}
