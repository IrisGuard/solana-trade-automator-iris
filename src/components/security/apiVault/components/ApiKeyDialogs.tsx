
import React from "react";
import { ApiKey } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ApiKeyDialogsProps {
  showAddKeyDialog: boolean;
  setShowAddKeyDialog: (show: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  addNewKey: (key: ApiKey) => void;
  handleImport: (keys: ApiKey[]) => void;
}

export const ApiKeyDialogs: React.FC<ApiKeyDialogsProps> = ({
  showAddKeyDialog,
  setShowAddKeyDialog,
  showImportDialog,
  setShowImportDialog,
  addNewKey,
  handleImport
}) => {
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyValue, setNewKeyValue] = React.useState("");
  const [newKeyService, setNewKeyService] = React.useState("supabase");
  const [importData, setImportData] = React.useState("");

  const handleAddKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    const newKey: ApiKey = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newKeyName,
      key: newKeyValue,
      service: newKeyService,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    addNewKey(newKey);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyService("supabase");
    setShowAddKeyDialog(false);
  };

  const handleImportKeys = () => {
    if (!importData.trim()) {
      toast.error("Παρακαλώ εισάγετε δεδομένα για εισαγωγή");
      return;
    }

    try {
      let importedKeys;
      try {
        importedKeys = JSON.parse(importData);
      } catch (e) {
        // Try parsing as text with format "name|key|service" (one per line)
        importedKeys = importData.split("\n").map(line => {
          const parts = line.split("|").map(s => s.trim());
          if (parts.length >= 3) {
            return {
              name: parts[0],
              key: parts[1],
              service: parts[2]
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      if (!Array.isArray(importedKeys) || importedKeys.length === 0) {
        toast.error("Μη έγκυρη μορφή δεδομένων");
        return;
      }
      
      // Validate keys
      const validKeys = importedKeys.filter((key: any) => key && key.name && key.key && key.service);
      
      if (validKeys.length === 0) {
        toast.error("Δεν βρέθηκαν έγκυρα κλειδιά");
        return;
      }
      
      // Add missing properties
      const newKeys: ApiKey[] = validKeys.map((key: any) => ({
        id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: key.name,
        key: key.key,
        service: key.service,
        createdAt: key.createdAt || new Date().toISOString(),
        status: 'active' as 'active' | 'expired' | 'revoked',
        description: key.description
      }));
      
      handleImport(newKeys);
      setImportData("");
      setShowImportDialog(false);
    } catch (e) {
      console.error('Error importing keys:', e);
      toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  };

  return (
    <>
      {/* Add Key Dialog */}
      <Dialog open={showAddKeyDialog} onOpenChange={setShowAddKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Κλειδιού API</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του νέου κλειδιού API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Όνομα Κλειδιού *</Label>
              <Input 
                id="key-name" 
                placeholder="π.χ. Supabase Production" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-value">Τιμή Κλειδιού *</Label>
              <Input 
                id="key-value" 
                placeholder="eyJhbGciOiJIUzI1NiIs..." 
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-service">Υπηρεσία</Label>
              <Select 
                value={newKeyService} 
                onValueChange={setNewKeyService}
              >
                <SelectTrigger id="key-service">
                  <SelectValue placeholder="Επιλέξτε υπηρεσία" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="firebase">Firebase</SelectItem>
                  <SelectItem value="google">Google API</SelectItem>
                  <SelectItem value="other">Άλλο</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddKeyDialog(false)}>Ακύρωση</Button>
            <Button onClick={handleAddKey}>Αποθήκευση</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Μαζική Εισαγωγή Κλειδιών API</DialogTitle>
            <DialogDescription>
              Εισάγετε κλειδιά σε μορφή JSON ή κείμενο με διαχωριστικό (|)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import-data">Δεδομένα</Label>
              <Textarea 
                id="import-data" 
                placeholder={`[
  {
    "name": "AWS Key",
    "service": "aws",
    "key": "AKIAIOSFODNN7EXAMPLE"
  },
  {
    "name": "Github Token",
    "service": "github",
    "key": "ghp_xxxxxxxxxxxxxxxx"
  }
]

ή

OpenAI Key|sk-xxxxxxxxxxxxxxxxxxxx|openai
Stripe Test|sk_test_xxxxxxxxxxxxx|stripe`}
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Μπορείτε να εισάγετε κλειδιά σε μορφή JSON ή κείμενο με διαχωριστικό | (Όνομα|Κλειδί|Υπηρεσία). Κάθε κλειδί πρέπει να είναι σε ξεχωριστή γραμμή.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>Ακύρωση</Button>
            <Button onClick={handleImportKeys}>Εισαγωγή</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
