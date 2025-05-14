
import React from "react";
import { ApiKeyItem } from "./ApiKeyItem";

interface ApiKey {
  id: string;
  name: string;
  service: string;
  created_at: string;
  status: string;
  key_value: string;
}

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  visibleKeys: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  onCopy: (text: string) => void;
  copiedKey: string | null;
  formatDate: (dateString: string) => string;
}

export function ApiKeysList({
  apiKeys,
  visibleKeys,
  toggleKeyVisibility,
  onCopy,
  copiedKey,
  formatDate
}: ApiKeysListProps) {
  return (
    <div className="space-y-4">
      {apiKeys.map((key) => (
        <ApiKeyItem
          key={key.id}
          apiKey={key}
          isVisible={!!visibleKeys[key.id]}
          onToggleVisibility={() => toggleKeyVisibility(key.id)}
          onCopy={onCopy}
          copiedKey={copiedKey}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
