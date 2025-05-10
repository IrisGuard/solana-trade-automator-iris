
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MakersCountSettingProps {
  makers: number;
  setMakers: (value: number) => void;
  disabled: boolean;
}

export function MakersCountSetting({ makers, setMakers, disabled }: MakersCountSettingProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="makers-count">Number of Makers: {makers}</Label>
      <Slider 
        id="makers-count"
        min={10} 
        max={500} 
        step={10}
        value={[makers]}
        onValueChange={(values) => setMakers(values[0])}
        disabled={disabled}
      />
    </div>
  );
}
