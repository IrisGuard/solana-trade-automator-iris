
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
    } catch (e) {
      console.error('Σφάλμα φόρτωσης κλειδιών:', e);
      toast.error("Σφάλμα φόρτωσης κλειδιών");
    }
  }
};

// Save keys to localStorage
export const saveKeysToStorage = (
  apiKeys: ApiKey[],
  isEncryptionEnabled: boolean,
  savedMasterPassword: string
) => {
  if (apiKeys.length > 0 || localStorage.getItem('apiKeys')) {
    try {
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
      console.log(`Αποθηκεύτηκαν ${apiKeys.length} κλειδιά στο localStorage`);
    } catch (e) {
      console.error('Σφάλμα αποθήκευσης κλειδιών:', e);
      toast.error("Σφάλμα κατά την αποθήκευση των κλειδιών");
    }
  }
};
