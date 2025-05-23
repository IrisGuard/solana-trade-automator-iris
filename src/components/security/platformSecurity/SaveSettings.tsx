
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface SaveSettingsProps {
  onSave: () => void;
}

export function SaveSettings({ onSave }: SaveSettingsProps) {
  return (
    <div className="mt-4">
      <Label className="text-sm text-muted-foreground mb-2 block">
        Note: These settings will be applied when the platform enters full operation
      </Label>
      
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox id="disclaimer" />
        <Label htmlFor="disclaimer" className="text-sm">
          I understand that disabling security features may increase risk
        </Label>
      </div>
      
      <Button onClick={onSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}
