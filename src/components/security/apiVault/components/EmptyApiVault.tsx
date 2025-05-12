
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyApiVaultProps {
  onAddKeyClick: () => void;
}

export const EmptyApiVault: React.FC<EmptyApiVaultProps> = ({ onAddKeyClick }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Δεν έχουν βρεθεί αποθηκευμένα κλειδιά API
      </p>
      <Button 
        onClick={onAddKeyClick}
        className="mt-4"
        variant="outline"
      >
        Προσθήκη πρώτου κλειδιού
      </Button>
    </div>
  );
};
