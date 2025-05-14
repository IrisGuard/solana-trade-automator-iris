
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Plus } from "lucide-react";

interface ApiKeysEmptyStateProps {
  onAddKey: () => void;
}

export function ApiKeysEmptyState({ onAddKey }: ApiKeysEmptyStateProps) {
  return (
    <div className="text-center py-6">
      <Key className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium mb-1">Δεν υπάρχουν API κλειδιά</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Προσθέστε API κλειδιά για να συνδεθείτε με εξωτερικές υπηρεσίες
      </p>
      <Button onClick={onAddKey}>
        <Plus className="h-4 w-4 mr-2" />
        Προσθήκη κλειδιού
      </Button>
    </div>
  );
}
