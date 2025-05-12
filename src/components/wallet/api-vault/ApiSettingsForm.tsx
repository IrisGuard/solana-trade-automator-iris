
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ApiSettings {
  rpcUrl: string;
  customRpc: boolean;
  fallbackRpc: boolean;
  rateLimit: number;
}

interface ApiSettingsFormProps {
  apiSettings: ApiSettings;
  setApiSettings: (settings: ApiSettings) => void;
  handleSaveApiSettings: () => void;
}

export function ApiSettingsForm({ apiSettings, setApiSettings, handleSaveApiSettings }: ApiSettingsFormProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
