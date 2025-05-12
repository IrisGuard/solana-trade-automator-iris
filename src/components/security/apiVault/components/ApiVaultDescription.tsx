
import React from "react";
import { ApiVaultActions } from "./ApiVaultActions";

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
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">
        {isLocked
          ? "Η κλειδοθήκη API είναι κλειδωμένη. Ξεκλειδώστε την για να διαχειριστείτε τα κλειδιά σας με ασφάλεια."
          : apiKeys.length > 0
          ? `Διαχειριστείτε με ασφάλεια τα ${apiKeys.length} κλειδιά API σας σε μία τοποθεσία.`
          : "Προσθέστε κλειδιά API για να τα διαχειριστείτε με ασφάλεια σε μία τοποθεσία."}
      </p>
      
      <ApiVaultActions
        isLocked={isLocked}
        apiKeys={apiKeys}
        isRecovering={isRecovering}
        isTestingKeys={isTestingKeys}
        handleRecoverClick={handleRecoverClick}
      />
    </div>
  );
};
