
import { useState, useEffect } from "react";
import { ApiKey } from "../types";
import { recoverAllApiKeys } from "../utils";

export function useVaultState() {
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("keys");
  const [isRecovering, setIsRecovering] = useState(false);
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [recoveryLocations, setRecoveryLocations] = useState<{ storageKey: string; count: number }[]>([]);
  
  // Attempt automatic recovery when the component mounts and no keys are found
  useEffect(() => {
    // This is now moved to useVaultRecovery
  }, []);
  
  return {
    dialogState: {
      showDialogApiKey,
      setShowDialogApiKey,
      showImportDialog,
      setShowImportDialog,
      showExportSheet,
      setShowExportSheet,
      showSettingsDialog,
      setShowSettingsDialog,
      showRecoveryDialog,
      setShowRecoveryDialog,
    },
    tabState: {
      activeTab,
      setActiveTab,
    },
    recoveryState: {
      isRecovering,
      setIsRecovering,
      recoveredKeys,
      setRecoveredKeys,
      recoveryLocations,
      setRecoveryLocations,
      isTestingKeys,
      setIsTestingKeys,
    },
  };
}
