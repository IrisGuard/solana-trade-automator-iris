
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiVault } from "./hooks/useApiVault";
import { RecoveryStatus } from "./recovery/RecoveryStatus";
import { RecoveryLocations } from "./recovery/RecoveryLocations";
import { RecoveredKeysList } from "./recovery/RecoveredKeysList";
import { NoKeysFound } from "./recovery/NoKeysFound";
import { ScanningAnimation } from "./recovery/ScanningAnimation";
import { toast } from "sonner";

export const KeyRecoveryView = () => {
  const {
    recoveredKeys,
    recoveryLocations,
    isRecovering,
    recoverySuccess,
    recoveryError,
    handleRecoverKeys,
    handleForceScan
  } = useApiVault();
  
  const [activeTab, setActiveTab] = useState<string>("status");
  const [forceScanStarted, setForceScanStarted] = useState<boolean>(false);

  const handleRecoverClick = () => {
    if (isRecovering) {
      toast.info("Ανάκτηση κλειδιών σε εξέλιξη, παρακαλώ περιμένετε...");
      return;
    }
    handleRecoverKeys();
  };

  const handleForceScanClick = async () => {
    setForceScanStarted(true);
    try {
      const keysFound = await handleForceScan();
      if (keysFound > 0) {
        toast.success(`Βρέθηκαν ${keysFound} κλειδιά API και αποθηκεύτηκαν`);
        setActiveTab("keys");
      } else {
        toast.info("Δεν βρέθηκαν νέα κλειδιά API");
      }
    } catch (error) {
      console.error("Error during force scan:", error);
      toast.error("Σφάλμα κατά τη διάρκεια της σάρωσης");
    } finally {
      setForceScanStarted(false);
    }
  };

  // Show loading state while recovering
  if (isRecovering) {
    return <ScanningAnimation />;
  }

  // Show keys or fallback content based on recovery results
  return (
    <div className="space-y-6">
      {/* If no keys found yet, show the empty state */}
      {recoveredKeys.length === 0 && !isRecovering ? (
        <NoKeysFound 
          onForceScan={handleForceScanClick} 
          isLoading={forceScanStarted}
        />
      ) : (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="status">Κατάσταση</TabsTrigger>
            <TabsTrigger value="keys">Κλειδιά ({recoveredKeys.length})</TabsTrigger>
            <TabsTrigger value="sources">Πηγές ({recoveryLocations.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-6">
            <RecoveryStatus 
              isRecovering={isRecovering}
              recoverySuccess={recoverySuccess}
              recoveryError={recoveryError}
              recoveredCount={recoveredKeys.length}
              onRecoverClick={handleRecoverClick}
            />
            
            {recoveredKeys.length > 0 && (
              <RecoveredKeysList keys={recoveredKeys.slice(0, 3)} />
            )}
          </TabsContent>
          
          <TabsContent value="keys">
            <RecoveredKeysList keys={recoveredKeys} />
          </TabsContent>
          
          <TabsContent value="sources">
            <RecoveryLocations locations={recoveryLocations} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
