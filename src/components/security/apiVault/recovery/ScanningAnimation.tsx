
import React from "react";
import { Loader2 } from "lucide-react";

interface ScanningAnimationProps {
  message?: string;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ 
  message = "Σάρωση για αποθηκευμένα κλειδιά API..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <p className="text-center text-lg font-medium">{message}</p>
      <p className="text-center text-sm text-muted-foreground">
        Αυτό μπορεί να διαρκέσει μερικά δευτερόλεπτα
      </p>
    </div>
  );
};
