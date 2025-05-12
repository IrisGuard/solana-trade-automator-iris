
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Copy, Download, Search } from "lucide-react";
import { ApiKey } from "./types";
import { toast } from "sonner";
import { recoverAllApiKeys } from "./utils";

export function KeyRecoveryView() {
  const [recoveredKeys, setRecoveredKeys] = useState<ApiKey[]>([]);
  const [locations, setLocations] = useState<{ storageKey: string; count: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRawDialog, setShowRawDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRecover = async () => {
    setIsLoading(true);
    toast.loading("Σάρωση για κλειδιά σε εξέλιξη...");
    
    try {
      const result = await recoverAllApiKeys();
      setRecoveredKeys(result.recoveredKeys);
      setLocations(result.locations);
      
      if (result.recoveredKeys.length > 0) {
        toast.success(`Βρέθηκαν ${result.recoveredKeys.length} κλειδιά σε ${result.locations.length} τοποθεσίες`);
      } else {
        toast.warning("Δεν βρέθηκαν κλειδιά");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση:", error);
      toast.error("Σφάλμα κατά την ανάκτηση κλειδιών");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (recoveredKeys.length > 0) {
      try {
        const existingKeysStr = localStorage.getItem('apiKeys');
        let existingKeys: ApiKey[] = [];
        
        if (existingKeysStr) {
          existingKeys = JSON.parse(existingKeysStr);
        }
        
        // Merge keys and remove duplicates
        const allKeys = [...existingKeys];
        const existingKeyValues = new Set(existingKeys.map(k => k.key));
        
        for (const key of recoveredKeys) {
          if (!existingKeyValues.has(key.key)) {
            allKeys.push(key);
          }
        }
        
        localStorage.setItem('apiKeys', JSON.stringify(allKeys));
        toast.success(`Εισήχθησαν ${allKeys.length - existingKeys.length} νέα κλειδιά`);
        
        // Reload for the changes to take effect
        window.location.reload();
      } catch (e) {
        console.error("Σφάλμα κατά την εισαγωγή:", e);
        toast.error("Σφάλμα κατά την εισαγωγή κλειδιών");
      }
    }
  };

  const exportAsJson = () => {
    try {
      const json = JSON.stringify(recoveredKeys, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'recovered-keys.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Τα κλειδιά εξήχθησαν σε αρχείο JSON");
    } catch (e) {
      toast.error("Σφάλμα κατά την εξαγωγή σε JSON");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        toast.success("Αντιγράφηκε στο πρόχειρο");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Αποτυχία αντιγραφής στο πρόχειρο");
      });
  };

  const filteredKeys = searchTerm
    ? recoveredKeys.filter(key => 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        key.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
        key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (key.source && key.source.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : recoveredKeys;

  const getKeysAsText = () => {
    return filteredKeys.map(key => (
      `Όνομα: ${key.name}\n` +
      `Υπηρεσία: ${key.service}\n` +
      `Κλειδί: ${key.key}\n` +
      `Πηγή: ${key.source || 'άγνωστη'}\n` +
      `Δημιουργήθηκε: ${key.createdAt}\n` +
      `Περιγραφή: ${key.description || '-'}\n` +
      `-----------------------------------`
    )).join('\n\n');
  };

  const getKeysAsRawJson = () => {
    return JSON.stringify(filteredKeys, null, 2);
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-medium mb-2">Ανάκτηση Χαμένων Κλειδιών API</h2>
        <p className="text-muted-foreground mb-4">
          Αυτό το εργαλείο θα σαρώσει το localStorage του περιηγητή σας για να βρει όλα τα πιθανά κλειδιά API, 
          συμπεριλαμβανομένων αυτών από το rork.app ή άλλες εφαρμογές.
        </p>
        <Button 
          onClick={handleRecover}
          disabled={isLoading}
          className="mb-2 w-full"
        >
          {isLoading ? "Σάρωση..." : "Ανάκτηση Κλειδιών"}
        </Button>
      </div>

      {recoveredKeys.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Βρέθηκαν {recoveredKeys.length} κλειδιά</h3>
              <p className="text-sm text-muted-foreground">
                Σε {locations.length} τοποθεσίες αποθήκευσης
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRawDialog(true)}
                className="gap-1"
              >
                <Copy size={16} />
                Προβολή Όλων
              </Button>
              <Button 
                variant="outline"
                onClick={exportAsJson}
                className="gap-1"
              >
                <Download size={16} />
                Εξαγωγή JSON
              </Button>
              <Button onClick={handleImport}>
                Εισαγωγή Όλων
              </Button>
            </div>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Αναζήτηση κλειδιών..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Πίνακας</TabsTrigger>
              <TabsTrigger value="text">Κείμενο</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Όνομα</th>
                      <th className="px-4 py-2 text-left">Υπηρεσία</th>
                      <th className="px-4 py-2 text-left">Κλειδί</th>
                      <th className="px-4 py-2 text-left">Πηγή</th>
                      <th className="px-4 py-2 text-left">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredKeys.map((key, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-2">{key.name}</td>
                        <td className="px-4 py-2">{key.service}</td>
                        <td className="px-4 py-2 font-mono text-xs truncate max-w-[200px]">
                          {key.key}
                        </td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{key.source || 'άγνωστη'}</td>
                        <td className="px-4 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Κλειδιά σε Μορφή Κειμένου</CardTitle>
                  <CardDescription>
                    Μπορείτε να αντιγράψετε όλα τα κλειδιά σε μορφή κειμένου
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Textarea 
                    className="font-mono text-xs h-[300px]"
                    value={getKeysAsText()}
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full"
                    onClick={() => copyToClipboard(getKeysAsText())}
                  >
                    {isCopied ? (
                      <>
                        <Check size={16} className="mr-1" />
                        Αντιγράφηκε
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        Αντιγραφή Όλων
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={showRawDialog} onOpenChange={setShowRawDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Προβολή Όλων των Κλειδιών (JSON)</DialogTitle>
                <DialogDescription>
                  Αυτά είναι όλα τα ανακτημένα κλειδιά σε μορφή JSON
                </DialogDescription>
              </DialogHeader>
              <div className="relative">
                <Textarea 
                  className="font-mono text-xs h-[500px] overflow-auto"
                  value={getKeysAsRawJson()}
                  readOnly
                />
                <Button 
                  variant="outline" 
                  className="mt-2 w-full"
                  onClick={() => copyToClipboard(getKeysAsRawJson())}
                >
                  {isCopied ? (
                    <>
                      <Check size={16} className="mr-1" />
                      Αντιγράφηκε
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Αντιγραφή JSON
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
