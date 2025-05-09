
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { parseImportData } from "./utils";
import { ApiKey } from "./types";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (keys: ApiKey[]) => void;
}

export const ImportDialog = ({ open, onOpenChange, onImport }: ImportDialogProps) => {
  const [importData, setImportData] = useState("");
  const [importFormat, setImportFormat] = useState("json");

  const handleImport = () => {
    try {
      const importedKeys = parseImportData(importData);
      
      if (importedKeys.length > 0) {
        onImport(importedKeys);
        onOpenChange(false);
        setImportData("");
        toast.success(`Εισαγωγή ${importedKeys.length} κλειδιών με επιτυχία`);
      } else {
        toast.error("Δεν βρέθηκαν έγκυρα κλειδιά για εισαγωγή");
      }
    } catch (e) {
      console.error('Σφάλμα εισαγωγής:', e);
      toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Μαζική Εισαγωγή Κλειδιών API</DialogTitle>
          <DialogDescription>
            Εισάγετε κλειδιά σε μορφή JSON ή κείμενο με διαχωριστικό
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="import-format">Μορφή Δεδομένων</Label>
            <Select 
              value={importFormat} 
              onValueChange={setImportFormat}
            >
              <SelectTrigger id="import-format">
                <SelectValue placeholder="Επιλέξτε μορφή" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="text">Text με διαχωριστικό |</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="import-data">Δεδομένα</Label>
            <Textarea 
              id="import-data" 
              placeholder={importFormat === 'json' ? 
                '[{"name":"Example Key","key":"your-key-here","service":"aws"}]' : 
                'Key Name|your-key-here|service|optional description|optional expiry date'
              }
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleImport}>Εισαγωγή</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
