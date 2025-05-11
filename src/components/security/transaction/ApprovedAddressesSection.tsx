
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ApprovedAddressesSection() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Εγκεκριμένες Διευθύνσεις</h3>
      <p className="text-sm text-muted-foreground">
        Επιτρέψτε συναλλαγές μόνο με συγκεκριμένες διευθύνσεις πορτοφολιών
      </p>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Χρήση Λίστας Εγκεκριμένων Διευθύνσεων</h4>
          <p className="text-xs text-muted-foreground">Περιορισμός συναλλαγών μόνο σε εγκεκριμένες διευθύνσεις</p>
        </div>
        <Switch />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Διεύθυνση</TableHead>
              <TableHead>Περιγραφή</TableHead>
              <TableHead className="w-24">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs">
                5xFD...8j2P
              </TableCell>
              <TableCell>Κύριο πορτοφόλι ανταλλακτηρίου</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Διαγραφή
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs">
                9aBC...3kLm
              </TableCell>
              <TableCell>Πορτοφόλι staking</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Διαγραφή
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex gap-2">
        <Input placeholder="Εισάγετε διεύθυνση πορτοφολιού" className="flex-1" />
        <Input placeholder="Περιγραφή (προαιρετικά)" className="flex-1" />
        <Button>Προσθήκη</Button>
      </div>
    </div>
  );
}
