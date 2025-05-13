
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ApiKey } from "../types";

interface ApiVaultDescriptionProps {
  isLocked: boolean;
  apiKeys: ApiKey[];
  isRecovering?: boolean;
  isTestingKeys?: boolean;
  handleRecoverClick?: () => void;
}

export const ApiVaultDescription: React.FC<ApiVaultDescriptionProps> = ({
  isLocked,
  apiKeys,
  isRecovering = false,
  isTestingKeys = false,
  handleRecoverClick
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">
        {isLocked
          ? "Η κλειδοθήκη API είναι κλειδωμένη. Ξεκλειδώστε την για να διαχειριστείτε τα κλειδιά σας με ασφάλεια."
          : apiKeys.length > 0
          ? `Διαχειριστείτε με ασφάλεια τα ${apiKeys.length} κλειδιά API σας σε μία τοποθεσία.`
          : "Προσθέστε κλειδιά API για να τα διαχειριστείτε με ασφάλεια σε μία τοποθεσία."}
      </p>
      
      {handleRecoverClick && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRecoverClick}
            disabled={isRecovering || isTestingKeys}
            className="text-foreground hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
            {isRecovering ? 'Σάρωση...' : 'Ανάκτηση Κλειδιών'}
          </Button>
        </div>
      )}
    </div>
  );
};
