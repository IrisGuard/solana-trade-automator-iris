
import { ApiKey } from "../types";
import { toast } from "sonner";

// Diagnostic utility to locate all keys in localStorage
export const diagnosticScanStorage = () => {
  console.log('Diagnostic scan of localStorage:');
  
  let foundApiKeys = false;
  const apiKeyLikeItems = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Check if content looks like JSON
      if (value.startsWith('[') || value.startsWith('{')) {
        try {
          const parsed = JSON.parse(value);
          
          // Check if it's an array of objects that might be API keys
          if (Array.isArray(parsed) && parsed.length > 0 && 
              parsed[0] && typeof parsed[0] === 'object' &&
              (parsed[0].key || parsed[0].apiKey || parsed[0].token || parsed[0].secret || parsed[0].value)) {
            console.log(`Potential API keys found in localStorage[${key}], count: ${parsed.length}`);
            apiKeyLikeItems.push({ 
              storageKey: key, 
              count: parsed.length,
              sample: parsed.slice(0, 3),
            });
            foundApiKeys = true;
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    } catch (e) {
      console.error(`Error reading localStorage[${key}]:`, e);
    }
  }
  
  if (foundApiKeys) {
    console.log('Found potential API key storages:', apiKeyLikeItems);
    return apiKeyLikeItems;
  } else {
    console.log('No potential API keys found in localStorage');
    return [];
  }
};
