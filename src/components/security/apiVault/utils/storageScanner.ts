
// Import only the part we need to modify
import { ApiKey } from "../types";

// Since this file is read-only, we'll create a wrapper function that ensures 
// that connected is used as a property
export function createKeyFromScanData(data: any): ApiKey {
  return {
    id: data.id || `key-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: data.name || 'Unknown key',
    service: data.service || 'unknown',
    key: data.key || data.value || '',
    createdAt: data.createdAt || data.created || new Date().toISOString(),
    status: data.status || 'active',
    description: data.description || '',
    connected: data.connected || false,
    isWorking: data.isWorking || false
  };
}
