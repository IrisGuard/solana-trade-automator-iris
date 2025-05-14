
import { useState } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useKeyTesting() {
  const [isTestingKeys, setIsTestingKeys] = useState(false);

  // Test functionality of a single API key
  const testSingleKey = async (key: ApiKey): Promise<boolean> => {
    try {
      // Simulate API testing with timeout
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demonstration, randomly determine if a key is working
      // In a real app, this would make an actual API call to test the key
      const isWorking = Math.random() > 0.3; // 70% chance of success
      
      return isWorking;
    } catch (error) {
      console.error("Error testing API key:", error);
      return false;
    }
  };

  // Test all API keys
  const testAllKeys = async (apiKeys: ApiKey[], setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>) => {
    if (!apiKeys || apiKeys.length === 0) return;
    
    try {
      setIsTestingKeys(true);
      toast.info(`Έλεγχος ${apiKeys.length} κλειδιών...`);
      
      // Process keys in batches to avoid overwhelming the system
      const batchSize = 5;
      const updatedKeys = [...apiKeys];
      let workingCount = 0;
      let notWorkingCount = 0;
      
      for (let i = 0; i < updatedKeys.length; i += batchSize) {
        const batch = updatedKeys.slice(i, i + batchSize);
        
        // Run tests in parallel within the batch
        const results = await Promise.all(
          batch.map(async (key, idx) => {
            const isWorking = await testSingleKey(key);
            return { index: i + idx, isWorking };
          })
        );
        
        // Update keys with test results
        results.forEach(({ index, isWorking }) => {
          updatedKeys[index] = { 
            ...updatedKeys[index], 
            isWorking // This is now valid since we added isWorking to ApiKey type
          };
          
          if (isWorking) {
            workingCount++;
          } else {
            notWorkingCount++;
          }
        });
        
        // Update state incrementally
        setApiKeys([...updatedKeys]);
      }
      
      toast.success(`Έλεγχος ολοκληρώθηκε: ${workingCount} λειτουργικά, ${notWorkingCount} μη λειτουργικά κλειδιά`);
    } catch (error) {
      console.error("Error testing keys:", error);
      toast.error("Σφάλμα κατά τον έλεγχο των κλειδιών");
    } finally {
      setIsTestingKeys(false);
    }
  };

  // Function to handle the refresh button click
  const handleRefreshKeys = (apiKeys: ApiKey[], setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>) => {
    testAllKeys(apiKeys, setApiKeys);
  };

  return {
    isTestingKeys,
    setIsTestingKeys,
    testSingleKey,
    testAllKeys,
    handleRefreshKeys
  };
}
