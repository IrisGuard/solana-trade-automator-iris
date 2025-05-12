
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoKeysFoundProps {
  onForceScan: () => void;
  isLoading: boolean;
}

export const NoKeysFound: React.FC<NoKeysFoundProps> = ({ onForceScan, isLoading }) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Δεν βρέθηκαν κλειδιά API</h3>
        <p className="text-muted-foreground">
          Δεν εντοπίστηκαν αποθηκευμένα κλειδιά API στο πρόγραμμα περιήγησης.
        </p>
      </div>
      <Button 
        onClick={onForceScan} 
        disabled={isLoading}
        className="mt-2"
      >
        {isLoading ? "Σάρωση..." : "Βαθιά Σάρωση Αποθήκευσης"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Η βαθιά σάρωση θα αναζητήσει κλειδιά API σε όλα τα δεδομένα που είναι αποθηκευμένα στο πρόγραμμα περιήγησης.
      </p>
    </Card>
  );
};
