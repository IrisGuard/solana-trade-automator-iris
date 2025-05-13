
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StrategyFieldProps {
  strategy: string;
  setStrategy: (value: string) => void;
}

export function StrategyField({ strategy, setStrategy }: StrategyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="strategy">Trading Strategy</Label>
      <Select value={strategy} onValueChange={setStrategy}>
        <SelectTrigger id="strategy">
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="momentum">Momentum Trading</SelectItem>
          <SelectItem value="arbitrage">Arbitrage</SelectItem>
          <SelectItem value="grid">Grid Trading</SelectItem>
          <SelectItem value="scalping">Scalping</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
