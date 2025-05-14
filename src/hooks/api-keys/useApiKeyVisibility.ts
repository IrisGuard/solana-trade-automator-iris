
import { useState, useCallback } from 'react';
import { ApiKeyWithState } from '@/services/api-keys/types';

export function useApiKeyVisibility(
  initialKeys: ApiKeyWithState[] = [], 
  onKeysChange?: (keys: ApiKeyWithState[]) => void
) {
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});

  // Toggle visibility for a specific key
  const toggleKeyVisibility = useCallback((keyId: string) => {
    setVisibleKeyIds(prev => {
      const updated = { ...prev, [keyId]: !prev[keyId] };
      return updated;
    });
  }, []);

  // Hide all keys
  const hideAllKeys = useCallback(() => {
    setVisibleKeyIds({});
  }, []);

  // Update the keys array with visibility information
  const getKeysWithVisibility = useCallback((keys: ApiKeyWithState[]) => {
    const updatedKeys = keys.map(key => ({
      ...key,
      isVisible: !!visibleKeyIds[key.id]
    }));
    
    if (onKeysChange) {
      onKeysChange(updatedKeys);
    }
    
    return updatedKeys;
  }, [visibleKeyIds, onKeysChange]);

  // Format key for display based on visibility
  const formatKeyDisplay = useCallback((keyValue: string, isVisible: boolean) => {
    if (!keyValue) return '';
    if (isVisible) return keyValue;
    
    const start = keyValue.substring(0, 4);
    const end = keyValue.substring(keyValue.length - 4);
    return `${start}...${end}`;
  }, []);

  return {
    visibleKeyIds,
    toggleKeyVisibility,
    hideAllKeys,
    getKeysWithVisibility,
    formatKeyDisplay,
    isKeyVisible: (keyId: string) => !!visibleKeyIds[keyId]
  };
}
