
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Unlock, Copy, Eye, EyeOff } from "lucide-react";
import { ApiKey } from "@/types/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ApiKeyManagementProps {
  apiKeys: ApiKey[];
  isUnlocked: boolean;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleCreateKey: () => void;
  handleRevokeKey: (id: string) => void;
}

export function ApiKeyManagement({
  apiKeys,
  isUnlocked,
  handleUnlockVault,
  handleLockVault,
  handleCreateKey,
  handleRevokeKey
}: ApiKeyManagementProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };
  
  const copyKeyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copied to clipboard");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Keys</CardTitle>
        <div className="space-x-2">
          {isUnlocked ? (
            <>
              <Button onClick={handleCreateKey} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Create Key
              </Button>
              <Button onClick={handleLockVault} size="sm" variant="ghost">
                <Lock className="h-4 w-4 mr-1" />
                Lock
              </Button>
            </>
          ) : (
            <Button onClick={handleUnlockVault} size="sm">
              <Unlock className="h-4 w-4 mr-1" />
              Unlock Vault
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isUnlocked ? (
          <div className="py-8 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">API Key Vault is Locked</h3>
            <p className="text-muted-foreground mb-4">
              Unlock the vault to view and manage your API keys
            </p>
            <Button onClick={handleUnlockVault}>
              Unlock Vault
            </Button>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You don't have any API keys yet</p>
            <Button onClick={handleCreateKey}>
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div 
                key={key.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-xs text-muted-foreground">Created: {new Date(key.created).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={key.status === 'active' ? 'success' : 'secondary'}>
                    {key.status || 'active'}
                  </Badge>
                </div>
                
                <div className="relative bg-secondary p-2 rounded font-mono text-sm mb-3 flex items-center">
                  <code className="flex-1 overflow-x-auto">
                    {visibleKeys[key.id] ? key.key : '•'.repeat(Math.min(key.key.length, 32))}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                    onClick={() => toggleKeyVisibility(key.id)}
                  >
                    {visibleKeys[key.id] ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyKeyToClipboard(key.key)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs">Permissions: {key.permissions?.join(', ') || 'Default'}</p>
                  </div>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
