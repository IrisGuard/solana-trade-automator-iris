
import React from "react";
import { Switch } from "@/components/ui/switch";

export function TransactionConfirmationSection() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Επιβεβαίωση Συναλλαγών</h3>
        <p className="text-sm text-muted-foreground">Απαιτείται επιβεβαίωση για όλες τις συναλλαγές</p>
      </div>
      <Switch defaultChecked />
    </div>
  );
}
