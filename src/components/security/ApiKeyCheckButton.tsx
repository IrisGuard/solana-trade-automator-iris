import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Check, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { heliusService } from "@/services/helius/HeliusService";

// Define a type for the check results stats
interface CheckResultsStats {
  total: number;
  working: number;
  notWorking: number;
}

// Define a type for the service results
interface ServiceResults {
  [key: string]: {
    total: number;
    working: number;
    notWorking: number;
  }
}

export function ApiKeyCheckButton() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<ServiceResults | null>(null);
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
      const results: ServiceResults = {};
      
      for (const [service, keys] of Object.entries(keysByService)) {
        results[service] = { total: keys.length, working: 0, notWorking: 0 };
        
        for (const key of keys) {
          let isWorking = false;
          
          if (service === 'helius') {
            // Use the checkApiKey method we added to HeliusService
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
      
      toast.success(`Έλεγχος ολοκληρώθηκε: ${workingKeys}/${totalKeys} κλειδιά λειτουργούν`);
      
    } catch (error) {
      console.error("Error checking API keys:", error);
      toast.error("Σφάλμα κατά τον έλεγχο των κλειδιών API");
    } finally {
      setIsChecking(false);
    }
  };

  // Υπολογισμός στατιστικών αν υπάρχουν αποτελέσματα
  const stats = checkResults ? Object.values(checkResults).reduce(
    (acc: CheckResultsStats, service) => {
      acc.total += service.total;
      acc.working += service.working;
      acc.notWorking += service.notWorking;
      return acc;
    },
    { total: 0, working: 0, notWorking: 0 }
  ) : null;

  return (
    <Button
      onClick={checkAllApiKeys}
      disabled={isChecking || !user}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isChecking ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : stats ? (
        stats.notWorking > 0 ? (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      
      {isChecking ? "Έλεγχος..." : "Έλεγχος κλειδιών API"}
      
      {stats && !isChecking && (
        <span className="ml-1 text-xs">
          ({stats.working}/{stats.total})
        </span>
      )}
    </Button>
  );
}
