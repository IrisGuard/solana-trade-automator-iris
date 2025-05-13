
import React from "react";
import { AlertTriangle } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

export function TransactionSecurityHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl text-foreground">Ασφάλεια Συναλλαγών</CardTitle>
      </div>
      <CardDescription className="text-muted-foreground">
        Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας
      </CardDescription>
    </div>
  );
}
