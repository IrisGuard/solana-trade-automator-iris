
import React from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";

interface ApiVaultActionsProps {
  isLocked: boolean;
  apiKeys: any[];
  isRecovering: boolean;
  isTestingKeys: boolean;
  handleRecoverClick: () => void;
}

export const ApiVaultActions: React.FC<ApiVaultActionsProps> = ({
  isLocked,
  apiKeys,
  isRecovering,
  isTestingKeys,
  handleRecoverClick
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {!isLocked && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRecoverClick}
          disabled={isRecovering}
          className="flex items-center gap-1"
        >
          <Database className={`h-4 w-4 ${isRecovering ? 'animate-pulse' : ''}`} />
          <span>Ανάκτηση κλειδιών</span>
        </Button>
      )}
    </div>
  );
};
