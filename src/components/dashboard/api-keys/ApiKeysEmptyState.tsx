
import React from 'react';
import { Button } from "@/components/ui/button";
import { KeyRound, Plus } from "lucide-react";

interface ApiKeysEmptyStateProps {
  onAddKey: () => void;
}

export function ApiKeysEmptyState({ onAddKey }: ApiKeysEmptyStateProps) {
  return (
    <div className="text-center py-6 border rounded-md flex flex-col items-center justify-center">
      <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-muted-foreground mb-4">Δεν υπάρχουν αποθηκευμένα κλειδιά API</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddKey}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        Προσθήκη κλειδιού API
      </Button>
    </div>
  );
}
