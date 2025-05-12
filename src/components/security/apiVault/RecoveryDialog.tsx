import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApiKey } from "./types";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Database, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [viewableKeys, setViewableKeys] = useState<Set<string>>(new Set());
  
  // Toggle selection of a key
  const toggleKeySelection = (keyId: string) => {
    const newSelection = new Set(selectedKeys);
    if (newSelection.has(keyId)) {
      newSelection.delete(keyId);
    } else {
      newSelection.add(keyId);
    }
    setSelectedKeys(newSelection);
  };
  
  // Toggle visibility of a key
  const toggleKeyVisibility = (keyId: string) => {
    const newViewable = new Set(viewableKeys);
    if (newViewable.has(keyId)) {
      newViewable.delete(keyId);
    } else {
      newViewable.add(keyId);
    }
    setViewableKeys(newViewable);
  };
  
  // Select or deselect all keys
  const toggleSelectAll = () => {
    if (selectedKeys.size === recoveredKeys.length) {
      // If all are selected, deselect all
      setSelectedKeys(new Set());
    } else {
      // Otherwise, select all
      setSelectedKeys(new Set(recoveredKeys.map(key => key.id)));
    }
  };
  
  // Import selected keys
  const handleImport = () => {
    const keysToImport = recoveredKeys.filter(key => selectedKeys.has(key.id));
    onImport(keysToImport);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Ανακτημένα Κλειδιά API
          </DialogTitle>
          <DialogDescription>
            Βρέθηκαν {recoveredKeys.length} κλειδιά API σε {locations.length} τοποθεσίες αποθήκευσης.
            Επιλέξτε τα κλειδιά που θέλετε να εισάγετε στην κλειδοθήκη σας.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Recovery locations */}
          {locations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Τοποθεσίες ανάκτησης:</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {loc.storageKey} ({loc.count})
                  </Badge>
                ))}
              </div>
              <Separator className="my-2" />
            </div>
          )}
          
          {/* Recovery warning */}
          {recoveredKeys.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-amber-800">
                Προσοχή: Τα ανακτημένα κλειδιά μπορεί να περιέχουν ευαίσθητες πληροφορίες. 
                Βεβαιωθείτε ότι εισάγετε μόνο τα κλειδιά που αναγνωρίζετε και χρειάζεστε.
              </div>
            </div>
          )}
          
          {/* Recovered keys table */}
          {recoveredKeys.length > 0 ? (
            <ScrollArea className="h-64 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300" 
                        checked={selectedKeys.size === recoveredKeys.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Όνομα</TableHead>
                    <TableHead>Υπηρεσία</TableHead>
                    <TableHead>Κλειδί</TableHead>
                    <TableHead>Πηγή</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recoveredKeys.map((key) => (
                    <TableRow key={key.id} className="hover:bg-muted/50">
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300" 
                          checked={selectedKeys.has(key.id)}
                          onChange={() => toggleKeySelection(key.id)}
                        />
                      </TableCell>
                      <TableCell>{key.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{key.service}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          {viewableKeys.has(key.id) ? key.key : '••••••••••••••••••'}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 text-muted-foreground hover:text-foreground"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {viewableKeys.has(key.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{key.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mb-2 text-green-500 opacity-70" />
              <p>Δεν βρέθηκαν επιπλέον κλειδιά API στην αποθήκευση</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Ακύρωση</Button>
          <Button 
            onClick={handleImport} 
            disabled={selectedKeys.size === 0}
            className="gap-1"
          >
            <Database className="h-4 w-4" />
            Εισαγωγή {selectedKeys.size} κλειδιών
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
