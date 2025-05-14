
import { useState } from 'react';
import { toast } from 'sonner';
import { ApiKeyChecker, ServiceCheckResults } from '@/services/supabase/apiKeyChecker';
import { useAuth } from '@/providers/SupabaseAuthProvider';

export function useApiKeyCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<ServiceCheckResults | null>(null);
  const { user } = useAuth();

  const checkAllApiKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να ελέγξετε τα κλειδιά API");
      return;
    }

    setIsChecking(true);
    
    try {
      const results = await ApiKeyChecker.checkAllKeys(user.id);
      
      setCheckResults(results);
      
      // Calculate statistics
      let totalKeys = 0;
      let workingKeys = 0;
      
      Object.values(results).forEach(service => {
        totalKeys += service.total;
        workingKeys += service.working;
      });
      
      // Show toast with results
      if (totalKeys > 0) {
        if (workingKeys === totalKeys) {
          toast.success(`Όλα τα κλειδιά API λειτουργούν κανονικά (${workingKeys}/${totalKeys})`);
        } else {
          toast.warning(`Βρέθηκαν προβληματικά κλειδιά API (${workingKeys}/${totalKeys} λειτουργούν)`);
        }
      } else {
        toast.info("Δεν βρέθηκαν κλειδιά API για έλεγχο");
      }
      
    } catch (error) {
      console.error('Error checking API keys:', error);
      toast.error('Σφάλμα κατά τον έλεγχο των κλειδιών API');
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
