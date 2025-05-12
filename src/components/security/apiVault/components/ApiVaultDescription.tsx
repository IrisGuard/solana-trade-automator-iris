
import React from "react";
import { CardDescription } from "@/components/ui/card";
import { ApiVaultActions } from "./ApiVaultActions";
import { AlertCircle } from "lucide-react";

interface ApiVaultDescriptionProps {
  isLocked: boolean;
  apiKeys: any[];
  isRecovering: boolean;
  isTestingKeys: boolean;
  handleRecoverClick: () => void;
}

export const ApiVaultDescription: React.FC<ApiVaultDescriptionProps> = ({
  isLocked,
  apiKeys,
  isRecovering,
  isTestingKeys,
  handleRecoverClick
}) => {
  return (
    <CardDescription className="flex justify-between items-center flex-wrap gap-2">
      <span>Διαχειριστείτε τα κλειδιά API σας με ασφάλεια</span>
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
            <AlertCircle className="h-3 w-3 text-amber-500" />
          </Button>
        )}
      </div>
    </CardDescription>
  );
};

import { Button } from "@/components/ui/button";
import { Database, AlertCircle } from "lucide-react";
