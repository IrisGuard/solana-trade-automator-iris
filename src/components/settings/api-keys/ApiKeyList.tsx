
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ApiKeyWithState } from '@/services/api-keys/types';

export interface ApiKeyListProps {
  apiKeys: ApiKeyWithState[];
  onToggleVisibility?: (id: string) => void;
  onCopy?: (id: string) => void;
  copiedKeyId?: string | null;
  isLoading?: boolean;
}

export function ApiKeyList({ 
  apiKeys, 
  onToggleVisibility, 
  onCopy, 
  copiedKeyId, 
  isLoading = false 
}: ApiKeyListProps) {
  if (isLoading) {
    return <div className="py-4 text-center">Loading API keys...</div>;
  }

  if (!apiKeys?.length) {
    return <div className="py-4 text-center">No API keys found</div>;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <div className="font-medium">{key.name}</div>
                <div className="text-sm text-muted-foreground">{key.service}</div>
                <div className="font-mono text-xs bg-muted px-2 py-0.5 rounded mt-1">
                  {key.isVisible ? key.key_value : '●●●●●●●●●●●●●●●●'}
                </div>
              </div>
              <div className="flex space-x-2">
                {onToggleVisibility && (
                  <button 
                    onClick={() => onToggleVisibility(key.id)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
                  >
                    {key.isVisible ? 'Hide' : 'Show'}
                  </button>
                )}
                {onCopy && (
                  <button 
                    onClick={() => onCopy(key.id)}
                    className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
                  >
                    {copiedKeyId === key.id ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
