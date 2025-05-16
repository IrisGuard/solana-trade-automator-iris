import { useState, useCallback } from 'react';

export function useApiKeyVisibility() {
  // Keep track of which key IDs should be visible using an object
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});
  
  // Toggle visibility for a key
  const toggleKeyVisibility = useCallback((keyId: string) => {
    setVisibleKeyIds(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  }, []);
  
  // Check if a key is currently visible
  const isKeyVisible = useCallback((keyId: string) => {
    return !!visibleKeyIds[keyId];
  }, [visibleKeyIds]);
  
  // Format key display based on visibility
  const formatKeyDisplay = useCallback((key: string, isVisible: boolean) => {
    if (!key) return '';
    
    if (isVisible) {
      return key;
    } else {
      // Show first 4 and last 4 characters, hide the rest
      return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    }
  }, []);
  
  return {
    visibleKeyIds,
    toggleKeyVisibility,
    formatKeyDisplay,
    isKeyVisible
  };
}
