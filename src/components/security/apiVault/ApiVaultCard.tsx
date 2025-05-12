
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useApiVault } from "./hooks/useApiVault";
import { ApiVaultHeader } from "./ApiVaultHeader";
import { ApiVaultDescription } from "./components/ApiVaultDescription";
import { toast } from "sonner";
import { KeyRecoveryView } from "./KeyRecoveryView";

export const ApiVaultCard = () => {
  const {
    recoveredKeys,
    recoveryLocations,
    isRecovering,
    recoverySuccess,
    recoveryError,
    handleRecoverKeys,
    handleForceScan
  } = useApiVault();
  
  const [activeTab, setActiveTab] = useState<string>("recovery");

  const handleRecoverClick = () => {
    if (isRecovering) {
      toast.info("Ανάκτηση κλειδιών σε εξέλιξη, παρακαλώ περιμένετε...");
      return;
    }
    handleRecoverKeys();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ανάκτηση Κλειδιών API</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Ανακτήστε κλειδιά API από το rork.app και άλλες εφαρμογές που δεν λειτουργούν πλέον.
        </p>
      </CardHeader>
      <CardContent>
        <KeyRecoveryView />
      </CardContent>
    </Card>
  );
};
