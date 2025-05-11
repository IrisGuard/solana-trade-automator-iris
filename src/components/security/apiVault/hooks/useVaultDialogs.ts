
import { useState } from "react";

export function useVaultDialogs() {
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  return {
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog
  };
}
