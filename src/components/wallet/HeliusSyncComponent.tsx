
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
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
      const result = await syncAllHeliusData(user.id);
      if (result) {
        toast.success("Συγχρονισμός κλειδιών Helius ολοκληρώθηκε");
        setHasError(false);
        setRetryCount(0);
        console.log("Συγχρονισμός Helius ολοκληρώθηκε επιτυχώς");
      } else {
        setHasError(true);
        setRetryCount(prev => prev + 1);
        toast.error("Ο συγχρονισμός Helius απέτυχε", {
          description: "Βεβαιωθείτε ότι έχετε προσθέσει κλειδιά Helius"
        });
        console.error("Συγχρονισμός Helius απέτυχε");
      }
      if (onSync) {
        onSync();
      }
    } catch (error) {
      console.error("Σφάλμα συγχρονισμού Helius:", error);
      setHasError(true);
      setRetryCount(prev => prev + 1);
      toast.error("Σφάλμα κατά το συγχρονισμό", {
        description: "Παρακαλώ δοκιμάστε ξανά αργότερα"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Προσπάθεια αυτόματου συγχρονισμού κατά την εκκίνηση του component
  useEffect(() => {
    const autoSync = async () => {
      if (user && (hasError || retryCount === 0)) {
        console.log("Αυτόματος συγχρονισμός Helius...");
        await handleSync();
      }
    };
    autoSync();
  }, [user, hasError]);

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
      disabled={isSyncing || !user}
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
