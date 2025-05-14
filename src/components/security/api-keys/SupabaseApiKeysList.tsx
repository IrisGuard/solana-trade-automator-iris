
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiKeysListHeader } from "../apiKeysList/ApiKeysListHeader";
import { ApiKeysList } from "../apiKeysList/ApiKeysList";
import { ApiKeysEmptyState } from "../apiKeysList/ApiKeysEmptyState";
import { ApiKeysLoading } from "../apiKeysList/ApiKeysLoading";
import { useApiKeys } from "../apiKeysList/useApiKeys";

interface SupabaseApiKeysListProps {
  userId: string;
}

export function SupabaseApiKeysList({ userId }: SupabaseApiKeysListProps) {
  const {
    apiKeys,
    loading,
    visibleKeys,
    copiedKey,
    toggleKeyVisibility,
    handleCopy,
    handleAddKey,
    formatDate
  } = useApiKeys(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <ApiKeysListHeader onAddKey={handleAddKey} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <ApiKeysLoading />
        ) : apiKeys.length === 0 ? (
          <ApiKeysEmptyState onAddKey={handleAddKey} />
        ) : (
          <ApiKeysList 
            apiKeys={apiKeys}
            visibleKeys={visibleKeys}
            toggleKeyVisibility={toggleKeyVisibility}
            onCopy={handleCopy}
            copiedKey={copiedKey}
            formatDate={formatDate}
          />
        )}
      </CardContent>
    </Card>
  );
}
