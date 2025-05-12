
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, FilePlus2, Database } from "lucide-react";

interface EmptyVaultStateProps {
  onAddKeyClick: () => void;
  onRecoverClick?: () => void;
}

export const EmptyVaultState: React.FC<EmptyVaultStateProps> = ({ 
  onAddKeyClick,
  onRecoverClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
        <ShieldAlert className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Το Vault είναι Άδειο</h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        Προσθέστε τα κλειδιά API σας για να τα αποθηκεύσετε με ασφάλεια και να έχετε εύκολη πρόσβαση σε αυτά.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onAddKeyClick} className="gap-2">
          <FilePlus2 className="w-4 h-4" />
          <span>Προσθήκη Νέου Κλειδιού</span>
        </Button>
        
        {onRecoverClick && (
          <Button onClick={onRecoverClick} variant="outline" className="gap-2">
            <Database className="w-4 h-4" />
            <span>Ανάκτηση Κλειδιών</span>
          </Button>
        )}
      </div>
    </div>
  );
};
