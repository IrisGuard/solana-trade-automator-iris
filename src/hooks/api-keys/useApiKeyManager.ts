
import { useState, useCallback } from '../../react-compatibility';
import { ApiKeyEntry } from '@/services/api-keys/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function useApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  
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
  
  // Toggle key visibility
  const toggleKeyVisibility = useCallback((id: string) => {
    setVisibleKeyIds(prev => 
      prev.includes(id) 
        ? prev.filter(keyId => keyId !== id) 
        : [...prev, id]
    );
  }, []);
  
  // Handle copy to clipboard
  const handleCopy = useCallback((id: string, value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 3000);
        toast.success('API key copied to clipboard');
      },
      () => {
        toast.error('Failed to copy API key');
      }
    );
  }, []);
  
  // Fetch API keys
  const fetchApiKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Here you would normally fetch from an API
      // Mock fetch for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Leave existing keys in place for now since we're mocking
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  }, []);
  
  // Load API keys
  const loadApiKeys = useCallback(async () => {
    await fetchApiKeys();
  }, [fetchApiKeys]);
  
  return {
    apiKeys,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    visibleKeyIds,
    copiedKeyId,
    addApiKey,
    updateApiKey,
    deleteApiKey,
    toggleKeyVisibility,
    handleCopy,
    fetchApiKeys,
    loadApiKeys,
    handleAddNewKey: addApiKey, // Alias for backward compatibility
    setIsLoading,
    setError
  };
}
