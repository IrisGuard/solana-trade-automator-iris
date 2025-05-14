
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { Loader2, Database } from "lucide-react";

export function HeliusSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const handleSync = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά Helius");
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await syncAllHeliusData(user.id);
      if (success) {
        toast.success("Όλα τα δεδομένα Helius συγχρονίστηκαν επιτυχώς!");
      }
    } catch (error) {
      console.error("Σφάλμα συγχρονισμού:", error);
      toast.error("Σφάλμα κατά τον συγχρονισμό των δεδομένων Helius");
    } finally {
      setIsSyncing(false);
    }
  };
  
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
        <Database className="h-4 w-4" />
      )}
      {isSyncing ? "Συγχρονισμός..." : "Συγχρονισμός Helius"}
    </Button>
  );
}
