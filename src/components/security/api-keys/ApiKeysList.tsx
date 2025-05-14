
import React from "react";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { ApiKeyItem } from "./ApiKeyItem";

interface ApiKeysListProps {
  apiKeys: ApiKeyWithState[];
  toggleKeyVisibility: (id: string) => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  onTest: (apiKey: ApiKeyWithState) => Promise<boolean>;
  isKeyVisible: (id: string) => boolean;
  isCopied: (value: string) => boolean;
  isKeyTesting: (id: string) => boolean;
  formatDate: (date: string) => string;
  formatKeyDisplay: (key: string, isVisible: boolean) => string;
}

export function ApiKeysList({
  apiKeys,
  toggleKeyVisibility,
  onCopy,
  onDelete,
  onTest,
  isKeyVisible,
  isCopied,
  isKeyTesting,
  formatDate,
  formatKeyDisplay
}: ApiKeysListProps) {
  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No API keys found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <ApiKeyItem
          key={apiKey.id}
          apiKey={apiKey}
          isVisible={isKeyVisible(apiKey.id)}
          onToggleVisibility={() => toggleKeyVisibility(apiKey.id)}
          onCopy={onCopy}
          onDelete={onDelete}
          onTest={onTest}
          isCopied={isCopied(apiKey.key_value)}
          isTesting={isKeyTesting(apiKey.id)}
          formatDate={formatDate}
          formatKeyDisplay={formatKeyDisplay}
        />
      ))}
    </div>
  );
}
