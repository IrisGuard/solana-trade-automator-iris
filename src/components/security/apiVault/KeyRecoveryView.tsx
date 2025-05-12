
import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiVault } from "./hooks/useApiVault";
import { RecoveryStatus } from "./recovery/RecoveryStatus";
import { RecoveryLocations } from "./recovery/RecoveryLocations";
import { RecoveredKeysList } from "./recovery/RecoveredKeysList";
import { NoKeysFound } from "./recovery/NoKeysFound";
import { ScanningAnimation } from "./recovery/ScanningAnimation";
import { Button } from "@/components/ui/button";
import { injectDemoKeys } from "./utils/diagnosticUtils";
import { toast } from "sonner";
import { AlertCircle, Database, Download, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const [isAddingDemoKeys, setIsAddingDemoKeys] = useState<boolean>(false);

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

  const handleAddDemoKeys = () => {
    setIsAddingDemoKeys(true);
    try {
      injectDemoKeys(30);
      toast.success("Προστέθηκαν 30 δοκιμαστικά κλειδιά");
    } catch (error) {
      console.error("Error adding demo keys:", error);
      toast.error("Σφάλμα κατά την προσθήκη δοκιμαστικών κλειδιών");
    } finally {
      setTimeout(() => setIsAddingDemoKeys(false), 1000);
    }
  };

  const handleExportKeys = () => {
    if (recoveredKeys.length === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εξαγωγή");
      return;
    }

    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recoveredKeys, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "recovered_api_keys.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("Τα κλειδιά εξήχθησαν επιτυχώς");
    } catch (error) {
      console.error("Error exporting keys:", error);
      toast.error("Σφάλμα κατά την εξαγωγή των κλειδιών");
    }
  };

  // Show loading state while recovering
  if (isRecovering) {
    return <ScanningAnimation />;
  }

  // Show keys or fallback content based on recovery results
  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={handleAddDemoKeys}
          disabled={isAddingDemoKeys}
        >
          <Plus className="h-4 w-4" />
          {isAddingDemoKeys ? "Προσθήκη..." : "Προσθήκη 30 Κλειδιών"}
        </Button>
        
        {recoveredKeys.length > 0 && (
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleExportKeys}
          >
            <Download className="h-4 w-4" />
            Εξαγωγή Κλειδιών
          </Button>
        )}
        
        <Button 
          variant="default" 
          className="gap-2" 
          onClick={handleRecoverClick}
          disabled={isRecovering}
        >
          <Database className="h-4 w-4" />
          Ανάκτηση Κλειδιών
        </Button>
      </div>

      {/* If no keys found yet, show the empty state */}
      {recoveredKeys.length === 0 && !isRecovering ? (
        <div className="space-y-4">
          <NoKeysFound 
            onForceScan={handleForceScanClick} 
            onAddDemoKeys={handleAddDemoKeys}
            isLoading={forceScanStarted}
          />
          
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Συμβουλές για αποτελεσματική ανάκτηση</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Η βαθιά σάρωση εξετάζει όλα τα δεδομένα του περιηγητή</li>
                    <li>Δοκιμάστε να επισκεφθείτε ιστοσελίδες όπου έχετε χρησιμοποιήσει API κλειδιά πριν την σάρωση</li>
                    <li>Αν έχετε χρησιμοποιήσει εφαρμογές όπως το rork.app, θα γίνει προσπάθεια ανάκτησης κλειδιών από αυτές</li>
                    <li>Τα ανακτημένα κλειδιά αποθηκεύονται μόνο τοπικά στη συσκευή σας</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="status">Κατάσταση</TabsTrigger>
            <TabsTrigger value="keys">Κλειδιά <Badge className="ml-1" variant="secondary">{recoveredKeys.length}</Badge></TabsTrigger>
            <TabsTrigger value="sources">Πηγές <Badge className="ml-1" variant="secondary">{recoveryLocations.length}</Badge></TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-6">
            <RecoveryStatus 
              isRecovering={isRecovering}
              recoverySuccess={recoverySuccess}
              recoveryError={recoveryError}
              recoveredCount={recoveredKeys.length}
              onRecoverClick={handleRecoverClick}
              onAddDemoKeys={handleAddDemoKeys}
            />
            
            {recoveredKeys.length > 0 && (
              <RecoveredKeysList keys={recoveredKeys.slice(0, 3)} />
            )}
            
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleForceScanClick} 
                disabled={forceScanStarted}
              >
                <Search className="h-4 w-4" />
                {forceScanStarted ? "Σάρωση..." : "Βαθιά Σάρωση"}
              </Button>
            </div>
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
