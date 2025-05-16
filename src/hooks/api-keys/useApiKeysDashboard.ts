
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { useUser } from "@/hooks/useUser";
import { useApiKeyVisibility } from "@/hooks/api-keys/useApiKeyVisibility";

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

  const fetchApiKeys = async () => {
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
        
        return {
          ...key,
          isVisible: false,
          isWorking: validStatus === 'active',
          status: validStatus
        };
      }) || [];
      
      setApiKeys(mappedKeys);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των κλειδιών API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (keyValue: string, id: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(id);
    toast.success('Το κλειδί αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  const handleAddNewKey = () => {
    // Navigate to API vault page or open a dialog
    window.location.href = '/api-vault';
  };

  return {
    apiKeys,
    loading,
    copiedKeyId,
    visibleKeyIds,
    fetchApiKeys,
    handleCopy,
    handleAddNewKey,
    toggleKeyVisibility
  };
}
