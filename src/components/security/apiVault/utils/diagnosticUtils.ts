
import { ApiKey } from "../types";
import { toast } from "sonner";
import { DEFAULT_API_KEYS } from "@/components/wallet/api-vault/defaultApis";

// Function to scan all localStorage for potential API keys
export function diagnosticScanStorage(): string[] {
  const foundItems: string[] = [];
  
  try {
    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value && (value.includes('"key":') || value.includes('apiKey') || value.includes('token'))) {
          foundItems.push(key);
        }
      }
    }
  } catch (e) {
    console.error('Error during storage scan:', e);
  }
  
  return foundItems;
}

// Function to extract all API keys from localStorage
export function extractAllKeysFromStorage(): ApiKey[] {
  const allKeys: ApiKey[] = [];
  const keyLocations = diagnosticScanStorage();
  
  keyLocations.forEach(location => {
    try {
      const data = localStorage.getItem(location);
      if (data) {
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(data);
          
          // Check if it's an array of API keys
          if (Array.isArray(parsed)) {
            const validKeys = parsed.filter(item => 
              item && typeof item === 'object' && item.name && item.key && item.service
            );
            allKeys.push(...validKeys);
          }
          // Check if it's a single API key
          else if (parsed && typeof parsed === 'object' && parsed.name && parsed.key && parsed.service) {
            allKeys.push(parsed);
          }
        } catch (e) {
          // Not valid JSON, ignore
        }
      }
    } catch (e) {
      console.error(`Error extracting keys from ${location}:`, e);
    }
  });
  
  return allKeys;
}

// Function to inject demo API keys for testing - modified to not add new keys
export function injectDemoKeys(count: number = 3): void {
  try {
    // Αφαίρεση του flag που δείχνει ότι έχουν εγχυθεί demo κλειδιά
    localStorage.removeItem('demoKeysInjected');
    
    // Φόρτωση των υπαρχόντων κλειδιών
    const existingKeysStr = localStorage.getItem('apiKeys');
    if (!existingKeysStr) {
      toast.warning('Δεν βρέθηκαν αποθηκευμένα κλειδιά');
      return;
    }
    
    try {
      const existingKeys = JSON.parse(existingKeysStr);
      if (!Array.isArray(existingKeys) || existingKeys.length === 0) {
        toast.warning('Άδεια λίστα κλειδιών');
        return;
      }
      
      // Αφαιρούμε τυχόν κλειδιά που έχουν προστεθεί ως demo
      const userKeys = existingKeys.filter((key: ApiKey) => 
        !key.id.toString().includes('demo-') && !key.key.includes('demo-key')
      );
      
      if (userKeys.length === 0) {
        // Εάν δεν βρέθηκαν κλειδιά του χρήστη, κρατάμε τα υπάρχοντα demo κλειδιά
        toast.info('Επαναφορά των αρχικών κλειδιών');
        return;
      }
      
      // Αποθηκεύουμε μόνο τα κλειδιά του χρήστη
      localStorage.setItem('apiKeys', JSON.stringify(userKeys));
      toast.success(`Επαναφέρθηκαν ${userKeys.length} κλειδιά χρήστη`);
      
      // Επαναφόρτωση της σελίδας για να δούμε τις αλλαγές
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (e) {
      console.error('Σφάλμα επεξεργασίας κλειδιών:', e);
      toast.error('Σφάλμα επαναφοράς κλειδιών');
    }
  } catch (e) {
    console.error('Γενικό σφάλμα:', e);
    toast.error('Αποτυχία επεξεργασίας κλειδιών');
  }
}
