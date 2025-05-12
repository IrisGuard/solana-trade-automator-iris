
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";

interface EmptyVaultStateProps {
  onAddKeyClick: () => void;
  onRecoverClick?: () => void;
}

export const EmptyVaultState: React.FC<EmptyVaultStateProps> = ({ 
  onAddKeyClick,
  onRecoverClick
}) => {
  return (
    <div className="text-center py-10">
      <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Η κλειδοθήκη σας είναι άδεια</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Η κλειδοθήκη API σας επιτρέπει να αποθηκεύετε με ασφάλεια κλειδιά API, διαπιστευτήρια και μυστικά.
      </p>
      <div className="space-y-3">
        <Button onClick={onAddKeyClick} className="gap-1">
          <Plus className="h-4 w-4" />
          Προσθήκη κλειδιού
        </Button>
        
        {onRecoverClick && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-1">ή</p>
            <Button 
              variant="outline" 
              onClick={onRecoverClick}
              className="gap-1"
            >
              <Database className="h-4 w-4" />
              Ανάκτηση κλειδιών από προηγούμενες αποθηκεύσεις
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
