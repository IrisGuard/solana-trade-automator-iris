
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { LockedVaultView } from "./LockedVaultView";
import { ApiKeysList } from "./ApiKeysList";
import { RecommendedApis } from "./RecommendedApis";
import { VaultActions } from "./VaultActions";
import { RecommendedApi } from "./types";

interface ApiVaultCardProps {
  apiKeys: any[];
  isUnlocked: boolean;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleApiConnect: (index: number) => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
}

export function ApiVaultCard({
  apiKeys,
  isUnlocked,
  handleUnlockVault,
  handleLockVault,
  handleApiConnect,
  handleExportKeys,
  handleImportKeys
}: ApiVaultCardProps) {
  // Default Solana APIs
  const defaultSolanaApis: RecommendedApi[] = [
    {
      name: "Helius API",
      description: "Προηγμένα endpoints για Solana blockchain",
      url: "https://www.helius.dev/docs/api-reference/endpoints"
    },
    {
      name: "QuickNode SDK",
      description: "Αξιόπιστη πρόσβαση στο Solana δίκτυο",
      url: "https://www.quicknode.com/docs/quicknode-sdk/Solana/Overview"
    },
    {
      name: "Moralis Solana API",
      description: "Προηγμένες λειτουργίες για το Solana",
      url: "https://docs.moralis.com/web3-data-api/solana"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          API Key Vault
        </CardTitle>
        <CardDescription>
          Securely store and manage your API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isUnlocked ? (
          <LockedVaultView handleUnlockVault={handleUnlockVault} />
        ) : (
          <>
            <VaultActions 
              handleLockVault={handleLockVault}
              handleExportKeys={handleExportKeys}
              handleImportKeys={handleImportKeys}
            />
            
            <ApiKeysList 
              apiKeys={apiKeys}
              handleApiConnect={handleApiConnect}
            />
            
            {apiKeys.length === 0 && (
              <RecommendedApis apis={defaultSolanaApis} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
