import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { ApiKey } from "../types";

// Διαγνωστικό βοηθητικό εργαλείο για την εντόπιση όλων των κλειδιών στο localStorage
export const diagnosticScanStorage = () => {
  console.log('Διαγνωστική σάρωση localStorage:');
  
  let foundApiKeys = false;
  const apiKeyLikeItems = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Έλεγχος αν το περιεχόμενο μοιάζει με JSON
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          const parsed = JSON.parse(value);
          
          // Έλεγχος αν είναι πίνακας από αντικείμενα που μπορεί να είναι κλειδιά API
          if (Array.isArray(parsed) && parsed.length > 0 && 
              parsed[0] && typeof parsed[0] === 'object' &&
              (parsed[0].key || parsed[0].apiKey || parsed[0].token || parsed[0].secret || parsed[0].value)) {
            console.log(`Πιθανά API κλειδιά βρέθηκαν στο localStorage[${key}], αριθμός: ${parsed.length}`);
            apiKeyLikeItems.push({ 
              storageKey: key, 
              count: parsed.length,
              sample: parsed.slice(0, 3),
            });
            foundApiKeys = true;
          }
        } catch (e) {
          // Αγνοούμε σφάλματα ανάλυσης JSON
        }
      }
    } catch (e) {
      console.error(`Σφάλμα ανάγνωσης localStorage[${key}]:`, e);
    }
  }
  
  if (foundApiKeys) {
    console.log('Βρέθηκαν πιθανές αποθηκεύσεις κλειδιών API:', apiKeyLikeItems);
    return apiKeyLikeItems;
  } else {
    console.log('Δεν βρέθηκαν πιθανά κλειδιά API στο localStorage');
    return [];
  }
};

