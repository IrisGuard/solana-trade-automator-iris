
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { loadKeysFromStorage, saveKeysToStorage } from "../utils";
import { ApiKey } from "../types";

export interface SecuritySettings {
  isEncryptionEnabled: boolean;
  savedMasterPassword: string;
  isLocked: boolean;
  isAutoLockEnabled: boolean;
  autoLockTimeout: number;
}

export interface VaultSecurityProps {
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export function useVaultSecurity({ apiKeys, setApiKeys }: VaultSecurityProps) {
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [savedMasterPassword, setSavedMasterPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isAutoLockEnabled, setIsAutoLockEnabled] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(30); // minutes
  const [isUnlocking, setIsUnlocking] = useState(false);

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
  }, [isEncryptionEnabled, savedMasterPassword, setApiKeys]);

  // Save keys to localStorage when they change
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
      
      if (isAutoLockEnabled && !isLocked && isEncryptionEnabled && savedMasterPassword) {
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
  }, [isAutoLockEnabled, autoLockTimeout, isLocked, isEncryptionEnabled, savedMasterPassword]);

  // Save security settings when they change
  const saveSecuritySettings = useCallback(() => {
    localStorage.setItem('encryption-enabled', isEncryptionEnabled.toString());
    localStorage.setItem('master-password', savedMasterPassword);
    localStorage.setItem('auto-lock-enabled', isAutoLockEnabled.toString());
    localStorage.setItem('auto-lock-timeout', autoLockTimeout.toString());
    
    // If encryption is disabled, make sure the vault is unlocked
    if (!isEncryptionEnabled) {
      setIsLocked(false);
    }
    
    // If encryption is enabled without a password, show a warning
    if (isEncryptionEnabled && !savedMasterPassword) {
      toast.warning("Προσοχή: Η κρυπτογράφηση είναι ενεργοποιημένη χωρίς κωδικό!");
    }
    
    // Re-save the API keys with the new encryption setting
    saveKeysToStorage(apiKeys, isEncryptionEnabled, savedMasterPassword);
    
    toast.success("Οι ρυθμίσεις ασφαλείας αποθηκεύτηκαν");
  }, [isEncryptionEnabled, savedMasterPassword, isAutoLockEnabled, autoLockTimeout, apiKeys]);

  // Handle unlock
  const handleUnlock = (password: string) => {
    if (password === savedMasterPassword) {
      setIsLocked(false);
      setIsUnlocking(false);
      
      // We don't need to show a toast here as it's handled in the UnlockDialog component
    } else {
      // We don't need to show a toast here as it's handled in the UnlockDialog component
    }
  };

  // Handle lock vault
  const handleLock = () => {
    if (isEncryptionEnabled && savedMasterPassword) {
      setIsLocked(true);
      toast.info("Η κλειδοθήκη κλειδώθηκε");
    } else {
      toast.warning("Δεν μπορείτε να κλειδώσετε την κλειδοθήκη χωρίς κρυπτογράφηση");
    }
  };

  return {
    isEncryptionEnabled,
    setIsEncryptionEnabled,
    savedMasterPassword,
    setSavedMasterPassword,
    isLocked,
    setIsLocked,
    isAutoLockEnabled,
    setIsAutoLockEnabled,
    autoLockTimeout,
    setAutoLockTimeout,
    isUnlocking,
    setIsUnlocking,
    handleUnlock,
    handleLock,
    saveSecuritySettings
  };
}
