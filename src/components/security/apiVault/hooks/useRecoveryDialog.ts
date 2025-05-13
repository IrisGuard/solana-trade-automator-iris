
import { useState } from "react";
import { ApiKey } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRecoveryDialog() {
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  
  const recoverApiKeysFromSupabase = async () => {
    setIsRecovering(true);
    
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*');
        
      if (error) {
        toast.error('Σφάλμα κατά την ανάκτηση κλειδιών από Supabase');
        return [];
      }
      
      if (data && data.length > 0) {
        // Map Supabase data to ApiKey format
        const mappedKeys: ApiKey[] = data.map((key) => {
          // Ensure status is one of the allowed values
          const statusValue = key.status === 'expired' ? 'expired' : 
                            key.status === 'revoked' ? 'revoked' : 
                            'active';
                            
          return {
            id: key.id,
            name: key.name,
            service: key.service,
            key: key.key_value,
            createdAt: key.created_at,
            status: statusValue as 'active' | 'expired' | 'revoked',
            description: key.description || '',
            isEncrypted: key.is_encrypted || false
          };
        });
        
        setRecoveredKeys(mappedKeys);
        toast.success(`Ανακτήθηκαν ${mappedKeys.length} κλειδιά από Supabase`);
        return mappedKeys;
      }
      
      toast.info('Δεν βρέθηκαν αποθηκευμένα κλειδιά στο Supabase');
      return [];
    } catch (err) {
      console.error('Σφάλμα ανάκτησης από Supabase:', err);
      toast.error('Απρόσμενο σφάλμα κατά την ανάκτηση κλειδιών');
      return [];
    } finally {
      setIsRecovering(false);
    }
  };
  
  return {
    showRecoveryDialog,
    setShowRecoveryDialog,
    isRecovering,
    recoveredKeys,
    recoverApiKeysFromSupabase
  };
}
