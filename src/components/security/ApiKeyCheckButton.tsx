
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useApiKeyCheck } from "@/hooks/useApiKeyCheck";
import { Check, AlertCircle, RefreshCcw } from "lucide-react";

// Define a type for the check results stats
interface CheckResultsStats {
  total: number;
  working: number;
  notWorking: number;
}

export function ApiKeyCheckButton() {
  const { isChecking, checkAllApiKeys, checkResults } = useApiKeyCheck();
  const { user } = useAuth();

  const handleCheckKeys = async () => {
    if (!user) {
      toast("You must be logged in to check API keys");
      return;
    }

    await checkAllApiKeys();
  };

  // Calculate statistics if results exist
  const stats = checkResults ? Object.values(checkResults).reduce(
    (acc: CheckResultsStats, service: any) => {
      acc.total += service.total;
      acc.working += service.working;
      acc.notWorking += service.notWorking;
      return acc;
    },
    { total: 0, working: 0, notWorking: 0 }
  ) : null;

  return (
    <Button
      onClick={handleCheckKeys}
      disabled={isChecking || !user}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isChecking ? (
        <RefreshCcw className="h-4 w-4 animate-spin" />
      ) : stats ? (
        stats.notWorking > 0 ? (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
      
      {isChecking ? "Έλεγχος..." : "Έλεγχος κλειδιών API"}
      
      {stats && !isChecking && (
        <span className="ml-1 text-xs">
          ({stats.working}/{stats.total})
        </span>
      )}
    </Button>
  );
}
