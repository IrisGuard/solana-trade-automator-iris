
import { ApiKey } from "../types";

// Parse different import formats
export const parseImportData = (importData: string, importFormat: string) => {
  let importedKeys: ApiKey[] = [];
  
  if (importFormat === 'json') {
    // Try to parse the data as JSON first
    try {
      const parsed = JSON.parse(importData);
      
      // Check if it's an array of objects with the required properties
      if (Array.isArray(parsed) && parsed.every(item => 
        typeof item === 'object' && item !== null && 'name' in item && 'key' in item
      )) {
        importedKeys = parsed.map(item => ({
          id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: item.name,
          key: item.key,
          service: item.service || 'other',
          createdAt: item.createdAt || new Date().toISOString(),
          description: item.description,
          expires: item.expires
        }));
      }
    } catch (e) {
      // If JSON parsing fails, check for key-value pairs in the format shown in the screenshot
      const lines = importData.trim().split('\n');
      
      for (const line of lines) {
        // Look for patterns like EXPO_PUBLIC_SOLANA_RPC_URL=https://...
        const keyValueMatch = line.match(/^([A-Z0-9_]+)=(.+)$/);
        if (keyValueMatch) {
          const name = keyValueMatch[1];
          const key = keyValueMatch[2];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name,
            key,
            service: name.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      }
      
      // Also check for patterns like EXPO_PUBLIC_SOLANA_RPC_URL_1=https://...
      // This handles numbered entries like in the screenshot
      lines.forEach(line => {
        const numberedKeyMatch = line.match(/^([A-Z0-9_]+)_(\d+)=(.+)$/);
        if (numberedKeyMatch) {
          const baseName = numberedKeyMatch[1];
          const number = numberedKeyMatch[2];
          const key = numberedKeyMatch[3];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: `${baseName} ${number}`,
            key,
            service: baseName.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      });
    }
  } else if (importFormat === 'text') {
    // Format: name|key|service|description (optional)
    const lines = importData.trim().split('\n');
    
    lines.forEach(line => {
      // First check for the pipe-delimited format
      if (line.includes('|')) {
        const parts = line.split('|');
        importedKeys.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: parts[0].trim(),
          key: parts[1].trim(),
          service: parts[2]?.trim() || 'other',
          createdAt: new Date().toISOString(),
          description: parts[3]?.trim(),
          expires: parts[4]?.trim()
        });
      } 
      // Then check for KEY=value format
      else {
        const keyValueMatch = line.match(/^([A-Z0-9_]+)=(.+)$/);
        if (keyValueMatch) {
          const name = keyValueMatch[1];
          const key = keyValueMatch[2];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name,
            key,
            service: name.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
        
        // Check for numbered KEY_#=value format
        const numberedKeyMatch = line.match(/^([A-Z0-9_]+)_(\d+)=(.+)$/);
        if (numberedKeyMatch) {
          const baseName = numberedKeyMatch[1];
          const number = numberedKeyMatch[2];
          const key = numberedKeyMatch[3];
          
          importedKeys.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: `${baseName} ${number}`,
            key,
            service: baseName.toLowerCase().includes('solana') ? 'solana' : 'other',
            createdAt: new Date().toISOString()
          });
        }
      }
    });
  }
  
  return importedKeys;
};
