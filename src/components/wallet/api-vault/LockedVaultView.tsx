
import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

interface LockedVaultViewProps {
  handleUnlockVault: () => void;
}

export function LockedVaultView({ handleUnlockVault }: LockedVaultViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Key className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">API Vault is Locked</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Unlock the vault to manage your API keys and secrets
      </p>
      <Button onClick={handleUnlockVault}>
        Unlock Vault
      </Button>
    </div>
  );
}
