
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyVaultStateProps {
  onAddKeyClick: () => void;
}

export const EmptyVaultState = ({ onAddKeyClick }: EmptyVaultStateProps) => {
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground mb-2">Δεν έχετε αποθηκεύσει κανένα κλειδί API ακόμη</p>
      <Button 
        variant="outline" 
        className="mt-2"
        onClick={onAddKeyClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Προσθήκη Πρώτου Κλειδιού
      </Button>
    </div>
  );
};
