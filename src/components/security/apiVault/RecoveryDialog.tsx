
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, Database, AlertCircle } from "lucide-react";
import { ApiKey } from "./types";
import { Badge } from "@/components/ui/badge";
import { maskKey } from "./utils";

interface RecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recoveredKeys: ApiKey[];
  locations: { storageKey: string; count: number }[];
  onImport: (keys: ApiKey[]) => void;
  onClose: () => void;
}

export const RecoveryDialog = ({
  open,
  onOpenChange,
  recoveredKeys,
  locations,
  onImport,
  onClose
}: RecoveryDialogProps) => {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set(recoveredKeys.map(key => key.id))
  );

  const toggleKeySelection = (id: string) => {
    const newSelection = new Set(selectedKeys);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedKeys(newSelection);
  };

  const toggleAllKeys = () => {
    if (selectedKeys.size === recoveredKeys.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(recoveredKeys.map(key => key.id)));
    }
  };

  const handleImportSelected = () => {
    const keysToImport = recoveredKeys.filter(key => selectedKeys.has(key.id));
    if (keysToImport.length > 0) {
      onImport(keysToImport);
      onClose();
    }
  };

  const totalKeys = recoveredKeys.length;
  const locationsList = locations.length > 0 
    ? locations.map(loc => `${loc.storageKey} (${loc.count})`).join(", ")
    : "Καμία";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Ανάκτηση Κλειδιών API
          </DialogTitle>
          <DialogDescription>
            Βρέθηκαν {totalKeys} κλειδιά σε {locations.length} τοποθεσίες: {locationsList}
          </DialogDescription>
        </DialogHeader>

        {recoveredKeys.length > 0 ? (
          <>
            <div className="flex justify-between items-center my-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedKeys.size === recoveredKeys.length && recoveredKeys.length > 0}
                  onChange={toggleAllKeys}
                  className="rounded border-gray-300"
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Επιλογή όλων ({selectedKeys.size}/{recoveredKeys.length})
                </label>
              </div>
              <Badge variant="outline">
                {selectedKeys.size} επιλεγμένα
              </Badge>
            </div>

            <ScrollArea className="h-[50vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Όνομα</TableHead>
                    <TableHead>Υπηρεσία</TableHead>
                    <TableHead>Κλειδί</TableHead>
                    <TableHead>Πηγή</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recoveredKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedKeys.has(key.id)}
                          onChange={() => toggleKeySelection(key.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>{key.name}</TableCell>
                      <TableCell>{key.service}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {maskKey(key.key)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {key.source || "άγνωστο"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Δεν βρέθηκαν κλειδιά</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Δεν ήταν δυνατή η ανάκτηση κλειδιών από τη συσκευή σας. Δοκιμάστε να εισαγάγετε νέα κλειδιά.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Άκυρο
          </Button>
          <Button 
            onClick={handleImportSelected} 
            disabled={selectedKeys.size === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Εισαγωγή {selectedKeys.size} κλειδιών
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
