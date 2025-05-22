
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { resetHeliusKeys } from "@/utils/resetHeliusKeys";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export function HeliusResetButton() {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();

  const handleReset = async () => {
    if (!user) {
      return;
    }
    
    setIsResetting(true);
    try {
      await resetHeliusKeys(user.id, "ddb32813-1f4b-459d-8964-310b1b73a053");
    } catch (error) {
      console.error("Σφάλμα επαναφοράς κλειδιών Helius:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleReset}
      disabled={isResetting || !user}
      className="gap-2"
    >
      {isResetting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      Επαναφορά Κλειδιών Helius
    </Button>
  );
}
