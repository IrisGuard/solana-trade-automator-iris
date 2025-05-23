
import React from "react";
import { Switch } from "@/components/ui/switch";

export function TransactionConfirmationSection() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Transaction Confirmation</h3>
        <p className="text-sm text-muted-foreground">Confirmation is required for all transactions</p>
      </div>
      <Switch defaultChecked />
    </div>
  );
}
