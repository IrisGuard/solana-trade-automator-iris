
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { LockedVaultView } from "./api-vault/LockedVaultView";
import { ApiKeysList } from "./api-vault/ApiKeysList";
import { RecommendedApis } from "./api-vault/RecommendedApis";
import { ApiSettingsForm } from "./api-vault/ApiSettingsForm";
import { VaultActions } from "./api-vault/VaultActions";

interface ApiVaultTabProps {
  apiKeys: any[];
  isUnlocked: boolean;
  apiSettings: any;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleApiConnect: (index: number) => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
  setApiSettings: (settings: any) => void;
  handleSaveApiSettings: () => void;
}

export function ApiVaultTab({
  apiKeys,
  isUnlocked,
  apiSettings,
  handleUnlockVault,
  handleLockVault,
  handleApiConnect,
  handleExportKeys,
  handleImportKeys,
  setApiSettings,
  handleSaveApiSettings
}: ApiVaultTabProps) {
  
  // Προεπιλεγμένα API keys για Solana
  const defaultSolanaApis = [
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
    <TabsContent value="api-vault" className="space-y-4">
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

      <Card>
        <CardHeader>
          <CardTitle>API Connection Settings</CardTitle>
          <CardDescription>Configure RPC and API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiSettingsForm 
            apiSettings={apiSettings}
            setApiSettings={setApiSettings}
            handleSaveApiSettings={handleSaveApiSettings}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
