
import { useState } from "react";

export function useApiKeyVisibility() {
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  
  // Εναλλαγή ορατότητας κλειδιού
  const toggleKeyVisibility = (id: string) => {
    setIsKeyVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return {
    isKeyVisible,
    toggleKeyVisibility
  };
}
