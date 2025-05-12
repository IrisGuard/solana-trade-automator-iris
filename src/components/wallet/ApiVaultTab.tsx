
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ApiVaultCard } from "./api-vault/ApiVaultCard";
import { ApiSettingsCard } from "./api-vault/ApiSettingsCard";
import { ApiKey, ApiSettings } from "./api-vault/types";
import { DEFAULT_RECOMMENDED_APIS } from "./api-vault/defaultApis";

interface ApiVaultTabProps {
  apiKeys: ApiKey[];
  isUnlocked: boolean;
  apiSettings: ApiSettings;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleApiConnect: (index: number) => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
  setApiSettings: (settings: ApiSettings) => void;
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
  
  return (
    <TabsContent value="api-vault" className="space-y-4">
      <ApiVaultCard
        apiKeys={apiKeys}
        isUnlocked={isUnlocked}
        handleUnlockVault={handleUnlockVault}
        handleLockVault={handleLockVault}
        handleApiConnect={handleApiConnect}
        handleExportKeys={handleExportKeys}
        handleImportKeys={handleImportKeys}
        recommendedApis={DEFAULT_RECOMMENDED_APIS}
      />

      <ApiSettingsCard
        apiSettings={apiSettings}
        setApiSettings={setApiSettings}
        handleSaveApiSettings={handleSaveApiSettings}
      />
    </TabsContent>
  );
}
