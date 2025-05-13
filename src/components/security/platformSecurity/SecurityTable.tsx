
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SecurityFeatureRow } from "./SecurityFeatureRow";
import { SecuritySetting } from "./usePlatformSecurity";

interface SecurityTableProps {
  securitySettings: SecuritySetting[];
  handleToggle: (id: string) => void;
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
        <h4 className="font-medium text-foreground">Ρυθμίσεις Ασφαλείας</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisableAll}
            className="text-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            Απενεργοποίηση Όλων
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnableAll}
            className="text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Ενεργοποίηση Όλων
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Λειτουργία</TableHead>
              <TableHead className="text-foreground">Περιγραφή</TableHead>
              <TableHead className="text-right text-foreground">Κατάσταση</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {securitySettings.map((setting) => (
              <SecurityFeatureRow
                key={setting.id}
                setting={setting}
                onToggle={() => handleToggle(setting.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
