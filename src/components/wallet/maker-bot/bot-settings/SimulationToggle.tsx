
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SimulationToggleProps {
  isSimulation: boolean;
  toggleSimulation: () => void;
}

export function SimulationToggle({ isSimulation, toggleSimulation }: SimulationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="text-base">Simulation Mode</Label>
        <p className="text-sm text-muted-foreground">No real trades when enabled</p>
      </div>
      <Switch checked={isSimulation} onCheckedChange={toggleSimulation} />
    </div>
  );
}
