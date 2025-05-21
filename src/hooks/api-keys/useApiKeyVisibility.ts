
import { useState, useCallback } from '../../react-compatibility';

/**
 * Hook for managing API key visibility with utilities
 */
export function useApiKeyVisibility() {
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});
  
  /**
   * Toggle visibility for a specific key
   */
  const toggleKeyVisibility = useCallback((keyId: string) => {
    setVisibleKeyIds(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  }, []);
  
  /**
   * Format key display based on visibility
   */
  const formatKeyDisplay = useCallback((key: string, isVisible: boolean): string => {
    if (!key) return '';
    
    if (isVisible) {
      return key;
    }
    
    // Show first and last 4 characters with ... in between
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  }, []);
  
  /**
   * Hide all visible keys
   */
  const hideAllKeys = useCallback(() => {
    setVisibleKeyIds({});
  }, []);
  
  /**
   * Reset key visibility (for component unmount/cleanup)
   */
  const resetVisibility = useCallback(() => {
    setVisibleKeyIds({});
  }, []);
  
  /**
   * Make a specific key visible
   */
  const showKey = useCallback((keyId: string) => {
    setVisibleKeyIds(prev => ({
      ...prev,
      [keyId]: true
    }));
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setVisibleKeyIds(prev => ({
        ...prev,
        [keyId]: false
      }));
    }, 10000);
  }, []);
  
  return {
    visibleKeyIds,
    toggleKeyVisibility,
    formatKeyDisplay,
    hideAllKeys,
    resetVisibility,
    showKey
  };
}
