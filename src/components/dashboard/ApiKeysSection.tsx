
import React from 'react';
import { useApiKeyManager } from '@/hooks/api-keys/useApiKeyManager';
import { ApiKeyList } from '../settings/api-keys/ApiKeyList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ApiKeysSection() {
  const { 
    apiKeys, 
    loading, 
    copiedKeyId,
    visibleKeyIds,
    fetchApiKeys,
    handleCopy,
    handleAddNewKey,
    toggleKeyVisibility 
  } = useApiKeyManager();

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for third-party services
          </CardDescription>
        </div>
        <Button 
          size="sm" 
          className="ml-auto"
          onClick={() => handleAddNewKey({
            user_id: 'demo',
            name: 'New API Key',
            service: 'helius',
            key_value: 'demo-key-' + Math.random().toString(36).substring(2, 8),
            status: 'active',
            description: 'Demo API key'
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        <ApiKeyList 
          apiKeys={apiKeys.map(key => ({
            ...key,
            isVisible: visibleKeyIds.includes(key.id),
            isWorking: true,
            isTesting: false
          }))} 
          onToggleVisibility={toggleKeyVisibility}
          onCopy={handleCopy}
          copiedKeyId={copiedKeyId}
          isLoading={loading} 
        />
      </CardContent>
    </Card>
  );
}
