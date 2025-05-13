
import { useState } from "react";

export function useRecoveryDialog() {
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  
  return {
    showRecoveryDialog,
    setShowRecoveryDialog
  };
}
