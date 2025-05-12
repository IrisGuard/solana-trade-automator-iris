
import React from "react";
import { Button } from "@/components/ui/button";

interface VaultActionsProps {
  isUnlocked: boolean;
  handleLockVault: () => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
  handleUnlockVault: () => void;
}

export function VaultActions({ isUnlocked, handleLockVault, handleExportKeys, handleImportKeys, handleUnlockVault }: VaultActionsProps) {
  if (!isUnlocked) {
    return (
      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" onClick={handleUnlockVault}>
          Unlock Vault
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Stored API Keys</h3>
        <Button variant="outline" size="sm" onClick={handleLockVault}>
          Lock Vault
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={handleExportKeys}>
          Export Keys
        </Button>
        <Button variant="outline" size="sm" onClick={handleImportKeys}>
          Import Keys
        </Button>
      </div>
    </>
  );
}
