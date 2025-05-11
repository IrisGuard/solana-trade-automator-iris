
import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { ApiKey } from "../types";

// Load keys from localStorage
export const loadKeysFromStorage = (
  isEncryptionEnabled: boolean, 
  savedMasterPassword: string,
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
            console.log('Επιτυχής αποκρυπτογράφηση και φόρτωση κλειδιών');
          } else {
            setIsLocked(true);
            console.log('Αποτυχία αποκρυπτογράφησης, κλειδοθήκη κλειδωμένη');
            return;
          }
        } catch (e) {
          console.error('Σφάλμα αποκρυπτογράφησης:', e);
          // Αν αποτύχει η αποκρυπτογράφηση, δοκιμάζουμε να διαβάσουμε τα κλειδιά ως μη κρυπτογραφημένα
          try {
            parsedKeys = JSON.parse(savedKeys);
            console.log('Βρέθηκαν μη κρυπτογραφημένα κλειδιά μετά από αποτυχία αποκρυπτογράφησης');
            setIsLocked(false);
          } catch {
            setIsLocked(true);
            console.log('Δεν ήταν δυνατή η ανάγνωση των κλειδιών ως μη κρυπτογραφημένα');
            return;
          }
        }
      } else {
        try {
          parsedKeys = JSON.parse(savedKeys);
          console.log('Επιτυχής φόρτωση μη κρυπτογραφημένων κλειδιών');
        } catch (e) {
          // Σε περίπτωση που το αποθηκευμένο είναι κρυπτογραφημένο αλλά δεν έχει ενεργοποιηθεί η κρυπτογράφηση
          console.log('Δοκιμή αποκρυπτογράφησης καθώς απέτυχε η φόρτωση ως μη κρυπτογραφημένα');
          if (savedMasterPassword) {
            try {
              const decrypted = CryptoJS.AES.decrypt(savedKeys, savedMasterPassword).toString(CryptoJS.enc.Utf8);
              if (decrypted) {
                parsedKeys = JSON.parse(decrypted);
                setIsLocked(false);
                console.log('Επιτυχής αποκρυπτογράφηση κλειδιών μετά από δοκιμή');
              } else {
                setIsLocked(true);
                console.error('Αποτυχία αποκρυπτογράφησης μετά από δοκιμή');
                return;
              }
            } catch (e) {
              console.error('Τελική αποτυχία φόρτωσης κλειδιών:', e);
              setIsLocked(false);
              return;
            }
          } else {
            console.error('Αποτυχία φόρτωσης κλειδιών και δεν υπάρχει διαθέσιμο master password:', e);
            toast.error("Δεν ήταν δυνατή η φόρτωση των κλειδιών. Το αποθηκευμένο αρχείο ενδέχεται να είναι κατεστραμμένο.");
            return;
          }
        }
      }
      
      // Ensure all keys have the required fields
      const validKeys = parsedKeys.filter((key: any) => key && key.name && key.service && key.key)
        .map((key: ApiKey) => ({
          ...key,
          id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: key.createdAt || new Date().toISOString()
        }));
      
      setApiKeys(validKeys);
      setIsLocked(false);
      
      if (parsedKeys.length !== validKeys.length) {
        console.warn(`${parsedKeys.length - validKeys.length} κλειδιά αγνοήθηκαν λόγω μη έγκυρης μορφής`);
      }
      
      console.log(`Φορτώθηκαν ${validKeys.length} κλειδιά από το localStorage`);
      
      if (validKeys.length === 0) {
        toast.warning("Δεν βρέθηκαν έγκυρα κλειδιά στην κλειδοθήκη");
      }
    } catch (e) {
      console.error('Σφάλμα φόρτωσης κλειδιών:', e);
      toast.error("Σφάλμα φόρτωσης κλειδιών");
    }
  } else {
    console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά στο localStorage');
  }
};

// Save keys to localStorage
export const saveKeysToStorage = (
  apiKeys: ApiKey[],
  isEncryptionEnabled: boolean,
  savedMasterPassword: string
) => {
  try {
    let dataToStore;
    
    if (isEncryptionEnabled && savedMasterPassword) {
      // Encrypt data
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(apiKeys),
        savedMasterPassword
      ).toString();
      dataToStore = encrypted;
      console.log('Τα κλειδιά αποθηκεύτηκαν κρυπτογραφημένα');
    } else {
      dataToStore = JSON.stringify(apiKeys);
      console.log('Τα κλειδιά αποθηκεύτηκαν χωρίς κρυπτογράφηση');
    }
    
    localStorage.setItem('apiKeys', dataToStore);
    console.log(`Αποθηκεύτηκαν ${apiKeys.length} κλειδιά στο localStorage`);
  } catch (e) {
    console.error('Σφάλμα αποθήκευσης κλειδιών:', e);
    toast.error("Σφάλμα κατά την αποθήκευση των κλειδιών");
  }
};

// Clear all API keys
export const clearKeysFromStorage = () => {
  try {
    localStorage.removeItem('apiKeys');
    console.log('Όλα τα κλειδιά διαγράφηκαν από το localStorage');
    return true;
  } catch (e) {
    console.error('Σφάλμα κατά τη διαγραφή των κλειδιών:', e);
    toast.error('Σφάλμα κατά τη διαγραφή των κλειδιών');
    return false;
  }
};
