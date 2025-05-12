
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiSettings } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApiSettingsFormProps {
  apiSettings: ApiSettings;
  setApiSettings: (settings: ApiSettings) => void;
  handleSaveApiSettings: () => void;
}

export function ApiSettingsForm({ apiSettings, setApiSettings, handleSaveApiSettings }: ApiSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rpc-endpoint">Solana RPC URL</Label>
        <Input 
          id="rpc-endpoint" 
          value={apiSettings.rpcEndpoint}
          onChange={(e) => setApiSettings({...apiSettings, rpcEndpoint: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="api-endpoint">API Endpoint</Label>
        <Input 
          id="api-endpoint" 
          value={apiSettings.apiEndpoint}
          onChange={(e) => setApiSettings({...apiSettings, apiEndpoint: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websocket-endpoint">WebSocket Endpoint</Label>
        <Input 
          id="websocket-endpoint" 
          value={apiSettings.websocketEndpoint}
          onChange={(e) => setApiSettings({...apiSettings, websocketEndpoint: e.target.value})}
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

      <div className="pt-2 border-t">
        <h3 className="text-md font-medium mb-3">Raydium API Settings</h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <Switch 
            id="raydium-enabled"
            checked={apiSettings.raydiumEnabled || false}
            onCheckedChange={(checked) => setApiSettings({...apiSettings, raydiumEnabled: checked})}
          />
          <Label htmlFor="raydium-enabled">Enable Raydium API</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="raydium-endpoint">Raydium API Endpoint</Label>
          <Input 
            id="raydium-endpoint" 
            value={apiSettings.raydiumApiEndpoint || "https://api.raydium.io"}
            onChange={(e) => setApiSettings({...apiSettings, raydiumApiEndpoint: e.target.value})}
            disabled={!apiSettings.raydiumEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="raydium-version">API Version</Label>
          <Select 
            value={apiSettings.raydiumApiVersion || "v2"} 
            onValueChange={(value) => setApiSettings({...apiSettings, raydiumApiVersion: value})}
            disabled={!apiSettings.raydiumEnabled}
          >
            <SelectTrigger id="raydium-version">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">Version 1</SelectItem>
              <SelectItem value="v2">Version 2 (Latest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleSaveApiSettings}>
        Save Settings
      </Button>
    </div>
  );
}
