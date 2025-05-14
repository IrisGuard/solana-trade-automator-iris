
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { Server } from "lucide-react";

export function HeliusSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSyncHelius = async () => {
    if (!user) {
      toast({
        description: "Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά Helius",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncAllHeliusData(user.id);
      
      if (result) {
        toast({
          description: "Τα κλειδιά και endpoints Helius συγχρονίστηκαν επιτυχώς"
        });
      } else {
        toast({
          description: "Υπήρξε πρόβλημα κατά τον συγχρονισμό των κλειδιών Helius",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing Helius keys:", error);
      toast({
        description: "Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius",
        variant: "destructive"
      });
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
