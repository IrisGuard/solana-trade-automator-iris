
import { useState, useEffect } from "react";
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

  // Handle unlock
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
    handleLock
  };
}
