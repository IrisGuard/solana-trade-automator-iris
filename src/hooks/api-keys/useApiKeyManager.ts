
import { useState, useCallback } from 'react';
import { useApiKeyList } from './useApiKeyList';
import { useApiKeyVisibility } from './useApiKeyVisibility';
import { useClipboard } from './useClipboard';
import { ApiKeyWithState } from '@/services/api-keys/types';
import { deleteApiKey, testApiKey, updateApiKey } from '@/services/api-keys/supabaseApiKeysService';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export function useApiKeyManager() {
  const { apiKeys, setApiKeys, loading, error, refreshApiKeys } = useApiKeyList();
  const { visibleKeyIds, toggleKeyVisibility, formatKeyDisplay, isKeyVisible } = useApiKeyVisibility();
  const { copiedValue, copyToClipboard, isCopied } = useClipboard();
  
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});

  // Handle copying key to clipboard
  const handleCopy = useCallback((text: string) => {
    copyToClipboard(text, 'API key copied to clipboard!');
  }, [copyToClipboard]);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  // Delete a key
  const handleDeleteKey = useCallback(async (keyId: string) => {
    try {
      const success = await deleteApiKey(keyId);
      
      if (success) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
      }
    } catch (error) {
      console.error('Error deleting key:', error);
      toast.error('Failed to delete API key');
      
      errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'useApiKeyManager.handleDeleteKey'
      });
    }
  }, [setApiKeys]);

  // Test a key's functionality
  const handleTestKey = useCallback(async (key: ApiKeyWithState) => {
    if (testingKeys[key.id]) return; // Prevent multiple simultaneous tests
    
    setTestingKeys(prev => ({ ...prev, [key.id]: true }));
    
    try {
      const isWorking = await testApiKey(key.service, key.key_value);
      
      // Update key status in UI
      setApiKeys(prev => prev.map(k => 
        k.id === key.id 
          ? { 
              ...k, 
              isWorking,
              status: isWorking ? 'active' : 'failing',
              status_message: isWorking ? undefined : 'API key test failed'
            } 
          : k
      ));
      
      // Try to update the key status in the database
      if (key.id !== 'demo') {
        await updateApiKey(key.id, {
          status: isWorking ? 'active' : 'failing',
          status_message: isWorking ? null : 'API key test failed'
        });
      }
      
      toast[isWorking ? 'success' : 'error'](
        isWorking ? 'API key is working!' : 'API key test failed'
      );
      
      return isWorking;
    } catch (error) {
      console.error('Error testing key:', error);
      toast.error('Error testing API key');
      
      errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
        component: 'useApiKeyManager.handleTestKey'
      });
      
      return false;
    } finally {
      setTestingKeys(prev => ({ ...prev, [key.id]: false }));
    }
  }, [testingKeys, setApiKeys]);

  // Group keys by service
  const getKeysByService = useCallback(() => {
    const grouped: Record<string, ApiKeyWithState[]> = {};
    
    apiKeys.forEach(key => {
      const service = key.service.toLowerCase();
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push({
        ...key,
        isVisible: isKeyVisible(key.id)
      });
    });
    
    return grouped;
  }, [apiKeys, isKeyVisible]);

  return {
    // Data
    apiKeys,
    loading,
    error,
    
    // Actions
    refreshApiKeys,
    handleCopy,
    handleDeleteKey,
    handleTestKey,
    toggleKeyVisibility,
    
    // State indicators
    isCopied,
    isKeyVisible,
    isKeyTesting: (keyId: string) => !!testingKeys[keyId],
    
    // Formatting
    formatDate,
    formatKeyDisplay,
    
    // Derived data
    getKeysByService
  };
}
