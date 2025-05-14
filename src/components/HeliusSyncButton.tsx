
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { Server } from "lucide-react";

export function HeliusSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const handleSyncHelius = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά Helius");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncAllHeliusData(user.id);
      
      if (result) {
        toast.success("Τα κλειδιά και endpoints Helius συγχρονίστηκαν επιτυχώς");
      } else {
        toast.error("Υπήρξε πρόβλημα κατά τον συγχρονισμό των κλειδιών Helius");
      }
    } catch (error) {
      console.error("Error syncing Helius keys:", error);
      toast.error("Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSyncHelius}
      disabled={isSyncing || !user}
      variant="outline"
      size="sm"
    >
      <Server className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
      {isSyncing ? "Συγχρονισμός..." : "Συγχρονισμός Helius API"}
    </Button>
  );
}
