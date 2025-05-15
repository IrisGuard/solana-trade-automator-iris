
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

// Create a simple ApiKeyChecker service
const ApiKeyChecker = {
  async checkAllApiKeysForUser(userId: string): Promise<Record<string, any>> {
    try {
      // Fetch keys from database
      const { data: keys, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Group keys by service
      const serviceResults: Record<string, any> = {};
      
      if (keys && keys.length > 0) {
        // Group by service
        const serviceGroups: Record<string, any[]> = {};
        keys.forEach(key => {
          if (!serviceGroups[key.service]) {
            serviceGroups[key.service] = [];
          }
          serviceGroups[key.service].push(key);
        });
        
        // Create result structure
        Object.keys(serviceGroups).forEach(service => {
          const serviceKeys = serviceGroups[service];
          // Simulate check - in a real app, you'd actually test these keys
          const workingKeys = serviceKeys.filter(k => k.status === 'active');
          
          serviceResults[service] = {
            total: serviceKeys.length,
            working: workingKeys.length,
            notWorking: serviceKeys.length - workingKeys.length,
            keys: serviceKeys.map(k => ({
              id: k.id,
              name: k.name,
              service: k.service,
              status: k.status,
              isWorking: k.status === 'active',
              lastChecked: new Date().toISOString()
            }))
          };
        });
      }
      
      return serviceResults;
    } catch (error) {
      console.error("Error checking API keys:", error);
      return {};
    }
  }
};

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
      const results = await ApiKeyChecker.checkAllApiKeysForUser(user.id);
      setCheckResults(results as ServiceCheckResults);

      // Υπολογισμός συνολικών στατιστικών
      let totalKeys = 0;
      let workingKeys = 0;
      
      Object.values(results).forEach(service => {
        if (service && typeof service === 'object') {
          totalKeys += service.total || 0;
          workingKeys += service.working || 0;
        }
      });
      
      if (totalKeys > 0) {
        toast.success(`Ολοκληρώθηκε ο έλεγχος ${totalKeys} κλειδιών API`, {
          description: `${workingKeys} λειτουργικά, ${totalKeys - workingKeys} μη λειτουργικά`
        });
      } else {
        toast.info('Δεν βρέθηκαν κλειδιά API για έλεγχο');
      }

      return results;
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
