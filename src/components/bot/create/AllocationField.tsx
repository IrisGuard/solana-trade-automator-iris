
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AllocationFieldProps {
  allocation: string;
  setAllocation: (value: string) => void;
}

export function AllocationField({ allocation, setAllocation }: AllocationFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="balance">Initial Balance Allocation</Label>
      <Input 
        id="balance" 
        placeholder="25%" 
        value={allocation}
        onChange={(e) => setAllocation(e.target.value)}
        suffix="%"
      />
    </div>
  );
}
