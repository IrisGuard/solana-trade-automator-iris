
import { useState, useCallback } from '../../react-compatibility';
import { ApiKeyEntry } from '@/services/api-keys/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function useApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add API Key
  const addApiKey = useCallback((keyData: Omit<ApiKeyEntry, 'id' | 'created_at' | 'is_encrypted'>) => {
    const newKey: ApiKeyEntry = {
      id: uuidv4(),
      user_id: keyData.user_id,
      name: keyData.name,
      service: keyData.service,
      key_value: keyData.key_value,
      status: keyData.status || 'active',
      created_at: new Date().toISOString(),
      description: keyData.description || '',
      is_encrypted: false // Default value
    };
    
    setApiKeys(prev => [...prev, newKey]);
    toast.success('API Key added successfully');
    return newKey;
  }, []);
  
  // Update API Key
  const updateApiKey = useCallback((id: string, updates: Partial<ApiKeyEntry>) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, ...updates } : key
      )
    );
  }, []);
  
  // Delete API Key
  const deleteApiKey = useCallback((id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success('API Key removed successfully');
  }, []);
  
  return {
    apiKeys,
    isLoading,
    error,
    addApiKey,
    updateApiKey,
    deleteApiKey,
    setIsLoading,
    setError
  };
}
