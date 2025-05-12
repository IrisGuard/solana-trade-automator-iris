
import React from "react";
import { ApiKey } from "../types";
import { ApiKeyListItem } from "./ApiKeyListItem";

interface ApiKeyListContentProps {
  apiKeys: ApiKey[];
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  onDeleteRequest: (key: ApiKey) => void;
  onEditKey?: (key: ApiKey) => void;
  onTestKey?: (key: ApiKey) => Promise<boolean>;
}

export const ApiKeyListContent: React.FC<ApiKeyListContentProps> = ({
  apiKeys,
  isKeyVisible,
  toggleKeyVisibility,
  onDeleteRequest,
  onEditKey,
  onTestKey
}) => {
  return (
    <div className="space-y-3">
      {apiKeys.map((apiKey) => (
        <ApiKeyListItem
          key={apiKey.id}
          apiKey={apiKey}
          isVisible={!!isKeyVisible[apiKey.id]}
          onToggleVisibility={() => toggleKeyVisibility(apiKey.id)}
          onDeleteRequest={() => onDeleteRequest(apiKey)}
          onEditKey={onEditKey ? () => onEditKey(apiKey) : undefined}
          onTestKey={onTestKey ? () => onTestKey(apiKey) : undefined}
        />
      ))}
    </div>
  );
};
