
import { ApiKey } from "../types";
import { toast } from "sonner";
import { normalizeServiceName } from "./recoveryCore";

/**
 * Διενεργεί διαγνωστική σάρωση της localStorage για πιθανά κλειδιά API
 * Επιστρέφει έναν πίνακα από τοποθεσίες αποθήκευσης που περιέχουν πιθανά κλειδιά
 */
export const diagnosticScanStorage = () => {
  const potentialStorageLocations = [];
  
  // Σάρωση όλων των κλειδιών στο localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    try {
      // Εξαιρούμε τα γνωστά κλειδιά του ίδιου του συστήματος
      if (key === 'apiKeys' || 
          key === 'demoKeysInjected' || 
          key === 'theme' || 
          key === 'lastKeyRecoveryCheck') {
        continue;
      }
      
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Έλεγχος αν η τιμή μοιάζει με JSON
      if (value.startsWith('{') || value.startsWith('[')) {
        potentialStorageLocations.push({ storageKey: key, isJson: true });
      }
      // Έλεγχος για πιθανά κλειδιά API (απλές συμβολοσειρές που περιέχουν συγκεκριμένα πρότυπα)
      else if (value.includes('key') || value.includes('token') || value.includes('secret') || 
               value.includes('api') || value.includes('access')) {
        potentialStorageLocations.push({ storageKey: key, isJson: false });
      }
    } catch (e) {
      console.error(`Σφάλμα κατά την εξέταση του κλειδιού ${key}:`, e);
    }
  }
  
  return potentialStorageLocations;
};

/**
 * Εξάγει όλα τα πιθανά κλειδιά API από μια δομή δεδομένων JSON
 * Επιστρέφει έναν πίνακα από αντικείμενα ApiKey
 */
export const extractAllKeysFromStorage = () => {
  const allKeys: ApiKey[] = [];
  const storageList = diagnosticScanStorage();
  
  storageList.forEach(storage => {
    const { storageKey } = storage;
    const value = localStorage.getItem(storageKey);
    if (!value) return;
    
    try {
      // Επεξεργασία JSON δεδομένων
      if (storage.isJson) {
        const parsedValue = JSON.parse(value);
        
        // Αναδρομική λειτουργία για την εξαγωγή κλειδιών από οποιοδήποτε επίπεδο του JSON
        const extractKeys = (obj: any, path: string) => {
          if (!obj) return;
          
          if (typeof obj === 'object' && obj !== null) {
            // Διάσχιση αντικειμένου για εύρεση πιθανών κλειδιών API
            Object.entries(obj).forEach(([key, val]) => {
              const currentPath = path ? `${path}.${key}` : key;
              
              // Αν βρούμε έναν πίνακα, τον επεξεργαζόμαστε αναδρομικά
              if (Array.isArray(val)) {
                val.forEach((item, index) => {
                  extractKeys(item, `${currentPath}[${index}]`);
                });
              } 
              // Αν βρούμε ένα αντικείμενο, το επεξεργαζόμαστε αναδρομικά
              else if (typeof val === 'object' && val !== null) {
                extractKeys(val, currentPath);
              }
              // Έλεγχος για κλειδιά API
              else if (
                (typeof val === 'string' && 
                 (key.includes('key') || key.includes('token') || key.includes('secret') || key.includes('api')) &&
                 val.length > 10)
              ) {
                const name = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                const service = normalizeServiceName(storageKey);
                
                allKeys.push({
                  id: `extracted-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  name: name,
                  key: val,
                  service: service,
                  description: `Ανακτήθηκε από ${storageKey} (${currentPath})`,
                  createdAt: new Date().toISOString(),
                  source: storageKey
                });
              }
            });
          }
        };
        
        extractKeys(parsedValue, '');
      }
    } catch (e) {
      console.error(`Σφάλμα κατά την εξαγωγή κλειδιών από ${storageKey}:`, e);
    }
  });
  
  return allKeys;
};

/**
 * Προσθέτει δοκιμαστικά κλειδιά για επίδειξη
 * Τα κλειδιά αποθηκεύονται απευθείας στο localStorage
 */
export const injectDemoKeys = (count: number = 26) => {
  try {
    const services = [
      'binance', 'solana', 'ethereum', 'kraken', 'coinbase', 'metamask', 
      'phantom', 'wallet', 'rpc', 'explorer', 'api', 'exchange', 'openai',
      'stripe', 'github', 'aws', 'firebase', 'vercel', 'netlify', 'heroku'
    ];
    
    const prefixes = {
      'binance': 'binance_',
      'solana': 'sol_',
      'ethereum': 'eth_',
      'kraken': 'kraken_',
      'coinbase': 'cb_',
      'openai': 'sk-',
      'stripe': 'sk_test_',
      'github': 'ghp_',
      'aws': 'AKIA',
      'firebase': 'AIza',
      'vercel': 'vercel_',
      'netlify': 'netlify_',
      'heroku': 'heroku_'
    };
    
    const newKeys = [];
    
    // Δημιουργία του ζητούμενου αριθμού κλειδιών
    for (let i = 0; i < count; i++) {
      const service = services[i % services.length];
      const prefix = prefixes[service as keyof typeof prefixes] || '';
      const randomKey = `${prefix}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      newKeys.push({
        id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}`,
        name: `${service.charAt(0).toUpperCase() + service.slice(1)} Demo Key ${i+1}`,
        key: randomKey,
        service: service,
        createdAt: new Date().toISOString(),
        description: `Δοκιμαστικό κλειδί για επίδειξη - ${service}`,
        isWorking: Math.random() > 0.2, // 80% πιθανότητα να λειτουργεί
        status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'expired' : 'revoked') : 'active',
        source: 'demo'
      });
    }
    
    // Αποθήκευση των κλειδιών στο localStorage
    localStorage.setItem('apiKeys', JSON.stringify(newKeys));
    localStorage.setItem('demoKeysInjected', 'true');
    
    // Ειδοποίηση στον χρήστη
    toast.success(`Προστέθηκαν ${count} δοκιμαστικά κλειδιά API`);
    window.location.reload(); // Επαναφόρτωση για εμφάνιση των νέων κλειδιών
    
    return newKeys;
  } catch (error) {
    console.error('Σφάλμα κατά την προσθήκη δοκιμαστικών κλειδιών:', error);
    toast.error('Σφάλμα κατά την προσθήκη δοκιμαστικών κλειδιών');
    return [];
  }
};
