
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Download, Upload, Plus, Shield, Lock, LockIcon } from "lucide-react";
import { ApiKey } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadKeysFromStorage, saveKeysToStorage } from "./utils";
import { ApiKeyFilters } from "./ApiKeyFilters";
import { ApiKeyList } from "./ApiKeyList";
import { ApiKeysByService } from "./ApiKeysByService";
import { NewApiKeyDialog } from "./NewApiKeyDialog";
import { ImportDialog } from "./ImportDialog";
import { ExportSheet } from "./ExportSheet";
import { SecuritySettingsDialog } from "./SecuritySettingsDialog";
import { UnlockDialog } from "./UnlockDialog";
import { LockedVaultState } from "./LockedVaultState";
import { EmptyVaultState } from "./EmptyVaultState";
import { toast } from "sonner";

export const ApiVaultCard = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showDialogApiKey, setShowDialogApiKey] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [savedMasterPassword, setSavedMasterPassword] = useState("");
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAutoLockEnabled, setIsAutoLockEnabled] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(30); // minutes

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
    loadKeysFromStorage(isEncryptionEnabled, savedMasterPassword, setApiKeys, setIsLocked);
  }, [isEncryptionEnabled, savedMasterPassword]);

  // Save keys to localStorage
  useEffect(() => {
    saveKeysToStorage(apiKeys, isEncryptionEnabled, savedMasterPassword);
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

  // Add new key
  const addNewKey = (newKey: ApiKey) => {
    setApiKeys([...apiKeys, newKey]);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Delete key
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

  // Handle bulk import
  const handleImport = (importedKeys: ApiKey[]) => {
    setApiKeys([...apiKeys, ...importedKeys]);
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

  // Handle unlock
  const handleUnlock = () => {
    setIsLocked(false);
  };

  // Handle lock vault
  const handleLock = () => {
    setIsLocked(true);
    toast.info("Η κλειδοθήκη κλειδώθηκε");
  };

  return (
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExportSheet(true)}
                >
                  <Download className="mr-1 h-4 w-4" />
                  Εξαγωγή
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowImportDialog(true)}
                >
                  <Upload className="mr-1 h-4 w-4" />
                  Εισαγωγή
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSettingsDialog(true)}
                >
                  <Shield className="mr-1 h-4 w-4" />
                  Ρυθμίσεις
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setShowDialogApiKey(true)}
                >
                  <Plus className="h-4 w-4" />
                  Νέο Κλειδί
                </Button>
              </>
            )}
          </div>
        </div>
        <CardDescription>Διαχειριστείτε τα κλειδιά API σας με ασφάλεια</CardDescription>
      </CardHeader>
      <CardContent>
        {isLocked ? (
          <LockedVaultState onUnlockClick={() => setIsUnlocking(true)} />
        ) : apiKeys.length === 0 ? (
          <EmptyVaultState onAddKeyClick={() => setShowDialogApiKey(true)} />
        ) : (
          <div className="space-y-4">
            <ApiKeyFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterService={filterService}
              setFilterService={setFilterService}
            />
            
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">Λίστα</TabsTrigger>
                <TabsTrigger value="groups">Ανά Υπηρεσία</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4">
                <ApiKeyList 
                  apiKeys={getFilteredKeys()}
                  isKeyVisible={isKeyVisible}
                  toggleKeyVisibility={toggleKeyVisibility}
                  deleteKey={deleteKey}
                />
              </TabsContent>
              
              <TabsContent value="groups" className="space-y-6">
                <ApiKeysByService 
                  keysByService={getKeysByService()}
                  isKeyVisible={isKeyVisible}
                  toggleKeyVisibility={toggleKeyVisibility}
                  deleteKey={deleteKey}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Dialogs and Sheets */}
        <NewApiKeyDialog 
          open={showDialogApiKey}
          onOpenChange={setShowDialogApiKey}
          addKey={addNewKey}
        />

        <ImportDialog 
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImport={handleImport}
        />

        <ExportSheet 
          open={showExportSheet}
          onOpenChange={setShowExportSheet}
          apiKeys={apiKeys}
        />

        <SecuritySettingsDialog 
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
          isEncryptionEnabled={isEncryptionEnabled}
          setIsEncryptionEnabled={setIsEncryptionEnabled}
          savedMasterPassword={savedMasterPassword}
          setSavedMasterPassword={setSavedMasterPassword}
          isAutoLockEnabled={isAutoLockEnabled}
          setIsAutoLockEnabled={setIsAutoLockEnabled}
          autoLockTimeout={autoLockTimeout}
          setAutoLockTimeout={setAutoLockTimeout}
        />

        <UnlockDialog 
          open={isUnlocking}
          onOpenChange={setIsUnlocking}
          savedMasterPassword={savedMasterPassword}
          onUnlock={handleUnlock}
        />
      </CardContent>
    </Card>
  );
};
