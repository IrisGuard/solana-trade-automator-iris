
import React from "react";
import { Button } from "@/components/ui/button";

interface VaultActionsProps {
  handleLockVault: () => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
}

export function VaultActions({ handleLockVault, handleExportKeys, handleImportKeys }: VaultActionsProps) {
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
