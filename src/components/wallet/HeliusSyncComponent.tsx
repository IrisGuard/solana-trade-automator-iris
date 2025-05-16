
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export function HeliusSyncComponent({ onSync }: { onSync?: () => void }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);

  const handleSync = async () => {
    // Use a default value if user is not authenticated
    const userId = user?.id || uuidv4();
    
    setIsSyncing(true);
    setHasError(false);
    try {
      console.log("Έναρξη συγχρονισμού Helius για χρήστη:", userId);
      const result = await syncAllHeliusData(userId);
      if (result) {
        setHasError(false);
        setRetryCount(0);
        console.log("Συγχρονισμός Helius ολοκληρώθηκε επιτυχώς");
        toast.success("Συγχρονισμός Helius ολοκληρώθηκε επιτυχώς");
      } else {
        setHasError(true);
        setRetryCount(prev => prev + 1);
        console.error("Συγχρονισμός Helius απέτυχε");
        toast.error("Συγχρονισμός Helius απέτυχε");
      }
      if (onSync) {
        onSync();
      }
    } catch (error) {
      console.error("Σφάλμα συγχρονισμού Helius:", error);
      setHasError(true);
      setRetryCount(prev => prev + 1);
      toast.error("Σφάλμα συγχρονισμού Helius", {
        description: "Παρακαλώ προσπαθήστε ξανά αργότερα"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Προσπάθεια αυτόματου συγχρονισμού κατά την εκκίνηση του component
  useEffect(() => {
    let mounted = true;
    
    const autoSync = async () => {
      // Use a valid UUID even if user is not available
      if ((hasError || retryCount === 0) && mounted) {
        console.log("Αυτόματος συγχρονισμός Helius...");
        await handleSync();
      }
    };
    
    // Add a small delay to ensure component is fully mounted
    const timeoutId = setTimeout(() => {
      autoSync();
    }, 1000);
    
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [hasError, retryCount]);

  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Σφάλμα σύνδεσης με το Helius API. </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2 ml-2"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Συγχρονισμός
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className="gap-2"
    >
      {isSyncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      Συγχρονισμός Helius
    </Button>
  );
}
