
import { ApiKey } from "../types";
import { useLocalStorageLoader } from "./useLocalStorageLoader";
import { useLocalStorageSaver } from "./useLocalStorageSaver";
import { useKeyTester } from "./useKeyTester";
import { useKeyRecovery } from "./useKeyRecovery";
import { ApiKeyStorageState } from "./useStorageState";

export type { ApiKeyStorageState } from "./useStorageState";

export function useApiKeyStorage(
  apiKeys: ApiKey[], 
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>,
  useDemoKeys: boolean = false
) {
  // Use the extracted hooks
  const { storageState } = useLocalStorageLoader(apiKeys, setApiKeys, useDemoKeys);
  useLocalStorageSaver(apiKeys);
  const { testKeyFunctionality } = useKeyTester();
  const { recoverFromBackup } = useKeyRecovery();

  return {
    testKeyFunctionality,
    recoverFromBackup,
    storageState
  };
}
