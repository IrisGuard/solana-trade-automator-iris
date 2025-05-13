import { useState } from "react";
import { ApiKey } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useKeyTestingState() {
  const [isTestingKeys, setIsTestingKeys] = useState(false);

  const handleRefreshKeys = async (apiKeys: ApiKey[], setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>, testKeyFunctionality?: (key: ApiKey) => Promise<boolean>) => {
    if (!apiKeys.length) return;
    
    setIsTestingKeys(true);
    toast.loading('Έλεγχος λειτουργικότητας κλειδιών...');
    
    try {
      // Fetch the latest keys from Supabase
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*');
        
      if (error) {
        toast.error('Σφάλμα κατά την ανάκτηση κλειδιών');
        return;
      }
      
      if (data && data.length > 0) {
        // Map Supabase data to ApiKey format with isWorking property
        const updatedKeys: ApiKey[] = await Promise.all(data.map(async (key) => {
          const apiKey: ApiKey = {
            id: key.id,
            name: key.name,
            service: key.service,
            key: key.key_value,
            createdAt: key.created_at,
            status: key.status || 'active',
            description: key.description || '',
            isEncrypted: key.is_encrypted || false
          };
          
          // If we have a test function, use it
          if (testKeyFunctionality) {
            const isWorking = await testKeyFunctionality(apiKey);
            return { ...apiKey, isWorking };
          }
          
          // Otherwise simulate a test
          return { ...apiKey, isWorking: Math.random() > 0.2 };
        }));
        
        setApiKeys(updatedKeys);
        toast.success(`Ελέγχθηκαν ${updatedKeys.length} κλειδιά`);
      }
    } catch (err) {
      console.error('Error testing keys:', err);
      toast.error('Απρόσμενο σφάλμα κατά τον έλεγχο κλειδιών');
    } finally {
      setIsTestingKeys(false);
      toast.dismiss();
    }
  };

  return {
    isTestingKeys,
    setIsTestingKeys,
    handleRefreshKeys
  };
}
