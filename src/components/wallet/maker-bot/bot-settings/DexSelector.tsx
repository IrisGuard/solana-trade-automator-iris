
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface DexSelectorProps {
  disabled: boolean;
}

export function DexSelector({ disabled }: DexSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="exchange-select">Target DEX</Label>
      <Select disabled={disabled}>
        <SelectTrigger id="exchange-select">
          <SelectValue placeholder="Jupiter Aggregator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jupiter">Jupiter Aggregator</SelectItem>
          <SelectItem value="orca">Orca</SelectItem>
          <SelectItem value="raydium">Raydium</SelectItem>
          <SelectItem value="openbook">OpenBook</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
