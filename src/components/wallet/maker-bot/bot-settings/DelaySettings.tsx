
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DelaySettingsProps {
  minDelay: number;
  maxDelay: number;
  setMinDelay: (value: number) => void;
  setMaxDelay: (value: number) => void;
  disabled: boolean;
}

export function DelaySettings({ 
  minDelay, 
  maxDelay, 
  setMinDelay, 
  setMaxDelay, 
  disabled 
}: DelaySettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="min-delay">Min Delay (sec): {minDelay}</Label>
        <Slider 
          id="min-delay"
          min={1} 
          max={30} 
          value={[minDelay]}
          onValueChange={(values) => setMinDelay(values[0])}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-delay">Max Delay (sec): {maxDelay}</Label>
        <Slider 
          id="max-delay"
          min={1} 
          max={60} 
          value={[maxDelay]}
          onValueChange={(values) => setMaxDelay(values[0])}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
