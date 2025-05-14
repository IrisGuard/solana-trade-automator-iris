
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
        variant: "destructive",
        title: "Σφάλμα",
        description: "Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά Helius"
      });
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncAllHeliusData(user.id);
      
      if (result) {
        toast({
          title: "Επιτυχία",
          description: "Τα κλειδιά και endpoints Helius συγχρονίστηκαν επιτυχώς"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Προειδοποίηση",
          description: "Υπήρξε πρόβλημα κατά τον συγχρονισμό των κλειδιών Helius"
        });
      }
    } catch (error) {
      console.error("Error syncing Helius keys:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius"
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
