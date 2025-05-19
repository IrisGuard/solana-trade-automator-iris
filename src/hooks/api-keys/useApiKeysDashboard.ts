
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { useUser } from "@/hooks/useUser";
import { useApiKeyVisibility } from "@/hooks/api-keys/useApiKeyVisibility";
import { heliusService } from '@/services/helius/HeliusService';

export function useApiKeysDashboard(limit = 4) {
  const [apiKeys, setApiKeys] = useState<ApiKeyWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const { user } = useUser();
  const { visibleKeyIds, toggleKeyVisibility } = useApiKeyVisibility();

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id)
        .limit(limit);
      
      if (error) throw error;
      
      // Ensure proper status type by mapping any string status to one of the valid statuses
      const mappedKeys: ApiKeyWithState[] = data?.map(key => {
        // Default to 'active' if status is not one of the valid options
        let validStatus: 'active' | 'expired' | 'revoked' | 'failing' = 'active';
        
        // Check if the status is one of the allowed values
        if (key.status === 'active' || key.status === 'expired' || 
            key.status === 'revoked' || key.status === 'failing') {
          validStatus = key.status as 'active' | 'expired' | 'revoked' | 'failing';
        }
        
        // Fix: Use proper type checking for visibleKeyIds based on its actual structure
        // If visibleKeyIds is an object with boolean values keyed by ID
        const isVisible = visibleKeyIds[key.id] === true;
        const isWorking = validStatus === 'active';
        
        return {
          ...key,
          isVisible,
          isWorking,
          status: validStatus,
          isTesting: false // Add the missing isTesting property
        };
      }) || [];
      
      setApiKeys(mappedKeys);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των κλειδιών API');
    } finally {
      setLoading(false);
    }
  }, [user, limit, visibleKeyIds]);

  // Test API key functionality
  const testApiKey = useCallback(async (key: ApiKeyWithState) => {
    if (key.service === 'helius') {
      // Use the checkApiKey method we added to HeliusService
      const isWorking = await heliusService.checkApiKey(key.key_value);
      
      // Update key status in database
      if (user && key.id) {
        const { error } = await supabase
          .from('api_keys_storage')
          .update({ 
            status: isWorking ? 'active' : 'failing',
            updated_at: new Date().toISOString()
          })
          .eq('id', key.id);
          
        if (error) {
          console.error('Error updating API key status:', error);
        }
      }
      
      return isWorking;
    }
    
    // Default to true for other services for now
    return true;
  }, [user]);

  const handleCopy = useCallback((keyValue: string, id: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(id);
    toast.success('Το κλειδί αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  }, []);

  const handleAddNewKey = useCallback(() => {
    window.location.href = '/api-vault';
  }, []);

  // Test all keys functionality
  const testAllKeys = useCallback(async () => {
    setLoading(true);
    
    const updatedKeys = [...apiKeys];
    const results = await Promise.all(updatedKeys.map(async (key) => {
      const isWorking = await testApiKey(key);
      return { ...key, isWorking };
    }));
    
    setApiKeys(results);
    setLoading(false);
    
    const workingCount = results.filter(key => key.isWorking).length;
    toast.success(`Έλεγχος ολοκληρώθηκε: ${workingCount}/${results.length} κλειδιά λειτουργούν`);
    
    return results;
  }, [apiKeys, testApiKey]);

  return {
    apiKeys,
    loading,
    copiedKeyId,
    visibleKeyIds,
    fetchApiKeys,
    handleCopy,
    handleAddNewKey,
    toggleKeyVisibility,
    testAllKeys
  };
}
