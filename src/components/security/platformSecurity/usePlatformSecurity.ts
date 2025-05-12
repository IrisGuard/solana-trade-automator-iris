
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface SecuritySettings {
  rowLevelSecurity: boolean;
  apiKeyEncryption: boolean;
  twoFactorAuth: boolean;
  transactionLimits: boolean;
  approvedAddresses: boolean;
  geoRestrictions: boolean;
  advancedEmailAuth: boolean;
  biometricAuth: boolean;
  socialAuth: boolean;
  transactionDelays: boolean;
  [key: string]: boolean; // Add index signature to allow string indexing
}

export function usePlatformSecurity() {
  const [expanded, setExpanded] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    rowLevelSecurity: false,
    apiKeyEncryption: false,
    twoFactorAuth: false,
    transactionLimits: false,
    approvedAddresses: false,
    geoRestrictions: false,
    advancedEmailAuth: false,
    biometricAuth: false,
    socialAuth: false,
    transactionDelays: false,
  });

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleToggle = useCallback((setting: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  }, []);

  const handleEnableAll = useCallback(() => {
    // Create new object with all settings set to true
    const allEnabled = Object.keys(securitySettings).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {} as { [key: string]: boolean });
    
    // Type assertion to SecuritySettings
    setSecuritySettings(allEnabled as SecuritySettings);
    toast.info("Όλες οι λειτουργίες ασφαλείας ενεργοποιήθηκαν");
  }, [securitySettings]);

  const handleDisableAll = useCallback(() => {
    // Create new object with all settings set to false
    const allDisabled = Object.keys(securitySettings).reduce((acc, key) => {
      return { ...acc, [key]: false };
    }, {} as { [key: string]: boolean });
    
    // Type assertion to SecuritySettings
    setSecuritySettings(allDisabled as SecuritySettings);
    toast.info("Όλες οι λειτουργίες ασφαλείας απενεργοποιήθηκαν");
  }, [securitySettings]);

  const handleSaveSettings = useCallback(() => {
    // Εδώ θα μπορούσατε να αποθηκεύσετε τις ρυθμίσεις στο Supabase όταν είναι έτοιμο
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    toast.success("Οι ρυθμίσεις ασφαλείας αποθηκεύτηκαν");
  }, [securitySettings]);

  return {
    expanded,
    securitySettings,
    toggleExpanded,
    handleToggle,
    handleEnableAll,
    handleDisableAll,
    handleSaveSettings
  };
}
