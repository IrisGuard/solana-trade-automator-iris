
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function HeliusSyncComponent({ onSync }: { onSync?: () => void }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();

  const handleSync = async () => {
    if (!user) {
      toast.error("Πρέπει να είστε συνδεδεμένοι για να συγχρονίσετε τα δεδομένα Helius");
      return;
    }
    
    setIsSyncing(true);
    setHasError(false);
    try {
      await syncAllHeliusData(user.id);
      if (onSync) {
        onSync();
      }
      setHasError(false);
    } catch (error) {
      console.error("Error syncing Helius data:", error);
      setHasError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  // Try to auto-sync when the component mounts
  useEffect(() => {
    if (user && hasError) {
      // Auto-sync if there's an error
      handleSync();
    }
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
