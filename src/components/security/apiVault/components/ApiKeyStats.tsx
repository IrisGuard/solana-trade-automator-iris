
import React, { useState } from "react";
import { ApiKeyStatsPanel } from "./ApiKeyStatsPanel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { recoverAllApiKeys, forceScanForKeys } from "../utils";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    expired: number;
    revoked: number;
    working?: number;
    notWorking?: number;
  };
  services?: {
    name: string;
    count: number;
  }[];
}

export const ApiKeyStats: React.FC<StatsProps> = ({ stats, services = [] }) => {
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Λειτουργία έκτακτης ανάκτησης κλειδιών
  const handleEmergencyRecover = async () => {
    try {
      setIsRecovering(true);
      toast.loading("Εκτελείται βαθιά σάρωση για την ανάκτηση χαμένων κλειδιών...");
      
      // Πρώτα δοκιμάζουμε την πιο προηγμένη μέθοδο ανάκτησης
      const result = await recoverAllApiKeys();
      
      if (result.recoveredKeys.length > 0) {
        // Αν βρήκαμε κλειδιά, τα αποθηκεύουμε στο localStorage
        localStorage.setItem('apiKeys', JSON.stringify(result.recoveredKeys));
        toast.success(`Ανακτήθηκαν ${result.recoveredKeys.length} κλειδιά! Κάντε επαναφόρτωση της σελίδας για να τα δείτε.`);
      } else {
        // Αν δεν βρήκαμε κλειδιά, δοκιμάζουμε μια πιο επιθετική μέθοδο
        const numFound = await forceScanForKeys();
        
        if (numFound > 0) {
          toast.success(`Ανακτήθηκαν ${numFound} κλειδιά με τη βαθιά σάρωση! Κάντε επαναφόρτωση της σελίδας.`);
        } else {
          toast.error("Δεν βρέθηκαν κλειδιά σε καμία τοποθεσία αποθήκευσης.");
          
          // Δοκιμαστικά κλειδιά σε περίπτωση που τίποτα άλλο δε λειτουργεί
          if (confirm("Να προστεθούν 20 δοκιμαστικά κλειδιά για επίδειξη;")) {
            // Εισαγωγή δοκιμαστικών κλειδιών
            const { injectDemoKeys } = await import("../utils/diagnosticUtils");
            const demoKeys = injectDemoKeys(20);
            toast.success(`Προστέθηκαν ${demoKeys.length} δοκιμαστικά κλειδιά για επίδειξη.`);
          }
        }
      }
      
      // Ανανεώνουμε τη σελίδα για να φορτωθούν τα ανακτημένα κλειδιά
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Σφάλμα στην ανάκτηση:", error);
      toast.error("Προέκυψε σφάλμα κατά την ανάκτηση κλειδιών.");
    } finally {
      setIsRecovering(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-4">
      {stats.total === 0 && (
        <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900 rounded-md flex gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div className="text-sm">
            <p className="font-medium">Δεν βρέθηκαν κλειδιά API</p>
            <p className="text-muted-foreground mt-1">Τα κλειδιά σας μπορεί να έχουν χαθεί. Δοκιμάστε την έκτακτη ανάκτηση.</p>
            <Button 
              size="sm" 
              className="mt-2" 
              variant="outline"
              disabled={isRecovering}
              onClick={handleEmergencyRecover}
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Ανάκτηση...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Έκτακτη Ανάκτηση Κλειδιών
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <ApiKeyStatsPanel stats={stats} services={services} />
    </div>
  );
};
