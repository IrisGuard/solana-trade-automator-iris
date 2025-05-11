
import { useState, useEffect } from "react";
import { ApiKey } from "../types";
import { loadKeysFromStorage, saveKeysToStorage } from "../utils";
import { toast } from "sonner";

export function useApiVault() {
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
    // Ensure the key has an ID and createdAt
    const keyWithDefaults = {
      ...newKey,
      id: newKey.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: newKey.createdAt || new Date().toISOString()
    };
    
    setApiKeys(prev => [...prev, keyWithDefaults]);
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
    // Check for duplicates by comparing key values
    const existingKeyValues = new Set(apiKeys.map(key => key.key));
    
    // Filter out keys that already exist
    const newKeys = importedKeys.filter(key => !existingKeyValues.has(key.key));
    
    // Add new keys
    if (newKeys.length > 0) {
      setApiKeys(prev => [...prev, ...newKeys]);
      
      if (newKeys.length !== importedKeys.length) {
        toast.warning(`Προστέθηκαν ${newKeys.length} νέα κλειδιά. ${importedKeys.length - newKeys.length} παραλείφθηκαν ως διπλότυπα.`);
      } else {
        toast.success(`Προστέθηκαν ${newKeys.length} νέα κλειδιά επιτυχώς!`);
      }
    } else if (importedKeys.length > 0) {
      toast.warning("Όλα τα κλειδιά υπάρχουν ήδη στην κλειδοθήκη σας");
    }
  };

  // Get keys filtered by search term and service
  const getFilteredKeys = () => {
    return apiKeys.filter(key => {
      const matchesSearch = 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (key.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterService === 'all' || key.service.toLowerCase() === filterService.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  };

  // Group keys by service
  const getKeysByService = () => {
    const grouped: Record<string, ApiKey[]> = {};
    
    getFilteredKeys().forEach(key => {
      const service = key.service.toLowerCase();
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push(key);
    });
    
    return grouped;
  };

  // Handle unlock - Updated to accept password parameter
  const handleUnlock = (password: string) => {
    if (password === savedMasterPassword) {
      setIsLocked(false);
      setIsUnlocking(false);
      toast.success("Η κλειδοθήκη ξεκλειδώθηκε επιτυχώς");
    } else {
      toast.error("Λάθος κωδικός πρόσβασης");
    }
  };

  // Handle lock vault
  const handleLock = () => {
    setIsLocked(true);
    toast.info("Η κλειδοθήκη κλειδώθηκε");
  };

  return {
    apiKeys,
    showDialogApiKey,
    setShowDialogApiKey,
    showImportDialog,
    setShowImportDialog,
    showExportSheet,
    setShowExportSheet,
    showSettingsDialog,
    setShowSettingsDialog,
    isUnlocking,
    setIsUnlocking,
    isKeyVisible,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    savedMasterPassword,
    setSavedMasterPassword,
    isEncryptionEnabled,
    setIsEncryptionEnabled,
    isLocked,
    setIsLocked,
    isAutoLockEnabled,
    setIsAutoLockEnabled,
    autoLockTimeout,
    setAutoLockTimeout,
    addNewKey,
    deleteKey,
    toggleKeyVisibility,
    handleImport,
    getFilteredKeys,
    getKeysByService,
    handleUnlock,
    handleLock
  };
}
