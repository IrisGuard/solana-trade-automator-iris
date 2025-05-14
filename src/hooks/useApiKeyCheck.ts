
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { ApiKeyChecker } from "@/services/supabase/apiKeyChecker";
import { toast } from "sonner";

export function useApiKeyCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<any>(null);
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
      const results = await ApiKeyChecker.checkAllKeys(user.id);
      setCheckResults(results);

      // Υπολογισμός συνολικών στατιστικών
      let totalKeys = 0;
      let workingKeys = 0;
      
      Object.values(results).forEach(service => {
        totalKeys += service.total;
        workingKeys += service.working;
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
