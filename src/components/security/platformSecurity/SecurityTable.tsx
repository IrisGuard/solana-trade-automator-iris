
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SecurityFeatureRow } from "./SecurityFeatureRow";
import { SecuritySetting } from "./usePlatformSecurity";

interface SecurityTableProps {
  securitySettings: SecuritySetting[];
  handleToggle: (id: string, enabled: boolean) => void;
  handleEnableAll: () => void;
  handleDisableAll: () => void;
}

export function SecurityTable({
  securitySettings,
  handleToggle,
  handleEnableAll,
  handleDisableAll,
}: SecurityTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-foreground">Security Settings</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisableAll}
            className="text-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            Disable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnableAll}
            className="text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Enable All
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Feature</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-right text-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {securitySettings.map((setting) => (
              <SecurityFeatureRow
                key={setting.id}
                name={setting.name}
                description={setting.description}
                isEnabled={setting.isEnabled}
                onToggle={() => handleToggle(setting.id, !setting.isEnabled)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
