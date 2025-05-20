
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { heliusService } from "@/services/helius/HeliusService";

export function HeliusSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const handleSync = async () => {
    if (!user) {
      return;
    }
    
    setIsSyncing(true);
    try {
      await syncAllHeliusData(user.id);
      // Using heliusService instead of HeliusService class
      await heliusService.getTokenBalances("demo"); // Simple operation to refresh configuration
    } catch (error) {
      console.error("Error syncing Helius data:", error);
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
        <RefreshCcw className="h-4 w-4" />
      )}
      Συγχρονισμός Helius
    </Button>
  );
}
