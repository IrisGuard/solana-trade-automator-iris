
import React from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { ApiKey } from "./types";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  handleApiConnect: (index: number) => void;
}

export function ApiKeysList({ apiKeys, handleApiConnect }: ApiKeysListProps) {
  return (
    <div className="space-y-3">
      {apiKeys.map((api, index) => (
        <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
          <div className="flex items-center gap-2">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              api.connected ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
            }`}>
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{api.name}</p>
              <p className="text-xs text-muted-foreground">
                {api.connected ? 'Active' : 'Not connected'}
              </p>
            </div>
          </div>
          <Button 
            variant={api.connected ? 'outline' : 'default'} 
            size="sm"
            onClick={() => handleApiConnect(index)}
          >
            {api.connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
}
