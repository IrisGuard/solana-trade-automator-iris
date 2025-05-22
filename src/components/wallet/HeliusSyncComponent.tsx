
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";
import { syncAllHeliusData, testAllHeliusKeys } from "@/utils/syncHeliusKeys";
import { Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function HeliusSyncComponent({ onSync }: { onSync?: () => void }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);

  const handleSync = async () => {
    if (!user) {
      toast.error("Πρέπει να είστε συνδεδεμένοι για να συγχρονίσετε τα δεδομένα Helius");
      return;
    }
    
    setIsSyncing(true);
    setHasError(false);
    try {
      console.log("Έναρξη συγχρονισμού Helius για χρήστη:", user.id);
      
      // First test all keys to make sure we're using working ones
      const workingKeys = await testAllHeliusKeys(user.id);
      
      // Then sync the data
      const result = await syncAllHeliusData(user.id);
      
      if (result) {
        toast.success(`Συγχρονισμός κλειδιών Helius ολοκληρώθηκε (${workingKeys} ενεργά κλειδιά)`);
        setHasError(false);
        setRetryCount(0);
        console.log("Συγχρονισμός Helius ολοκληρώθηκε επιτυχώς");
      } else {
        setHasError(true);
        setRetryCount(prev => prev + 1);
        
        // Only show toast if we've tried multiple times
        if (retryCount >= 1) {
          toast.error("Ο συγχρονισμός Helius απέτυχε", {
            description: "Βεβαιωθείτε ότι έχετε προσθέσει κλειδιά Helius"
          });
        }
        console.error("Συγχρονισμός Helius απέτυχε");
      }
      
      if (onSync) {
        onSync();
      }
    } catch (error) {
      console.error("Σφάλμα συγχρονισμού Helius:", error);
      setHasError(true);
      setRetryCount(prev => prev + 1);
      
      // Only show toast if we've tried multiple times
      if (retryCount >= 1) {
        toast.error("Σφάλμα κατά το συγχρονισμό", {
          description: "Παρακαλώ δοκιμάστε ξανά αργότερα"
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Προσπάθεια αυτόματου συγχρονισμού κατά την εκκίνηση του component
  useEffect(() => {
    if (user && !isSyncing) {
      const attemptSync = async () => {
        if (hasError || retryCount === 0) {
          console.log("Αυτόματος συγχρονισμός Helius...");
          await handleSync();
        }
      };
      
      // Add a slight delay to allow other initializations to complete
      const timer = setTimeout(() => {
        attemptSync();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasError]);

  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Αδυναμία συγχρονισμού κλειδιών Helius API</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="ml-2 bg-white/10"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Επανασύνδεση
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
