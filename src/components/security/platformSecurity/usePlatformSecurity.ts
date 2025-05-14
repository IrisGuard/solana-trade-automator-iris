
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { securityService, SecuritySettings } from "@/services/securityService";

export interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export function usePlatformSecurity() {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbSecuritySettings, setDbSecuritySettings] = useState<SecuritySettings[]>([]);
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: "rowLevelSecurity",
      name: "Ασφάλεια Επιπέδου Γραμμής",
      description: "Περιορίζει την πρόσβαση σε δεδομένα στους κατάλληλους χρήστες",
      isEnabled: false
    },
    {
      id: "apiKeyEncryption",
      name: "Κρυπτογράφηση API Keys",
      description: "Ασφαλίζει τα API keys με προηγμένη κρυπτογράφηση",
      isEnabled: false
    },
    {
      id: "twoFactorAuth",
      name: "Έλεγχος Ταυτότητας Δύο Παραγόντων",
      description: "Απαιτεί δεύτερο παράγοντα για την επαλήθευση της ταυτότητας",
      isEnabled: false
    },
    {
      id: "transactionLimits",
      name: "Όρια Συναλλαγών",
      description: "Ορίζει μέγιστα ποσά για συναλλαγές",
      isEnabled: false
    },
    {
      id: "approvedAddresses",
      name: "Εγκεκριμένες Διευθύνσεις",
      description: "Περιορίζει τις συναλλαγές σε εγκεκριμένες διευθύνσεις μόνο",
      isEnabled: false
    },
    {
      id: "geoRestrictions",
      name: "Γεωγραφικοί Περιορισμοί",
      description: "Περιορίζει την πρόσβαση με βάση τη γεωγραφική τοποθεσία",
      isEnabled: false
    },
    {
      id: "advancedEmailAuth",
      name: "Προηγμένος Έλεγχος Email",
      description: "Χρησιμοποιεί προηγμένες τεχνικές ελέγχου ταυτότητας μέσω email",
      isEnabled: false
    },
    {
      id: "biometricAuth",
      name: "Βιομετρική Ταυτοποίηση",
      description: "Επιτρέπει τη χρήση βιομετρικών στοιχείων για έλεγχο ταυτότητας",
      isEnabled: false
    },
    {
      id: "socialAuth",
      name: "Κοινωνική Ταυτοποίηση",
      description: "Επιτρέπει την είσοδο μέσω λογαριασμών κοινωνικής δικτύωσης",
      isEnabled: false
    },
    {
      id: "transactionDelays",
      name: "Καθυστερήσεις Συναλλαγών",
      description: "Εισάγει μια καθυστέρηση ασφαλείας στις συναλλαγές μεγάλης αξίας",
      isEnabled: false
    }
  ]);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      const settings = await securityService.getSecuritySettings(user.id);
      setDbSecuritySettings(settings);
      
      // Ενημέρωση καταστάσεων από τη βάση δεδομένων
      if (settings.length > 0) {
        setSecuritySettings(prevSettings => 
          prevSettings.map(setting => {
            const dbSetting = settings.find(s => s.setting_name === setting.id);
            return {
              ...setting,
              isEnabled: dbSetting ? dbSetting.is_enabled : setting.isEnabled
            };
          })
        );
      }
    } catch (error) {
      console.error("Error loading security settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleToggle = useCallback(async (id: string, enabled: boolean) => {
    if (!user?.id) return;
    
    // Ενημέρωση του UI άμεσα
    setSecuritySettings((prev) => 
      prev.map(setting => 
        setting.id === id ? {...setting, isEnabled: enabled} : setting
      )
    );
    
    // Έλεγχος αν η ρύθμιση υπάρχει στη βάση
    const existingSetting = dbSecuritySettings.find(s => s.setting_name === id);
    
    try {
      if (existingSetting) {
        // Ενημέρωση υπάρχουσας ρύθμισης
        await securityService.updateSecuritySetting(existingSetting.id!, enabled);
      } else {
        // Δημιουργία νέας ρύθμισης
        const newSetting = await securityService.createSecuritySetting({
          user_id: user.id,
          setting_name: id,
          is_enabled: enabled
        });
        
        if (newSetting) {
          setDbSecuritySettings(prev => [...prev, newSetting]);
        }
      }
    } catch (error) {
      console.error("Error updating security setting:", error);
      
      // Επαναφορά του UI σε περίπτωση σφάλματος
      setSecuritySettings((prev) => 
        prev.map(setting => 
          setting.id === id ? {...setting, isEnabled: !enabled} : setting
        )
      );
      
      toast.error("Σφάλμα κατά την ενημέρωση της ρύθμισης");
    }
  }, [user?.id, dbSecuritySettings]);

  const handleEnableAll = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    // Ενημέρωση του UI άμεσα
    setSecuritySettings((prev) => 
      prev.map(setting => ({...setting, isEnabled: true}))
    );
    
    try {
      // Δημιουργία ή ενημέρωση όλων των ρυθμίσεων στη βάση
      for (const setting of securitySettings) {
        const existingSetting = dbSecuritySettings.find(s => s.setting_name === setting.id);
        
        if (existingSetting) {
          // Ενημέρωση μόνο αν δεν είναι ήδη ενεργοποιημένη
          if (!existingSetting.is_enabled) {
            await securityService.updateSecuritySetting(existingSetting.id!, true);
          }
        } else {
          // Δημιουργία νέας ρύθμισης
          const newSetting = await securityService.createSecuritySetting({
            user_id: user.id,
            setting_name: setting.id,
            is_enabled: true
          });
          
          if (newSetting) {
            setDbSecuritySettings(prev => [...prev, newSetting]);
          }
        }
      }
      
      toast.success("Όλες οι λειτουργίες ασφαλείας ενεργοποιήθηκαν");
    } catch (error) {
      console.error("Error enabling all security settings:", error);
      toast.error("Σφάλμα κατά την ενεργοποίηση όλων των λειτουργιών");
      
      // Επαναφορτώνουμε τις ρυθμίσεις σε περίπτωση σφάλματος
      loadSettings();
    } finally {
      setIsLoading(false);
    }
  }, [securitySettings, user?.id, dbSecuritySettings]);

  const handleDisableAll = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    // Ενημέρωση του UI άμεσα
    setSecuritySettings((prev) => 
      prev.map(setting => ({...setting, isEnabled: false}))
    );
    
    try {
      // Ενημέρωση όλων των ρυθμίσεων στη βάση
      for (const dbSetting of dbSecuritySettings) {
        if (dbSetting.is_enabled) {
          await securityService.updateSecuritySetting(dbSetting.id!, false);
        }
      }
      
      toast.success("Όλες οι λειτουργίες ασφαλείας απενεργοποιήθηκαν");
    } catch (error) {
      console.error("Error disabling all security settings:", error);
      toast.error("Σφάλμα κατά την απενεργοποίηση όλων των λειτουργιών");
      
      // Επαναφορτώνουμε τις ρυθμίσεις σε περίπτωση σφάλματος
      loadSettings();
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, dbSecuritySettings]);

  const handleSaveSettings = useCallback(async () => {
    if (!user?.id) {
      toast.error("Πρέπει να συνδεθείτε για να αποθηκεύσετε τις ρυθμίσεις");
      return;
    }
    
    // Αποθήκευση των ρυθμίσεων στην τοπική αποθήκευση για offline χρήση
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    
    // Τα δεδομένα έχουν ήδη αποθηκευτεί στο Supabase σε κάθε toggle
    toast.success("Οι ρυθμίσεις ασφαλείας αποθηκεύτηκαν");
  }, [securitySettings, user?.id]);

  return {
    expanded,
    securitySettings,
    toggleExpanded,
    handleToggle,
    handleEnableAll,
    handleDisableAll,
    handleSaveSettings,
    isLoading
  };
}
