
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyVaultStateProps {
  onAddKeyClick: () => void;
  onRecoverClick?: () => void;
}

export const EmptyVaultState: React.FC<EmptyVaultStateProps> = ({ 
  onAddKeyClick,
  onRecoverClick 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <Plus className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Η κλειδοθήκη API είναι άδεια</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Δεν έχετε αποθηκευμένα κλειδιά API. Προσθέστε το πρώτο σας κλειδί για να ξεκινήσετε 
        ή ανακτήστε κλειδιά από προηγούμενες αποθηκεύσεις.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onAddKeyClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Προσθήκη Κλειδιού
        </Button>
        
        {onRecoverClick && (
          <Button variant="outline" onClick={onRecoverClick} className="gap-2">
            <Search className="h-4 w-4" />
            Ανάκτηση Κλειδιών
          </Button>
        )}
        
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/key-recovery">
            <Download className="h-4 w-4" />
            Προχωρημένη Ανάκτηση
          </Link>
        </Button>
      </div>
    </div>
  );
};
