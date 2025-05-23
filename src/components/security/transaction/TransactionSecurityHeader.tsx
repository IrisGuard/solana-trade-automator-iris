
import React from "react";
import { AlertTriangle } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

export function TransactionSecurityHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl text-foreground">Transaction Security</CardTitle>
      </div>
      <CardDescription className="text-muted-foreground">
        Manage your transaction security settings
      </CardDescription>
    </div>
  );
}
