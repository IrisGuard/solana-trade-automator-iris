
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeysList } from "./ApiKeysList";
import { LockedVaultView } from "./LockedVaultView";
import { VaultActions } from "./VaultActions";
import { RecommendedApis } from "./RecommendedApis";
import { ApiKey, RecommendedApi } from "./types";
import { DEFAULT_RECOMMENDED_APIS } from "./defaultApis";

interface ApiVaultCardProps {
  apiKeys: ApiKey[];
  isUnlocked: boolean;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleApiConnect: (index: number) => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
  recommendedApis?: RecommendedApi[];
}

export function ApiVaultCard({
  apiKeys,
  isUnlocked,
  handleUnlockVault,
  handleLockVault,
  handleApiConnect,
  handleExportKeys,
  handleImportKeys,
  recommendedApis = DEFAULT_RECOMMENDED_APIS
}: ApiVaultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Vault</CardTitle>
        <CardDescription>
          Securely manage your API keys and connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUnlocked ? (
          <>
            <ApiKeysList 
              apiKeys={apiKeys}
              handleApiConnect={handleApiConnect}
            />
            
            <VaultActions 
              isUnlocked={isUnlocked}
              handleUnlockVault={handleUnlockVault}
              handleLockVault={handleLockVault}
              handleExportKeys={handleExportKeys}
              handleImportKeys={handleImportKeys}
            />
            
            <RecommendedApis apis={recommendedApis} />
          </>
        ) : (
          <LockedVaultView handleUnlockVault={handleUnlockVault} />
        )}
      </CardContent>
    </Card>
  );
}
