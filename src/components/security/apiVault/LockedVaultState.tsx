
import React from "react";
import { Button } from "@/components/ui/button";
import { LockIcon } from "lucide-react";

interface LockedVaultStateProps {
  onUnlockClick: () => void;
}

export const LockedVaultState = ({ onUnlockClick }: LockedVaultStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LockIcon className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-4">Η κλειδοθήκη είναι κλειδωμένη</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Εισάγετε τον κύριο κωδικό σας για να αποκτήσετε πρόσβαση στα κλειδιά σας
      </p>
      
      <Button onClick={onUnlockClick}>
        <LockIcon className="mr-2 h-4 w-4" />
        Ξεκλείδωμα Κλειδοθήκης
      </Button>
    </div>
  );
};
