
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Key, Lock, Smartphone, AlertTriangle, Copy, Eye, EyeOff, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
}

const Security = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyService, setNewKeyService] = useState("supabase");
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  
  // Φορτώνει τα κλειδιά από το localStorage κατά την εκκίνηση
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error('Σφάλμα φόρτωσης κλειδιών:', e);
      }
    }
  }, []);
  
  // Αποθήκευση στο localStorage όταν αλλάζουν τα κλειδιά
  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Χειρισμός αντιγραφής κλειδιού
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
      })
      .catch(() => {
        toast.error("Αποτυχία αντιγραφής στο πρόχειρο");
      });
  };

  // Προσθήκη νέου κλειδιού
  const addNewKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Συμπληρώστε όλα τα πεδία");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      service: newKeyService,
      createdAt: new Date().toISOString()
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyService("supabase");
    setShowDialogApiKey(false);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Διαγραφή κλειδιού
  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Εμφάνιση κλειδιού με αστερίσκους
  const maskKey = (key: string) => {
    if (key.length <= 8) return "•".repeat(key.length);
    return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  // Εναλλαγή ορατότητας κλειδιού
  const toggleKeyVisibility = (id: string) => {
    setIsKeyVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Επιλογή εικονιδίου βάσει υπηρεσίας
  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'supabase':
        return '🔷';
      case 'vercel':
        return '▲';
      case 'solana':
        return '◎';
      case 'aws':
        return '☁️';
      default:
        return '🔑';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Πρόσβαση Λογαριασμού</CardTitle>
            </div>
            <CardDescription>Διαχείριση των μεθόδων πρόσβασης στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Αλλαγή Κωδικού Πρόσβασης</p>
                <p className="text-sm text-muted-foreground">Ενημερώθηκε τελευταία φορά πριν από 3 μήνες</p>
              </div>
              <Button variant="outline" size="sm">Αλλαγή</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Πρόσβαση με Email</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <Button variant="outline" size="sm">Επαλήθευση</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Επαλήθευση Δύο Παραγόντων</CardTitle>
            </div>
            <CardDescription>Προσθέστε επιπλέον επίπεδο ασφάλειας στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Επαλήθευση Δύο Παραγόντων</p>
                <p className="text-sm text-muted-foreground">Προστατέψτε το λογαριασμό σας με 2FA</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Εφαρμογή Authenticator</p>
                <p className="text-sm text-muted-foreground">Χρήση Google Authenticator ή παρόμοιας εφαρμογής</p>
              </div>
              <Button variant="outline" size="sm">Ρύθμιση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Επαλήθευση</p>
                <p className="text-sm text-muted-foreground">Λήψη κωδικών μέσω SMS</p>
              </div>
              <Button variant="outline" size="sm">Ρύθμιση</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Νέα κάρτα για την Κλειδοθήκη API */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Κλειδοθήκη API</CardTitle>
            </div>
            <Dialog open={showDialogApiKey} onOpenChange={setShowDialogApiKey}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Νέο Κλειδί
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Προσθήκη Νέου Κλειδιού API</DialogTitle>
                  <DialogDescription>
                    Συμπληρώστε τα στοιχεία του νέου κλειδιού API που θέλετε να αποθηκεύσετε.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Όνομα Κλειδιού</Label>
                    <Input 
                      id="key-name" 
                      placeholder="π.χ. Supabase Production" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key-value">Τιμή Κλειδιού</Label>
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
                        <SelectItem value="other">Άλλο</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialogApiKey(false)}>Ακύρωση</Button>
                  <Button onClick={addNewKey}>Αποθήκευση</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Διαχειριστείτε τα κλειδιά API σας με ασφάλεια</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">Δεν έχετε αποθηκεύσει κανένα κλειδί API ακόμη</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => setShowDialogApiKey(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Προσθήκη Πρώτου Κλειδιού
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getServiceIcon(apiKey.service)}</div>
                    <div>
                      <p className="font-medium">{apiKey.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-secondary p-1 px-2 rounded">
                          {isKeyVisible[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button 
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-muted-foreground hover:text-foreground"
                          title={isKeyVisible[apiKey.id] ? "Απόκρυψη" : "Εμφάνιση"}
                        >
                          {isKeyVisible[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      title="Αντιγραφή"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteKey(apiKey.id)}
                      title="Διαγραφή"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Ασφάλεια Συναλλαγών</CardTitle>
          </div>
          <CardDescription>Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Απαίτηση 2FA για Όλες τις Συναλλαγές</p>
                <p className="text-sm text-muted-foreground">Απαιτεί επαλήθευση για κάθε συναλλαγή</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Επιβεβαίωση Email για Μεγάλες Συναλλαγές</p>
                <p className="text-sm text-muted-foreground">Αποστολή email για συναλλαγές άνω των $1000</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Λίστα Ασφαλών Διευθύνσεων</p>
                <p className="text-sm text-muted-foreground">Επιτρέπει μόνο μεταφορές σε εγκεκριμένες διευθύνσεις</p>
              </div>
              <Button variant="outline" size="sm">Διαχείριση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Περιορισμός Συναλλαγών</p>
                <p className="text-sm text-muted-foreground">Όριο ημερήσιων συναλλαγών: $5000</p>
              </div>
              <Button variant="outline" size="sm">Αλλαγή</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Περίοδοι Σύνδεσης & Συσκευές</CardTitle>
          </div>
          <CardDescription>Διαχειριστείτε τις ενεργές συνδέσεις στο λογαριασμό σας</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">iPhone 13 Pro - Chrome</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Τώρα</p>
                </div>
              </div>
              <p className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Τρέχουσα Συσκευή</p>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Windows 10 - Firefox</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Σήμερα 10:24</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Αποσύνδεση</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">MacBook Pro - Safari</p>
                  <p className="text-sm text-muted-foreground">Athens, Greece • Τελευταία σύνδεση: Χθες 18:35</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Αποσύνδεση</Button>
            </div>
            
            <Button variant="destructive" className="w-full mt-6">
              Αποσύνδεση από Όλες τις Συσκευές
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
