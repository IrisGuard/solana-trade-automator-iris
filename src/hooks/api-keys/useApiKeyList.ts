
import { useState, useEffect, useCallback } from 'react';
import { ApiKeyService } from '@/services/api-keys/apiKeyService';
import { ApiKeyEntry, ApiKeyWithState } from '@/services/api-keys/types';
import { toast } from 'sonner';

interface UseApiKeyListProps {
  userId?: string;
  includeDemoKeys?: boolean;
}

export function useApiKeyList({ 
  userId,
  includeDemoKeys = false
}: UseApiKeyListProps = {}) {
  const [keys, setKeys] = useState<ApiKeyWithState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refreshKeys = useCallback(async () => {
    if (!userId) {
      setKeys([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const fetchedKeys = await ApiKeyService.fetchUserApiKeys(userId);
      
      // Add demo keys if needed
      if (includeDemoKeys && fetchedKeys.length === 0) {
        const demoKeys: ApiKeyWithState[] = [
          {
            id: 'demo-1',
            user_id: userId,
            name: 'Demo Helius API Key',
            service: 'helius',
            key_value: 'helius-api-demo-key-123',
            status: 'active',
            created_at: new Date().toISOString(),
            description: 'Demo key for testing',
            is_encrypted: false,
            isVisible: false,
            isWorking: true,
            isTesting: false
          },
          {
            id: 'demo-2',
            user_id: userId,
            name: 'Demo Solana RPC Key',
            service: 'solana',
            key_value: 'solana-rpc-demo-key-456',
            status: 'active',
            created_at: new Date().toISOString(),
            description: 'Demo key for testing',
            is_encrypted: false,
            isVisible: false,
            isWorking: true,
            isTesting: false
          }
        ];
        setKeys([...fetchedKeys, ...demoKeys]);
      } else {
        setKeys(fetchedKeys);
      }
      
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, includeDemoKeys]);
  
  // Initial fetch
  useEffect(() => {
    refreshKeys();
  }, [refreshKeys]);
  
  const addKey = useCallback(async (key: Omit<ApiKeyEntry, 'id'>) => {
    if (!userId) {
      toast.error('Πρέπει να συνδεθείτε για να προσθέσετε κλειδιά');
      return null;
    }
    
    try {
      const newKey = await ApiKeyService.saveApiKey({ 
        ...key, 
        user_id: userId,
        id: undefined
      } as ApiKeyEntry);
      
      if (newKey) {
        toast.success('Το κλειδί προστέθηκε με επιτυχία');
        await refreshKeys();
        return newKey;
      }
      return null;
    } catch (err) {
      toast.error('Σφάλμα κατά την προσθήκη του κλειδιού');
      console.error('Error adding API key:', err);
      return null;
    }
  }, [userId, refreshKeys]);
  
  const updateKey = useCallback(async (key: ApiKeyEntry) => {
    if (!userId || !key.id) {
      toast.error('Απαιτούνται οι πληροφορίες κλειδιού και χρήστη');
      return false;
    }
    
    try {
      const updatedKey = await ApiKeyService.saveApiKey({
        ...key,
        user_id: userId
      });
      
      if (updatedKey) {
        toast.success('Το κλειδί ενημερώθηκε με επιτυχία');
        await refreshKeys();
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Σφάλμα κατά την ενημέρωση του κλειδιού');
      console.error('Error updating API key:', err);
      return false;
    }
  }, [userId, refreshKeys]);
  
  const deleteKey = useCallback(async (keyId: string) => {
    if (!userId || !keyId) {
      toast.error('Απαιτούνται οι πληροφορίες κλειδιού και χρήστη');
      return false;
    }
    
    try {
      const success = await ApiKeyService.deleteApiKey(keyId, userId);
      
      if (success) {
        toast.success('Το κλειδί διαγράφηκε με επιτυχία');
        await refreshKeys();
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Σφάλμα κατά τη διαγραφή του κλειδιού');
      console.error('Error deleting API key:', err);
      return false;
    }
  }, [userId, refreshKeys]);
  
  const testKey = useCallback(async (keyId: string, service: string, keyValue: string) => {
    try {
      setKeys(prev => prev.map(k => 
        k.id === keyId ? { ...k, isTesting: true } : k
      ));
      
      const isValid = await ApiKeyService.testApiKey(service, keyValue);
      
      // Update key status based on test result
      if (userId && keyId !== 'demo-1' && keyId !== 'demo-2') {
        await ApiKeyService.updateKeyStatus(
          keyId,
          userId,
          isValid ? 'active' : 'failing'
        );
      }
      
      setKeys(prev => prev.map(k => 
        k.id === keyId ? { 
          ...k, 
          isTesting: false,
          isWorking: isValid,
          status: isValid ? 'active' : 'failing'
        } : k
      ));
      
      if (isValid) {
        toast.success(`Το κλειδί για ${service} λειτουργεί κανονικά`);
      } else {
        toast.error(`Το κλειδί για ${service} δεν λειτουργεί σωστά`);
      }
      
      return isValid;
    } catch (err) {
      setKeys(prev => prev.map(k => 
        k.id === keyId ? { ...k, isTesting: false } : k
      ));
      toast.error(`Σφάλμα κατά τον έλεγχο του κλειδιού για ${service}`);
      console.error('Error testing API key:', err);
      return false;
    }
  }, [userId]);
  
  return {
    keys,
    loading,
    error,
    refreshKeys,
    addKey,
    updateKey,
    deleteKey,
    testKey
  };
}
