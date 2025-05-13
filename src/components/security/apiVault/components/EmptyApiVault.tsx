
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Plus, Upload, Database } from "lucide-react";
import { injectDemoKeys } from "../utils";

interface EmptyApiVaultProps {
  onAddKeyClick: () => void;
  onImportClick?: () => void;
}

export const EmptyApiVault: React.FC<EmptyApiVaultProps> = ({ 
  onAddKeyClick,
  onImportClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <div className="p-4 bg-muted rounded-full">
        <Key className="h-12 w-12 text-muted-foreground opacity-70" />
      </div>
      <h3 className="text-xl font-medium">Δεν υπάρχουν κλειδιά API</h3>
      <p className="text-muted-foreground max-w-md">
        Προσθέστε τα κλειδιά API σας για πιο εύκολη διαχείριση και ασφαλή αποθήκευση.
        Όλα τα κλειδιά αποθηκεύονται τοπικά και κρυπτογραφημένα.
      </p>
      <div className="flex gap-3 mt-2">
        <Button onClick={onAddKeyClick} className="gap-1">
          <Plus className="h-4 w-4" />
          Προσθήκη κλειδιού
        </Button>
        
        {onImportClick && (
          <Button variant="outline" onClick={onImportClick} className="gap-1">
            <Upload className="h-4 w-4" />
            Εισαγωγή κλειδιών
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={() => injectDemoKeys(0)}
          className="gap-1"
        >
          <Database className="h-4 w-4" />
          Επαναφορά κλειδιών
        </Button>
      </div>
    </div>
  );
};
