
import { saveKeysToStorage, loadKeysFromStorage, checkForBackups, restoreFromBackup } from "./storageUtils";
import { testSingleKey } from "./testUtils";
import { encryptData, decryptData } from "./encryptionUtils";
import { recoverAllApiKeys } from "./recoveryUtils";
import { diagnosticScanStorage } from "./diagnosticUtils";

// Utility function removal notice
export const injectDemoKeys = (count = 0) => {
  // Functionality disabled - no longer add demo keys
  console.log("Η λειτουργία επαναφοράς demo κλειδιών έχει απενεργοποιηθεί");
  return false;
};

export {
  saveKeysToStorage,
  loadKeysFromStorage,
  testSingleKey,
  encryptData,
  decryptData,
  recoverAllApiKeys,
  diagnosticScanStorage,
  checkForBackups,
  restoreFromBackup
};
