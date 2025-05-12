
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface SecurityFeatureRowProps {
  name: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export function SecurityFeatureRow({
  name,
  description,
  isEnabled,
  onToggle
}: SecurityFeatureRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        <Switch 
          checked={isEnabled}
          onCheckedChange={onToggle}
        />
      </TableCell>
    </TableRow>
  );
}
