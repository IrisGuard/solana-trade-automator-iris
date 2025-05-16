
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkApiKey } from "@/services/supabase/apiKeyChecker";

// Define the service check results interface
interface ServiceCheckResults {
  [service: string]: {
    total: number;
    working: number;
    notWorking: number;
    keys?: Array<{
      id: string;
      name: string;
      service: string;
      status: string;
      isWorking: boolean;
      lastChecked: string;
    }>;
  };
}

export function useApiKeyCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<ServiceCheckResults | null>(null);
  const { user } = useAuth();

  /**
   * Εκκίνηση του ελέγχου όλων των κλειδιών API
   */
  const checkAllApiKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να ελέγξετε τα κλειδιά API");
      return;
    }

    setIsChecking(true);
    toast.loading('Έλεγχος κλειδιών API...');

    try {
      // Fetch keys from database
      const { data: keys, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (!keys || keys.length === 0) {
        toast.info('Δεν βρέθηκαν κλειδιά API για έλεγχο');
        setIsChecking(false);
        return null;
      }

      // Group keys by service
      const serviceGroups: Record<string, any[]> = {};
      keys.forEach(key => {
        if (!serviceGroups[key.service]) {
          serviceGroups[key.service] = [];
        }
        serviceGroups[key.service].push(key);
      });
      
      // Create result structure and check keys
      const serviceResults: ServiceCheckResults = {};
      
      for (const [service, serviceKeys] of Object.entries(serviceGroups)) {
        serviceResults[service] = {
          total: serviceKeys.length,
          working: 0,
          notWorking: 0,
          keys: []
        };
        
        // Check each key
        for (const key of serviceKeys) {
          const isWorking = await checkApiKey(service, key.key_value);
          
          if (isWorking) {
            serviceResults[service].working++;
          } else {
            serviceResults[service].notWorking++;
            
            // Update status in database if key is not working
            await supabase
              .from('api_keys_storage')
              .update({ status: 'failing' })
              .eq('id', key.id);
          }
          
          serviceResults[service].keys!.push({
            id: key.id,
            name: key.name,
            service: key.service,
            status: isWorking ? 'active' : 'failing',
            isWorking,
            lastChecked: new Date().toISOString()
          });
        }
      }
      
      setCheckResults(serviceResults);
      
      // Calculate overall statistics
      let totalKeys = 0;
      let workingKeys = 0;
      
      Object.values(serviceResults).forEach(service => {
        totalKeys += service.total;
        workingKeys += service.working;
      });
      
      toast.success(`Ολοκληρώθηκε ο έλεγχος ${totalKeys} κλειδιών API`, {
        description: `${workingKeys} λειτουργικά, ${totalKeys - workingKeys} μη λειτουργικά`
      });

      return serviceResults;
    } catch (error) {
      console.error('Σφάλμα κατά τον έλεγχο των κλειδιών API:', error);
      toast.error('Σφάλμα κατά τον έλεγχο των κλειδιών API');
      return null;
    } finally {
      setIsChecking(false);
      toast.dismiss();
    }
  };

  return {
    isChecking,
    checkResults,
    checkAllApiKeys
  };
}
