
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, Key } from "lucide-react";
import { toast } from "sonner";
import { ApiKey } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ApiVaultCard = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (savedKeys) {
        return JSON.parse(savedKeys);
      }
      return [];
    } catch (e) {
      console.error('Error loading keys:', e);
      return [];
    }
  });
  
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyService, setNewKeyService] = useState("supabase");
  const [importData, setImportData] = useState("");

  // Save keys to localStorage whenever they change
  useEffect(() => {
    if (apiKeys.length > 0) {
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  const handleExportKeys = () => {
    if (apiKeys.length === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εξαγωγή");
      return;
    }

    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apiKeys, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "api_keys.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("Τα κλειδιά εξήχθησαν επιτυχώς");
    } catch (error) {
      console.error("Error exporting keys:", error);
      toast.error("Σφάλμα κατά την εξαγωγή των κλειδιών");
    }
  };

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

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyService("supabase");
    setShowAddKeyDialog(false);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
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
      const newKeys = validKeys.map((key: any) => ({
        id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: key.name,
        key: key.key,
        service: key.service,
        createdAt: key.createdAt || new Date().toISOString(),
        status: key.status || 'active'
      }));
      
      setApiKeys(prev => [...prev, ...newKeys]);
      setImportData("");
      setShowImportDialog(false);
      toast.success(`Εισήχθησαν ${newKeys.length} κλειδιά επιτυχώς`);
    } catch (e) {
      console.error('Error importing keys:', e);
      toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Κλειδιά API</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowImportDialog(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Εισαγωγή
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportKeys}
              className="gap-2" 
              disabled={apiKeys.length === 0}
            >
              <Download className="h-4 w-4" />
              Εξαγωγή
            </Button>
            <Button 
              onClick={() => setShowAddKeyDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Προσθήκη Κλειδιού
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Διαχείριση κλειδιών API για διάφορες υπηρεσίες.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiKeys.length > 0 ? (
            <div className="border rounded-md p-4">
              <ul className="space-y-3">
                {apiKeys.map((key) => (
                  <li key={key.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{key.name || "Κλειδί API"}</div>
                        <div className="text-sm text-muted-foreground">
                          <span>Υπηρεσία: {key.service || "Άγνωστη"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span>Κλειδί: {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        Διαγραφή
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Δεν έχουν βρεθεί αποθηκευμένα κλειδιά API
              </p>
              <Button 
                onClick={() => setShowAddKeyDialog(true)}
                className="mt-4"
                variant="outline"
              >
                Προσθήκη πρώτου κλειδιού
              </Button>
            </div>
          )}
        </div>

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
      </CardContent>
    </Card>
  );
}
