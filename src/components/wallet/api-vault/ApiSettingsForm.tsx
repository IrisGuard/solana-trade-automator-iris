
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiSettings } from "./types";

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
          checked={apiSettings.customRpc || false}
          onCheckedChange={(checked) => setApiSettings({...apiSettings, customRpc: checked})}
        />
        <Label htmlFor="custom-rpc">Use custom RPC endpoint</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="fallback-rpc"
          checked={apiSettings.fallbackRpc || false}
          onCheckedChange={(checked) => setApiSettings({...apiSettings, fallbackRpc: checked})}
        />
        <Label htmlFor="fallback-rpc">Enable RPC fallback</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rate-limit">Rate limit (requests/sec): {apiSettings.rateLimit || 10}</Label>
        <Slider 
          id="rate-limit"
          min={1} 
          max={20} 
          step={1}
          value={[apiSettings.rateLimit || 10]}
          onValueChange={(values) => setApiSettings({...apiSettings, rateLimit: values[0]})}
        />
      </div>
      
      <Button className="w-full" onClick={handleSaveApiSettings}>
        Save Settings
      </Button>
    </div>
  );
}
