import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, Database, Key } from "lucide-react";

interface ApiKey {
  name: string;
  connected: boolean;
}

interface ApiSettings {
  rpcUrl: string;
  customRpc: boolean;
  fallbackRpc: boolean;
  rateLimit: number;
}

interface ApiVaultTabProps {
  apiKeys: any[];
  isUnlocked: boolean;
  apiSettings: any;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleApiConnect: (index: number) => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
  setApiSettings: (settings: any) => void;
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Key Vault
          </CardTitle>
          <CardDescription>
            Securely store and manage your API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isUnlocked ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">API Vault is Locked</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Unlock the vault to manage your API keys and secrets
              </p>
              <Button onClick={handleUnlockVault}>
                Unlock Vault
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Stored API Keys</h3>
                <Button variant="outline" size="sm" onClick={handleLockVault}>
                  Lock Vault
                </Button>
              </div>
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
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleExportKeys}>
                  Export Keys
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportKeys}>
                  Import Keys
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Connection Settings</CardTitle>
          <CardDescription>Configure RPC and API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rpc-url">Solana RPC URL</Label>
            <Input 
              id="rpc-url" 
              value={apiSettings.rpcUrl}
              onChange={(e) => setApiSettings({...apiSettings, rpcUrl: e.target.value})}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="custom-rpc"
              checked={apiSettings.customRpc}
              onCheckedChange={(checked) => setApiSettings({...apiSettings, customRpc: checked})}
            />
            <Label htmlFor="custom-rpc">Use custom RPC endpoint</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="fallback-rpc"
              checked={apiSettings.fallbackRpc}
              onCheckedChange={(checked) => setApiSettings({...apiSettings, fallbackRpc: checked})}
            />
            <Label htmlFor="fallback-rpc">Enable RPC fallback</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate limit (requests/sec): {apiSettings.rateLimit}</Label>
            <Slider 
              id="rate-limit"
              min={1} 
              max={20} 
              step={1}
              value={[apiSettings.rateLimit]}
              onValueChange={(values) => setApiSettings({...apiSettings, rateLimit: values[0]})}
            />
          </div>
          
          <Button className="w-full" onClick={handleSaveApiSettings}>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
