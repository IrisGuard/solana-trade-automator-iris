
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Database, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoKeysFoundProps {
  onForceScan: () => void;
  onAddDemoKeys?: () => void;
  isLoading: boolean;
}

export const NoKeysFound: React.FC<NoKeysFoundProps> = ({ onForceScan, onAddDemoKeys, isLoading }) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Δεν βρέθηκαν κλειδιά API</h3>
        <p className="text-muted-foreground">
          Δεν εντοπίστηκαν αποθηκευμένα κλειδιά API στο πρόγραμμα περιήγησης.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        <Button 
          onClick={onForceScan} 
          disabled={isLoading}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          {isLoading ? "Σάρωση..." : "Βαθιά Σάρωση Αποθήκευσης"}
        </Button>
        
        {onAddDemoKeys && (
          <Button 
            variant="outline"
            onClick={onAddDemoKeys}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Επαναφορά Κλειδιών
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Η βαθιά σάρωση θα αναζητήσει κλειδιά API σε όλα τα δεδομένα που είναι αποθηκευμένα στο πρόγραμμα περιήγησης.
      </p>
    </Card>
  );
};
