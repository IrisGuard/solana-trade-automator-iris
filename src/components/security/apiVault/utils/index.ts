
// Export all utilities from this index file
export * from './storageUtils';
export * from './clipboardUtils';
export * from './formatUtils';
export * from './importUtils';
export * from './encryptionUtils';
export * from './diagnosticUtils';
export * from './recoveryUtils';

// Re-export the functions
import { diagnosticScanStorage, extractAllKeysFromStorage, injectDemoKeys } from './diagnosticUtils';
import { encryptData, decryptData, tryDecryptWithCommonPasswords } from './encryptionUtils';
import { 
  recoverAllApiKeys, 
  forceScanForKeys, 
  POTENTIAL_STORAGE_KEYS,
  COMMON_PASSWORDS
} from './recoveryUtils';

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
  COMMON_PASSWORDS
};

// Αφαιρέθηκε η αυτόματη εκτέλεση του initializeAutoRecovery για να σταματήσει η συνεχής επαναφόρτωση
