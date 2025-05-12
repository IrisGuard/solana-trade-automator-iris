
import { useState } from "react";
import { toast } from "sonner";
import { ApiKey } from "../types";
import { ApiIntegrationService } from "../ApiIntegrationService";

export function useKeyTesting() {
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  
  // Έλεγχος όλων των κλειδιών και αυτόματη εναλλαγή σε εφεδρικά όταν χρειάζεται
  const handleRefreshKeys = async (apiKeys: ApiKey[], setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>) => {
    setIsTestingKeys(true);
    
    try {
      const serviceKeys: Record<string, ApiKey[]> = {};
      
      // Ομαδοποίηση κλειδιών ανά υπηρεσία
      apiKeys.forEach(key => {
        if (!serviceKeys[key.service]) {
          serviceKeys[key.service] = [];
        }
        serviceKeys[key.service].push(key);
      });
      
      const updatedKeys = [...apiKeys];
      const keysToSwitch: {failedKey: ApiKey, backupKey: ApiKey}[] = [];
      
      // Έλεγχος κλειδιών και εντοπισμός ανάγκης για εναλλαγές
      for (const key of updatedKeys) {
        const keyIndex = updatedKeys.findIndex(k => k.id === key.id);
        if (keyIndex === -1) continue;
        
        try {
          const isWorking = await ApiIntegrationService.testConnection(key);
          updatedKeys[keyIndex] = { ...updatedKeys[keyIndex], isWorking };
          
          // Εάν το κλειδί δεν λειτουργεί και είναι το κύριο κλειδί για αυτή την υπηρεσία,
          // αναζητούμε εφεδρικό κλειδί
          if (!isWorking) {
            const serviceKeysList = serviceKeys[key.service] || [];
            const workingBackup = serviceKeysList.find(k => 
              k.id !== key.id && (k.status === 'active' || !k.status) && k.isWorking !== false
            );
            
            if (workingBackup) {
              keysToSwitch.push({ failedKey: key, backupKey: workingBackup });
            }
          }
        } catch (error) {
          console.error(`Error testing key ${key.name}:`, error);
          updatedKeys[keyIndex] = { ...updatedKeys[keyIndex], isWorking: false };
        }
      }
      
      // Εφαρμογή αυτόματης εναλλαγής όπου χρειάζεται
      if (keysToSwitch.length > 0) {
        for (const { failedKey, backupKey } of keysToSwitch) {
          toast.warning(
            `Το κλειδί "${failedKey.name}" δεν λειτουργεί. Ενεργοποιήθηκε αυτόματα το εφεδρικό κλειδί "${backupKey.name}".`,
            { duration: 6000 }
          );
          
          // Εδώ μπορεί να γίνει η αντικατάσταση του κλειδιού στην εφαρμογή
          // π.χ. αποθήκευση του backupKey.id ως το ενεργό κλειδί για την υπηρεσία
          localStorage.setItem(`active_key_${failedKey.service}`, backupKey.id);
        }
      }
      
      setApiKeys(updatedKeys);
      toast.success('Ο έλεγχος κλειδιών ολοκληρώθηκε');
      
      const workingCount = updatedKeys.filter(k => k.isWorking).length;
      const notWorkingCount = updatedKeys.filter(k => k.isWorking === false).length;
      
      if (notWorkingCount > 0) {
        toast.warning(`Βρέθηκαν ${notWorkingCount} μη λειτουργικά κλειδιά που χρειάζονται αντικατάσταση.`);
      }
      
    } catch (error) {
      console.error("Σφάλμα κατά τον έλεγχο κλειδιών:", error);
      toast.error('Παρουσιάστηκε σφάλμα κατά τον έλεγχο των κλειδιών');
    } finally {
      setIsTestingKeys(false);
    }
  };
  
  // Έλεγχος ενός μεμονωμένου κλειδιού
  const testSingleKey = async (apiKey: ApiKey): Promise<boolean> => {
    try {
      return await ApiIntegrationService.testConnection(apiKey);
    } catch (error) {
      console.error(`Σφάλμα ελέγχου κλειδιού ${apiKey.name}:`, error);
      return false;
    }
  };
  
  return {
    isTestingKeys,
    setIsTestingKeys,
    handleRefreshKeys,
    testSingleKey
  };
}
