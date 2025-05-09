
import { ApiKey } from "../types";
import { toast } from "sonner";

// Parse import data (CSV or JSON)
export const parseImportData = (importData: string): ApiKey[] => {
  try {
    // Try parsing as JSON first
    const jsonData = JSON.parse(importData);
    
    // Check if it's an array
    if (Array.isArray(jsonData)) {
      // Validate each key
      const validKeys = jsonData.filter((key: any) => {
        return key.id && key.name && key.service && key.key;
      });
      
      if (validKeys.length === 0) {
        toast.error("Δεν βρέθηκαν έγκυρα κλειδιά στο JSON");
        return [];
      }
      
      return validKeys;
    } else {
      toast.error("Το JSON δεν περιέχει έγκυρα δεδομένα");
      return [];
    }
  } catch (e) {
    // JSON parsing failed, try CSV
    try {
      // Simple CSV parsing (assuming format: name,service,key)
      const lines = importData.split("\n").filter(line => line.trim().length > 0);
      const keys: ApiKey[] = [];
      
      lines.forEach(line => {
        const [name, service, key] = line.split(',').map(s => s.trim());
        
        if (name && service && key) {
          keys.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            service,
            key,
            created: new Date().toISOString()
          });
        }
      });
      
      if (keys.length === 0) {
        toast.error("Δεν βρέθηκαν έγκυρα κλειδιά στο CSV");
        return [];
      }
      
      return keys;
    } catch (e) {
      toast.error("Μη έγκυρη μορφή δεδομένων");
      return [];
    }
  }
};
