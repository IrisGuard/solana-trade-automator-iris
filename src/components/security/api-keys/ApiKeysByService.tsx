
import React from "react";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { ApiKeysList } from "./ApiKeysList";

interface ApiKeysByServiceProps {
  keysByService: Record<string, ApiKeyWithState[]>;
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

export function ApiKeysByService({
  keysByService,
  toggleKeyVisibility,
  onCopy,
  onDelete,
  onTest,
  isKeyVisible,
  isCopied,
  isKeyTesting,
  formatDate,
  formatKeyDisplay
}: ApiKeysByServiceProps) {
  const services = Object.keys(keysByService).sort();
  
  if (services.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No API keys found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {services.map(service => (
        <div key={service}>
          <h2 className="text-lg font-medium mb-3 capitalize">{service}</h2>
          <ApiKeysList
            apiKeys={keysByService[service]}
            toggleKeyVisibility={toggleKeyVisibility}
            onCopy={onCopy}
            onDelete={onDelete}
            onTest={onTest}
            isKeyVisible={isKeyVisible}
            isCopied={isCopied}
            isKeyTesting={isKeyTesting}
            formatDate={formatDate}
            formatKeyDisplay={formatKeyDisplay}
          />
        </div>
      ))}
    </div>
  );
}
