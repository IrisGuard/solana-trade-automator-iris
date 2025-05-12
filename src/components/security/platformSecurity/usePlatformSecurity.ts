
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface SecuritySettings {
  [key: string]: boolean;
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
    const allEnabled = Object.keys(securitySettings).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {} as SecuritySettings);
    
    setSecuritySettings(allEnabled);
    toast.info("Όλες οι λειτουργίες ασφαλείας ενεργοποιήθηκαν");
  }, [securitySettings]);

  const handleDisableAll = useCallback(() => {
    const allDisabled = Object.keys(securitySettings).reduce((acc, key) => {
      return { ...acc, [key]: false };
    }, {} as SecuritySettings);
    
    setSecuritySettings(allDisabled);
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
