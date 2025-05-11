
import { ApiKey } from "../types";
import { toast } from "sonner";

// Parse import data (CSV or JSON)
export const parseImportData = (importData: string): ApiKey[] => {
  if (!importData || importData.trim() === '') {
    toast.error("Παρακαλώ εισάγετε δεδομένα για εισαγωγή");
    return [];
  }

  try {
    // Try parsing as JSON first
    try {
      const jsonData = JSON.parse(importData);
      
      // Check if it's an array
      if (Array.isArray(jsonData)) {
        // Validate each key
        const validKeys = jsonData.filter((key: any) => {
          return key.name && key.service && key.key;
        }).map((key: any) => ({
          id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: key.name,
          service: key.service,
          key: key.key,
          description: key.description || "",
          expires: key.expires || null,
          createdAt: key.createdAt || new Date().toISOString()
        }));
        
        if (validKeys.length === 0) {
          toast.error("Δεν βρέθηκαν έγκυρα κλειδιά στο JSON");
          return [];
        }
        
        return validKeys;
      } else {
        toast.error("Το JSON δεν περιέχει έγκυρα δεδομένα πίνακα");
        return [];
      }
    } catch (e) {
      // JSON parsing failed, try text format
      return parseTextData(importData);
    }
  } catch (e) {
    console.error("Σφάλμα κατά την ανάλυση δεδομένων:", e);
    toast.error("Μη έγκυρη μορφή δεδομένων");
    return [];
  }
};

// Parse text data with separator (pipe or comma)
const parseTextData = (importData: string): ApiKey[] => {
  try {
    // Split by lines and filter out empty lines
    const lines = importData.split("\n").filter(line => line.trim().length > 0);
    const keys: ApiKey[] = [];
    
    lines.forEach(line => {
      // Support both pipe (|) and comma (,) as separators
      const separator = line.includes('|') ? '|' : ',';
      const parts = line.split(separator).map(s => s.trim());
      
      // We need at least name, key, service
      if (parts.length >= 3) {
        const [name, key, service, description = "", expires = null] = parts;
        
        if (name && service && key) {
          keys.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name,
            service,
            key,
            description,
            expires,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    
    if (keys.length === 0) {
      toast.error("Δεν βρέθηκαν έγκυρα κλειδιά στο κείμενο. Η μορφή πρέπει να είναι: 'Όνομα|Κλειδί|Υπηρεσία'");
      return [];
    }
    
    return keys;
  } catch (e) {
    console.error("Σφάλμα κατά την ανάλυση των δεδομένων κειμένου:", e);
    toast.error("Σφάλμα κατά την ανάλυση των δεδομένων κειμένου");
    return [];
  }
};

// Export format conversion utility
export const convertKeysToFormat = (keys: ApiKey[], format: string): string => {
  try {
    if (format === 'json') {
      return JSON.stringify(keys, null, 2);
    } else if (format === 'text') {
      return keys.map(key => 
        `${key.name}|${key.key}|${key.service}${key.description ? `|${key.description}` : ''}${key.expires ? `|${key.expires}` : ''}`
      ).join('\n');
    } else {
      return '';
    }
  } catch (e) {
    console.error('Σφάλμα μετατροπής μορφής:', e);
    return '';
  }
};
