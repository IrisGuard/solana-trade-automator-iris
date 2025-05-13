
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AutoCompoundToggleProps {
  autoCompound: boolean;
  setAutoCompound: (value: boolean) => void;
}

export function AutoCompoundToggle({ autoCompound, setAutoCompound }: AutoCompoundToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="auto-compound" 
        checked={autoCompound}
        onCheckedChange={setAutoCompound}
      />
      <Label htmlFor="auto-compound">Auto-compound profits</Label>
    </div>
  );
}
