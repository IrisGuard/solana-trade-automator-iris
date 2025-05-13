
import { useState } from "react";
import { ApiKey } from "../types";

export function useKeyTestingState() {
  const [isTestingKeys, setIsTestingKeys] = useState(false);

  const handleRefreshKeys = (apiKeys: ApiKey[], setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>, testKeyFunctionality: (key: ApiKey) => Promise<boolean>) => {
    if (!apiKeys.length) return;
    
    setIsTestingKeys(true);
    
    // Test each key in sequence
    const testAllKeys = async () => {
      const updatedKeys = [...apiKeys];
      
      for (let i = 0; i < updatedKeys.length; i++) {
        const isWorking = await testKeyFunctionality(updatedKeys[i]);
        updatedKeys[i] = { ...updatedKeys[i], isWorking };
        // Update state for each key as it completes
        setApiKeys([...updatedKeys]);
      }
      
      setIsTestingKeys(false);
    };
    
    testAllKeys();
  };

  return {
    isTestingKeys,
    setIsTestingKeys,
    handleRefreshKeys
  };
}
