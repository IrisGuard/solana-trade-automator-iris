
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { toast } from 'sonner';
import { heliusService } from '@/services/helius/HeliusService';

export function useApiKeyCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<any>(null);
  const { user } = useAuth();

  const checkAllApiKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να ελέγξετε τα κλειδιά API");
      return;
    }

    setIsChecking(true);
    try {
      // Get all API keys from the database
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.info("Δεν βρέθηκαν κλειδιά API για έλεγχο");
        setIsChecking(false);
        return;
      }

      // Group keys by service
      const keysByService: Record<string, any[]> = {};
      data.forEach(key => {
        if (!keysByService[key.service]) {
          keysByService[key.service] = [];
        }
        keysByService[key.service].push(key);
      });

      // Check each service's keys
      const results: Record<string, {total: number, working: number, notWorking: number}> = {};
      
      for (const [service, keys] of Object.entries(keysByService)) {
        results[service] = { total: keys.length, working: 0, notWorking: 0 };
        
        for (const key of keys) {
          let isWorking = false;
          
          if (service === 'helius') {
            isWorking = await heliusService.checkApiKey(key.key_value);
          } else {
            // Default to true for other services until we implement specific checks
            isWorking = true;
          }
          
          // Update the key status in the database
          await supabase
            .from('api_keys_storage')
            .update({ 
              status: isWorking ? 'active' : 'failing',
              updated_at: new Date().toISOString()
            })
            .eq('id', key.id);
          
          if (isWorking) {
            results[service].working++;
          } else {
            results[service].notWorking++;
          }
        }
      }

      setCheckResults(results);
      
      // Calculate totals
      let totalKeys = 0;
      let workingKeys = 0;
      
      Object.values(results).forEach(result => {
        totalKeys += result.total;
        workingKeys += result.working;
      });
      
      toast.success(`Έλεγχος κλειδιών ολοκληρώθηκε: ${workingKeys}/${totalKeys} κλειδιά λειτουργούν`);
      
    } catch (error) {
      console.error("Error checking API keys:", error);
      toast.error("Σφάλμα κατά τον έλεγχο των κλειδιών API");
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    checkAllApiKeys,
    checkResults
  };
}
