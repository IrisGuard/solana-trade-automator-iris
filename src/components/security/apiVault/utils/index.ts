
// Export all utilities from this index file
export * from './storageUtils';
export * from './clipboardUtils';
export * from './formatUtils';
export * from './importUtils';
export * from './encryptionUtils';
export * from './diagnosticUtils';
export * from './recoveryUtils';
export * from './recoveryCore';
export * from './storageScanner';

// Re-export the common functions
import { diagnosticScanStorage, extractAllKeysFromStorage, injectDemoKeys } from './diagnosticUtils';
import { encryptData, decryptData, tryDecryptWithCommonPasswords } from './encryptionUtils';
import { 
  recoverAllApiKeys, 
  forceScanForKeys
} from './recoveryUtils';
import {
  POTENTIAL_STORAGE_KEYS,
  COMMON_PASSWORDS,
  normalizeServiceName,
  initializeAutoRecovery
} from './recoveryCore';
import {
  searchAllLocalStorage,
  processStorageKey,
  extractApiKeysFromData
} from './storageScanner';

// Export all functions for easy access
export {
  diagnosticScanStorage,
  extractAllKeysFromStorage,
  injectDemoKeys,
  encryptData,
  decryptData,
  tryDecryptWithCommonPasswords,
  recoverAllApiKeys,
  forceScanForKeys,
  POTENTIAL_STORAGE_KEYS,
  COMMON_PASSWORDS,
  normalizeServiceName,
  initializeAutoRecovery,
  searchAllLocalStorage,
  processStorageKey,
  extractApiKeysFromData
};
