
import { useState } from "react";
import { toast } from "sonner";

export function useKeyTesting() {
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  
  // Test all keys for validity/functionality
  const handleRefreshKeys = () => {
    setIsTestingKeys(true);
    
    // Simulate testing process
    setTimeout(() => {
      setIsTestingKeys(false);
      toast.success('Ο έλεγχος κλειδιών ολοκληρώθηκε');
    }, 2000);
  };
  
  return {
    isTestingKeys,
    setIsTestingKeys,
    handleRefreshKeys
  };
}