// Νέα λειτουργία για ανάκτηση κλειδιών από όλες τις πιθανές αποθηκεύσεις
export const recoverAllApiKeys = (): { 
  recoveredKeys: ApiKey[], 
  locations: { storageKey: string, count: number }[] 
} => {
  const allRecoveredKeys: ApiKey[] = [];
  const recoveryLocations: { storageKey: string, count: number }[] = [];
  
  // Όλα τα πιθανά ονόματα κλειδιών αποθήκευσης
  const potentialStorageKeys = [
    'apiKeys',
    'api-keys', 
    'apikeyvault', 
    'secure-api-keys',
    'user-api-keys',
    'walletApiKeys',
    'applicationKeys',
    'devKeys',
    'serviceKeys',
    'keys',
    'apiTokens',
    'credentials',
    'secretKeys',
    'serviceTokens',
    'developerKeys',
    'api_keys',
    'externalKeys',
    'platformIntegrations',
    'integrationKeys',
    'thirdPartyTokens'
  ];

  // Σάρωση όλων των αποθηκευτικών χώρων
  for (const storageKey of potentialStorageKeys) {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) continue;
    
    try {
      // Προσπάθεια ανάλυσης ως απλό JSON
      let parsedData;
      try {
        parsedData = JSON.parse(storedData);
      } catch (e) {
        // Προσπάθεια αποκρυπτογράφησης με γνωστά κλειδιά και μετά ανάλυση
        const commonPasswords = ['password', '123456', 'admin', 'master', 'apikey'];
        let decryptedData = null;
        
        for (const pass of commonPasswords) {
          try {
            const decrypted = CryptoJS.AES.decrypt(storedData, pass).toString(CryptoJS.enc.Utf8);
            if (decrypted && (decrypted.startsWith('[') || decrypted.startsWith('{'))) {
              parsedData = JSON.parse(decrypted);
              console.log(`Επιτυχής αποκρυπτογράφηση του ${storageKey} με κλειδί "${pass}"`);
              break;
            }
          } catch (decryptError) {
            // Απλά συνεχίζουμε στο επόμενο password
          }
        }
        
        if (!parsedData) {
          console.log(`Αποτυχία ανάλυσης/αποκρυπτογράφησης του ${storageKey}`);
          continue;
        }
      }
      
      if (!Array.isArray(parsedData)) {
        console.log(`Το ${storageKey} δεν περιέχει πίνακα`);
        continue;
      }
      
      // Φιλτράρισμα και μετατροπή σε τυποποιημένη μορφή ApiKey
      const validKeys = parsedData
        .filter(item => item && typeof item === 'object')
        .map(item => {
          const keyValue = item.key || item.apiKey || item.token || item.secret || item.value || '';
          const keyName = item.name || item.title || item.label || item.description || 'Ανακτημένο κλειδί';
          const keyService = item.service || item.provider || item.platform || item.type || 'other';
          
          if (!keyValue || !keyName) return null;
          
          return {
            id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: keyName,
            key: keyValue,
            service: keyService,
            createdAt: item.createdAt || item.created || new Date().toISOString(),
            description: item.description || item.notes || '',
            isWorking: typeof item.isWorking === 'boolean' ? item.isWorking : undefined,
            status: item.status || 'active',
            expires: item.expires || item.expiry || '',
            source: storageKey // Προσθήκη πηγής ανάκτησης
          };
        })
        .filter((key): key is ApiKey => key !== null);
      
      if (validKeys.length > 0) {
        console.log(`Ανακτήθηκαν ${validKeys.length} κλειδιά από το ${storageKey}`);
        allRecoveredKeys.push(...validKeys);
        recoveryLocations.push({ storageKey, count: validKeys.length });
      }
    } catch (e) {
      console.error(`Σφάλμα επεξεργασίας του ${storageKey}:`, e);
    }
  }
  
  // Αναζήτηση και για άλλα πιθανά κλειδιά σε άγνωστες τοποθεσίες
  const additionalLocations = diagnosticScanStorage();
  
  for (const location of additionalLocations) {
    // Προσπερνάμε τοποθεσίες που ήδη έχουμε ελέγξει
    if (potentialStorageKeys.includes(location.storageKey)) continue;
    
    const storedData = localStorage.getItem(location.storageKey);
    if (!storedData) continue;
    
    try {
      const parsedData = JSON.parse(storedData);
      if (!Array.isArray(parsedData)) continue;
      
      const validKeys = parsedData
        .filter(item => item && typeof item === 'object')
        .map(item => {
          const keyValue = item.key || item.apiKey || item.token || item.secret || item.value || '';
          const keyName = item.name || item.title || item.label || item.description || 'Ανακτημένο κλειδί';
          const keyService = item.service || item.provider || item.platform || item.type || 'other';
          
          if (!keyValue || !keyName) return null;
          
          return {
            id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: keyName,
            key: keyValue,
            service: keyService,
            createdAt: item.createdAt || item.created || new Date().toISOString(),
            description: item.description || item.notes || '',
            isWorking: typeof item.isWorking === 'boolean' ? item.isWorking : undefined,
            status: item.status || 'active',
            expires: item.expires || item.expiry || '',
            source: location.storageKey
          };
        })
        .filter((key): key is ApiKey => key !== null);
      
      if (validKeys.length > 0) {
        console.log(`Ανακτήθηκαν ${validKeys.length} κλειδιά από το ${location.storageKey}`);
        allRecoveredKeys.push(...validKeys);
        recoveryLocations.push({ storageKey: location.storageKey, count: validKeys.length });
      }
    } catch (e) {
      console.error(`Σφάλμα επεξεργασίας του ${location.storageKey}:`, e);
    }
  }
  
  // Αφαίρεση διπλότυπων κλειδιών (με βάση το key)
  const uniqueKeys: ApiKey[] = [];
  const seenKeys = new Set<string>();
  
  for (const apiKey of allRecoveredKeys) {
    if (!seenKeys.has(apiKey.key)) {
      seenKeys.add(apiKey.key);
      uniqueKeys.push(apiKey);
    }
  }
  
  console.log(`Συνολικά ανακτήθηκαν ${uniqueKeys.length} μοναδικά κλειδιά από ${recoveryLocations.length} τοποθεσίες`);
  
  return {
    recoveredKeys: uniqueKeys,
    locations: recoveryLocations
  };
};

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
      
      // Προσπάθεια ανάγνωσης - αν είναι κρυπτογραφημένα
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
            // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
            diagnosticScanStorage();
            return;
          }
        } catch (e) {
          console.error('Σφάλμα αποκρυπτογράφησης:', e);
          // Αν αποτύχει η αποκρυπτογράφηση, δοκιμάζουμε να διαβάσουμε τα κλειδιά ως μη κρυπτογραφημένα
          try {
            parsedKeys = JSON.parse(savedKeys);
            console.log('Βρέθηκαν μη κρυπτογραφημένα κλειδιά μετά από αποτυχία αποκρυπτογράφησης');
            setIsLocked(false);
          } catch (parseError) {
            console.error('Αποτυχία ανάλυσης ως JSON:', parseError);
            setIsLocked(true);
            // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
            diagnosticScanStorage();
            return;
          }
        }
      } else {
        // Προσπάθεια ανάγνωσης ως μη κρυπτογραφημένα
        try {
          parsedKeys = JSON.parse(savedKeys);
          console.log('Επιτυχής φόρτωση μη κρυπτογραφημένων κλειδιών');
        } catch (e) {
          // Σε περίπτωση που το αποθηκευμένο είναι κρυπτογραφημένο αλ��ά δεν έχει ενεργοποιηθεί η κρυπτογράφηση
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
                // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
                diagnosticScanStorage();
                return;
              }
            } catch (e) {
              console.error('Τελική αποτυχία φόρτωσης κλειδιών:', e);
              // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
              diagnosticScanStorage();
              setIsLocked(false);
              return;
            }
          } else {
            console.error('Αποτυχία φόρτωσης κλειδιών και δεν υπάρχει διαθέσιμο master password:', e);
            // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
            const foundItems = diagnosticScanStorage();
            
            if (foundItems.length > 0) {
              toast.warning(`Βρέθηκαν ${foundItems.length} πιθανές αποθηκεύσεις κλειδιών αλλά δεν ήταν δυνατή η φόρτωσή τους`);
            } else {
              toast.error("Δεν ήταν δυνατή η φόρτωση των κλειδιών. Το αποθηκευμένο αρχείο ενδέχεται να είναι κατεστραμμένο.");
            }
            return;
          }
        }
      }
      
      // Ensure all keys have the required fields
      const validKeys = parsedKeys.filter((key: any) => key && key.name && key.service && key.key)
        .map((key: ApiKey) => ({
          ...key,
          id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: key.createdAt || new Date().toISOString(),
          isWorking: typeof key.isWorking === 'boolean' ? key.isWorking : true,
          status: key.status || 'active'
        }));
      
      setApiKeys(validKeys);
      setIsLocked(false);
      
      if (parsedKeys.length !== validKeys.length) {
        console.warn(`${parsedKeys.length - validKeys.length} κλειδιά αγνοήθηκαν λόγω μη έγκυρης μορφής`);
      }
      
      console.log(`Φορτώθηκαν ${validKeys.length} κλειδιά από το localStorage`);
      
      if (validKeys.length === 0) {
        toast.warning("Δεν βρέθηκαν έγκυρα κλειδιά στην κλειδοθήκη");
        // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
        diagnosticScanStorage();
      }
    } catch (e) {
      console.error('Σφάλμα φόρτωσης κλειδιών:', e);
      toast.error("Σφάλμα φόρτωσης κλειδιών");
      // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
      diagnosticScanStorage();
    }
  } else {
    console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά στο localStorage[apiKeys]');
    // Εκτελούμε τη διαγνωστική σάρωση για να βρούμε τυχόν κλειδιά
    const foundItems = diagnosticScanStorage();
    
    if (foundItems.length > 0) {
      // Προσπάθεια ανάκτησης από το πρώτο πιθανό σημείο αποθήκευσης
      try {
        const firstLocation = foundItems[0].storageKey;
        const storedData = localStorage.getItem(firstLocation);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            // Προσπάθεια μετατροπής σε συμβατή μορφή
            const recoveredKeys = parsedData.map((item: any) => ({
              id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: item.name || item.title || 'Ανακτημένο κλειδί',
              key: item.key || item.apiKey || item.token || item.secret || item.value || '',
              service: item.service || item.provider || 'other',
              createdAt: item.createdAt || item.created || new Date().toISOString(),
              description: item.description || '',
              isWorking: typeof item.isWorking === 'boolean' ? item.isWorking : true,
              status: item.status || 'active'
            })).filter((key: ApiKey) => key.name && key.key && key.service);
            
            if (recoveredKeys.length > 0) {
              setApiKeys(recoveredKeys);
              localStorage.setItem('apiKeys', JSON.stringify(recoveredKeys));
              toast.success(`Ανακτήθηκαν ${recoveredKeys.length} κλειδιά από εναλλακτική αποθήκευση!`);
            }
          }
        }
      } catch (e) {
        console.error('Αποτυχία ανάκτησης από εναλλακτική αποθήκευση:', e);
      }
    }
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
