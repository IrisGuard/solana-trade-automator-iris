
import { saveKeysToStorage } from "./storageUtils";
import { testSingleKey } from "./testUtils";
import { encryptData, decryptData } from "./encryptionUtils";
import { recoverAllApiKeys } from "./recoveryUtils";
import { diagnosticScanStorage } from "./diagnosticUtils";

// Αφαίρεση της λειτουργίας εισαγωγής demo κλειδιών
export const injectDemoKeys = (count = 0) => {
  // Αφαίρεση της λειτουργικότητας - δεν προσθέτουμε πλέον demo κλειδιά
  console.log("Η λειτουργία επαναφοράς demo κλειδιών έχει απενεργοποιηθεί");
  return false;
};

export {
  saveKeysToStorage,
  testSingleKey,
  encryptData,
  decryptData,
  recoverAllApiKeys,
  diagnosticScanStorage
};
