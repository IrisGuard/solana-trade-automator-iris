
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export function usePlatformSecurity() {
  const [expanded, setExpanded] = useState(false);
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

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setSecuritySettings((prev) => 
      prev.map(setting => 
        setting.id === id ? {...setting, isEnabled: !setting.isEnabled} : setting
      )
    );
  }, []);

  const handleEnableAll = useCallback(() => {
    setSecuritySettings((prev) => 
      prev.map(setting => ({...setting, isEnabled: true}))
    );
    toast.info("Όλες οι λειτουργίες ασφαλείας ενεργοποιήθηκαν");
  }, []);

  const handleDisableAll = useCallback(() => {
    setSecuritySettings((prev) => 
      prev.map(setting => ({...setting, isEnabled: false}))
    );
    toast.info("Όλες οι λειτουργίες ασφαλείας απενεργοποιήθηκαν");
  }, []);

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
