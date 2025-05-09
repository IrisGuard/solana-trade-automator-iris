import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Key, Lock, Smartphone, AlertTriangle, Copy, Eye, EyeOff, Plus, Trash, Download, Upload, Search, Filter, LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CryptoJS from "crypto-js";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  expires?: string;
}

const Security = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyService, setNewKeyService] = useState("supabase");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyExpires, setNewKeyExpires] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  const [importData, setImportData] = useState("");
  const [importFormat, setImportFormat] = useState("json");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [masterPassword, setMasterPassword] = useState("");
  const [savedMasterPassword, setSavedMasterPassword] = useState("");
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(30); // minutes
  const [isAutoLockEnabled, setIsAutoLockEnabled] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedEncryptionSetting = localStorage.getItem('encryption-enabled');
    if (savedEncryptionSetting) {
      setIsEncryptionEnabled(savedEncryptionSetting === 'true');
    }
    
    const savedMasterPwd = localStorage.getItem('master-password');
    if (savedMasterPwd) {
      setSavedMasterPassword(savedMasterPwd);
    }
    
    const savedAutoLockSetting = localStorage.getItem('auto-lock-enabled');
    if (savedAutoLockSetting) {
      setIsAutoLockEnabled(savedAutoLockSetting === 'true');
    }
    
    const savedAutoLockTime = localStorage.getItem('auto-lock-timeout');
    if (savedAutoLockTime) {
      setAutoLockTimeout(parseInt(savedAutoLockTime, 10));
    }
  }, []);

  // Load keys from localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      try {
        let parsedKeys;
        
        if (isEncryptionEnabled && savedMasterPassword) {
          try {
            // Try to decrypt
            const decrypted = CryptoJS.AES.decrypt(savedKeys, savedMasterPassword).toString(CryptoJS.enc.Utf8);
            if (decrypted) {
              parsedKeys = JSON.parse(decrypted);
              setIsLocked(false);
            } else {
              setIsLocked(true);
              return;
            }
          } catch (e) {
            console.error('Σφάλμα αποκρυπτογράφησης:', e);
            setIsLocked(true);
            return;
          }
        } else {
          parsedKeys = JSON.parse(savedKeys);
        }
        
        setApiKeys(parsedKeys);
        setIsLocked(false);
      } catch (e) {
        console.error('Σφάλμα φόρτωσης κλειδιών:', e);
        toast.error("Σφάλμα φόρτωσης κλειδιών");
      }
    }
  }, [isEncryptionEnabled, savedMasterPassword]);

  // Save keys to localStorage
  useEffect(() => {
    if (apiKeys.length > 0 || localStorage.getItem('apiKeys')) {
      let dataToStore;
      
      if (isEncryptionEnabled && savedMasterPassword) {
        // Encrypt data
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(apiKeys),
          savedMasterPassword
        ).toString();
        dataToStore = encrypted;
      } else {
        dataToStore = JSON.stringify(apiKeys);
      }
      
      localStorage.setItem('apiKeys', dataToStore);
    }
  }, [apiKeys, isEncryptionEnabled, savedMasterPassword]);

  // Auto-lock functionality
  useEffect(() => {
    let lockTimer: number | null = null;
    
    const resetTimer = () => {
      if (lockTimer) {
        window.clearTimeout(lockTimer);
        lockTimer = null;
      }
      
      if (isAutoLockEnabled && !isLocked) {
        lockTimer = window.setTimeout(() => {
          setIsLocked(true);
          toast.info("Η κλειδοθήκη κλειδώθηκε λόγω αδράνειας");
        }, autoLockTimeout * 60 * 1000); // Convert minutes to milliseconds
      }
    };
    
    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
    
    // Initialize the timer
    resetTimer();
    
    // Cleanup
    return () => {
      if (lockTimer) window.clearTimeout(lockTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [isAutoLockEnabled, autoLockTimeout, isLocked]);

  // Handle copying key
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
      })
      .catch(() => {
        toast.error("Αποτυχία αντιγραφής στο πρόχειρο");
      });
  };

  // Add new key
  const addNewKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      service: newKeyService,
      createdAt: new Date().toISOString(),
      description: newKeyDescription || undefined,
      expires: newKeyExpires || undefined
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyService("supabase");
    setNewKeyDescription("");
    setNewKeyExpires("");
    setShowDialogApiKey(false);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Delete key with confirmation
  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Toggle key visibility
  const toggleKeyVisibility = (id: string) => {
    setIsKeyVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format key display
  const maskKey = (key: string) => {
    if (key.length <= 8) return "•".repeat(key.length);
    return `${key.substring(0, 4)}${"•".repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  // Select service icon
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
      case 'github':
        return '🐙';
      case 'stripe':
        return '💳';
      case 'openai':
        return '🤖';
      case 'firebase':
        return '🔥';
      default:
        return '🔑';
    }
  };

  // Get keys filtered by search term and service
  const getFilteredKeys = () => {
    return apiKeys.filter(key => {
      const matchesSearch = 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.key.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterService === 'all' || key.service === filterService;
      
      return matchesSearch && matchesFilter;
    });
  };

  // Group keys by service
  const getKeysByService = () => {
    const grouped: Record<string, ApiKey[]> = {};
    
    getFilteredKeys().forEach(key => {
      if (!grouped[key.service]) {
        grouped[key.service] = [];
      }
      grouped[key.service].push(key);
    });
    
    return grouped;
  };

  // Handle bulk import
  const handleImport = () => {
    try {
      let importedKeys: ApiKey[] = [];
      
      if (importFormat === 'json') {
        const parsed = JSON.parse(importData);
        
        // Check if it's an array of objects with the required properties
        if (Array.isArray(parsed) && parsed.every(item => 
          typeof item === 'object' && item !== null && 'name' in item && 'key' in item
        )) {
          importedKeys = parsed.map(item => ({
            id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: item.name,
            key: item.key,
            service: item.service || 'other',
            createdAt: item.createdAt || new Date().toISOString(),
            description: item.description,
            expires: item.expires
          }));
        } else {
          toast.error("Μη έγκυρη μορφή JSON");
          return;
        }
      } else if (importFormat === 'text') {
        // Format: name|key|service|description (optional)
        const lines = importData.trim().split('\n');
        importedKeys = lines.map(line => {
          const parts = line.split('|');
          return {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: parts[0].trim(),
            key: parts[1].trim(),
            service: parts[2]?.trim() || 'other',
            createdAt: new Date().toISOString(),
            description: parts[3]?.trim(),
            expires: parts[4]?.trim()
          };
        });
      }
      
      if (importedKeys.length > 0) {
        setApiKeys([...apiKeys, ...importedKeys]);
        setShowImportDialog(false);
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

  // Handle export keys
  const handleExport = (format: 'json' | 'text') => {
    try {
      let exportData = '';
      
      if (format === 'json') {
        exportData = JSON.stringify(apiKeys, null, 2);
      } else if (format === 'text') {
        exportData = apiKeys.map(key => 
          `${key.name}|${key.key}|${key.service}|${key.description || ''}|${key.expires || ''}`
        ).join('\n');
      }
      
      const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `api-keys-export-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Τα κλειδιά εξήχθησαν με επιτυχία");
    } catch (e) {
      console.error('Σφάλμα εξαγωγής:', e);
      toast.error("Σφάλμα κατά την εξαγωγή κλειδιών");
    }
  };

  // Save security settings
  const saveSecuritySettings = () => {
    if (isEncryptionEnabled && !masterPassword && !savedMasterPassword) {
      toast.error("Πρέπει να ορίσετε κύριο κωδικό για την κρυπτογράφηση");
      return;
    }
    
    if (masterPassword) {
      setSavedMasterPassword(masterPassword);
      localStorage.setItem('master-password', masterPassword);
    }
    
    localStorage.setItem('encryption-enabled', String(isEncryptionEnabled));
    localStorage.setItem('auto-lock-enabled', String(isAutoLockEnabled));
    localStorage.setItem('auto-lock-timeout', String(autoLockTimeout));
    
    setShowSettingsDialog(false);
    setMasterPassword("");
    toast.success("Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία");
    
    // Force reload of keys if encryption was just enabled
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys && isEncryptionEnabled !== (localStorage.getItem('encryption-enabled') === 'true')) {
      window.location.reload();
    }
  };

  // Unlock the vault
  const handleUnlock = () => {
    if (unlockPassword === savedMasterPassword) {
      setIsLocked(false);
      setUnlockPassword("");
      setIsUnlocking(false);
      toast.success("Η κλειδοθήκη ξεκλείδωθηκε με επιτυχία");
    } else {
      toast.error("Λάθος κωδικός πρόσβασης");
    }
  };

  // Handle lock vault
  const handleLock = () => {
    setIsLocked(true);
    toast.info("Η κλειδοθήκη κλειδώθηκε");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Account Access Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Πρόσβαση Λογαριασμού</CardTitle>
            </div>
            <CardDescription>Διαχείριση των μεθόδων πρόσβασης στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... keep existing code (account access options) */}
          </CardContent>
        </Card>
        
        {/* Two-Factor Authentication Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Επαλήθευση Δύο Παραγόντων</CardTitle>
            </div>
            <CardDescription>Προσθέστε επιπλέον επίπεδο ασφάλειας στο λογαριασμό σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... keep existing code (2FA options) */}
          </CardContent>
        </Card>
      </div>

      {/* API Key Vault Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Κλειδοθήκη API</CardTitle>
            </div>
            <div className="flex gap-2">
              {isLocked ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsUnlocking(true)}
                >
                  <LockIcon className="mr-1 h-4 w-4" />
                  Ξεκλείδωμα
                </Button>
              ) : (
                <>
                  {isEncryptionEnabled && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLock}
                    >
                      <Lock className="mr-1 h-4 w-4" />
                      Κλείδωμα
                    </Button>
                  )}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Εξαγωγή
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Εξαγωγή Κλειδιών API</SheetTitle>
                        <SheetDescription>
                          Επιλέξτε μορφή για την εξαγωγή των κλειδιών σας
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Διαθέσιμες μορφές:</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              onClick={() => handleExport('json')}
                              className="flex-1"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Εξαγωγή ως JSON
                            </Button>
                            <Button 
                              onClick={() => handleExport('text')}
                              className="flex-1"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Εξαγωγή ως Text
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Upload className="mr-1 h-4 w-4" />
                        Εισαγωγή
                      </Button>
                    </DialogTrigger>
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
                        <Button variant="outline" onClick={() => setShowImportDialog(false)}>Ακύρωση</Button>
                        <Button onClick={handleImport}>Εισαγωγή</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Shield className="mr-1 h-4 w-4" />
                        Ρυθμίσεις
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ρυθμίσεις Ασφαλείας Κλειδοθήκης</DialogTitle>
                        <DialogDescription>
                          Διαμορφώστε τις ρυθμίσεις ασφαλείας της κλειδοθήκης σας
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Κρυπτογράφηση</p>
                            <p className="text-sm text-muted-foreground">Κρυπτογράφηση των αποθηκευμένων κλειδιών</p>
                          </div>
                          <Switch 
                            checked={isEncryptionEnabled}
                            onCheckedChange={setIsEncryptionEnabled}
                          />
                        </div>
                        
                        {isEncryptionEnabled && (
                          <div className="space-y-2">
                            <Label htmlFor="master-password">Κύριος Κωδικός</Label>
                            <Input 
                              id="master-password" 
                              type="password" 
                              placeholder={savedMasterPassword ? "••••••••" : "Ορισμός κύριου κωδικού"} 
                              value={masterPassword}
                              onChange={(e) => setMasterPassword(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              {savedMasterPassword 
                                ? "Αφήστε κενό για να διατηρήσετε τον τρέχοντα κωδικό" 
                                : "Αυτός ο κωδικός θα χρησιμοποιείται για την κρυπτογράφηση των κλειδιών σας"}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Αυτόματο Κλείδωμα</p>
                            <p className="text-sm text-muted-foreground">Κλείδωμα κλειδοθήκης μετά από αδράνεια</p>
                          </div>
                          <Switch 
                            checked={isAutoLockEnabled}
                            onCheckedChange={setIsAutoLockEnabled}
                          />
                        </div>
                        
                        {isAutoLockEnabled && (
                          <div className="space-y-2">
                            <Label htmlFor="lock-timeout">Χρονικό διάστημα αδράνειας (λεπτά)</Label>
                            <Select 
                              value={autoLockTimeout.toString()} 
                              onValueChange={(v) => setAutoLockTimeout(parseInt(v, 10))}
                            >
                              <SelectTrigger id="lock-timeout">
                                <SelectValue placeholder="Επιλέξτε διάστημα" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 λεπτό</SelectItem>
                                <SelectItem value="5">5 λεπτά</SelectItem>
                                <SelectItem value="15">15 λεπτά</SelectItem>
                                <SelectItem value="30">30 λεπτά</SelectItem>
                                <SelectItem value="60">1 ώρα</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>Ακύρωση</Button>
                        <Button onClick={saveSecuritySettings}>Αποθήκευση</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                              <SelectItem value="other">Άλλο</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="key-description">Περιγραφή</Label>
                          <Input 
                            id="key-description" 
                            placeholder="Προαιρετική περιγραφή" 
                            value={newKeyDescription}
                            onChange={(e) => setNewKeyDescription(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="key-expires">Ημερομηνία Λήξης</Label>
                          <Input 
                            id="key-expires" 
                            type="date"
                            value={newKeyExpires}
                            onChange={(e) => setNewKeyExpires(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialogApiKey(false)}>Ακύρωση</Button>
                        <Button onClick={addNewKey}>Αποθήκευση</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
          <CardDescription>Διαχειριστείτε τα κλειδιά API σας με ασφάλεια</CardDescription>
        </CardHeader>
        <CardContent>
          {isLocked ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LockIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-4">Η κλειδοθήκη είναι κλειδωμένη</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Εισάγετε τον κύριο κωδικό σας για να αποκτήσετε πρόσβαση στα κλειδιά σας
              </p>
              
              <Dialog open={isUnlocking} onOpenChange={setIsUnlocking}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ξεκλείδωμα Κλειδοθήκης</DialogTitle>
                    <DialogDescription>
                      Εισάγετε τον κύριο κωδικό για πρόσβαση στα κλειδιά σας
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="unlock-password">Κύριος Κωδικός</Label>
                      <Input 
                        id="unlock-password" 
                        type="password" 
                        placeholder="Εισαγωγή κωδικού" 
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsUnlocking(false)}
                    >
                      Ακύρωση
                    </Button>
                    <Button 
                      onClick={handleUnlock}
                      className="sm:ml-auto"
                    >
                      Ξεκλείδωμα
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button onClick={() => setIsUnlocking(true)}>
                <LockIcon className="mr-2 h-4 w-4" />
                Ξεκλείδωμα Κλειδοθήκης
              </Button>
            </div>
          ) : apiKeys.length === 0 ? (
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
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Αναζήτηση κλειδιών..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  value={filterService} 
                  onValueChange={setFilterService}
                >
                  <SelectTrigger className="sm:w-[180px]">
                    <SelectValue placeholder="Όλες οι υπηρεσίες" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλες οι υπηρεσίες</SelectItem>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="vercel">Vercel</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="firebase">Firebase</SelectItem>
                    <SelectItem value="other">Άλλες</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="list">Λίστα</TabsTrigger>
                  <TabsTrigger value="groups">Ανά Υπηρεσία</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="space-y-4">
                  {getFilteredKeys().length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Δεν βρέθηκαν κλειδιά με τα τρέχοντα φίλτρα</p>
                    </div>
                  ) : (
                    getFilteredKeys().map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getServiceIcon(apiKey.service)}</div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{apiKey.name}</p>
                              {apiKey.expires && new Date(apiKey.expires) < new Date() && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Ληγμένο</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-sm bg-secondary p-1 px-2 rounded flex-1 min-w-0 truncate">
                                {isKeyVisible[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                              </code>
                              <button 
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                className="text-muted-foreground hover:text-foreground"
                                title={isKeyVisible[apiKey.id] ? "Απ��κρυψη" : "Εμφάνιση"}
                              >
                                {isKeyVisible[apiKey.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {apiKey.description && (
                              <p className="text-sm text-muted-foreground truncate">{apiKey.description}</p>
                            )}
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                title="Διαγραφή"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Διαγραφή Κλειδιού</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Είστε βέβαιοι ότι θέλετε να διαγράψετε το κλειδί "{apiKey.name}";<br />
                                  Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteKey(apiKey.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Διαγραφή
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="groups" className="space-y-6">
                  {Object.keys(getKeysByService()).length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Δεν βρέθηκαν κλειδιά με τα τρέχοντα φίλτρα</p>
                    </div>
                  ) : (
                    Object.entries(getKeysByService()).map(([service, keys]) => (
                      <div key={service} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="text-xl">{getServiceIcon(service)}</div>
                          <h3 className="font-semibold capitalize">{service}</h3>
                          <div className="ml-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                            {keys.length}
                          </div>
                        </div>
                        <div className="space-y-2 pl-8">
                          {keys.map((apiKey) => (
                            <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{apiKey.name}</p>
                                  {apiKey.expires && new Date(apiKey.expires) < new Date() && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Ληγμένο</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <code className="text-sm bg-secondary p-1 px-2 rounded flex-1 min-w-0 truncate">
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
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(apiKey.key)}
                                  title="Αντιγραφή"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      title="Διαγραφή"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Διαγραφή Κλειδιού</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Είστε βέβαιοι ότι θέλετε να διαγράψετε το κλειδί "{apiKey.name}";<br />
                                        Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => deleteKey(apiKey.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Διαγραφή
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Ασφάλεια Συναλλαγών</CardTitle>
          </div>
          <CardDescription>Ελέγξτε τις ρυθμίσεις ασφαλείας των συναλλαγών σας</CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... keep existing code (transaction security options) */}
        </CardContent>
      </Card>

      {/* Login Sessions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Περίοδοι Σύνδεσης & Συσκευές</CardTitle>
          </div>
          <CardDescription>Διαχειριστείτε τις ενεργές συνδέσεις στο λογαριασμό σας</CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... keep existing code (sessions and devices) */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
