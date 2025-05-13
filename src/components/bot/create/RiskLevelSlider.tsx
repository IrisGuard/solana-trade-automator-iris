
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RiskLevelSliderProps {
  riskLevel: number;
  setRiskLevel: (value: number) => void;
}

export function RiskLevelSlider({ riskLevel, setRiskLevel }: RiskLevelSliderProps) {
  return (
    <div className="space-y-2">
      <Label>Risk Level</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs">Conservative</span>
        <Slider 
          value={[riskLevel]} 
          max={100} 
          step={1} 
          className="flex-grow" 
          onValueChange={([value]) => setRiskLevel(value)}
        />
        <span className="text-xs">Aggressive</span>
      </div>
    </div>
  );
}
