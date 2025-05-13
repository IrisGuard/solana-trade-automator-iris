
import React from "react";
import { ApiVaultCard } from "@/components/security/apiVault/ApiVaultCard";
import { ApiEndpointsCard } from "@/components/security/ApiEndpointsCard";
import { ApiEndpointsManager } from "@/components/security/ApiEndpointsManager";

export default function ApiVault() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Κλειδοθήκη API</h2>
        <p className="text-muted-foreground">
          Διαχείριση των κλειδιών API και των συνδέσεων σας με ασφάλεια
        </p>
      </div>
      
      <div className="space-y-6">
        <ApiVaultCard />
        <ApiEndpointsManager />
        <ApiEndpointsCard />
      </div>
    </div>
  );
}
