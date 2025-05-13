
import { useState } from 'react';

export interface ApiKeyStorageState {
  isLoading: boolean;
  error: string | null;
  hasBackupData: boolean;
}

export const createInitialStorageState = (): ApiKeyStorageState => ({
  isLoading: true,
  error: null,
  hasBackupData: false
});

export function useStorageState() {
  const [storageState, setStorageState] = useState<ApiKeyStorageState>(createInitialStorageState());
  
  const setLoading = (isLoading: boolean) => {
    setStorageState(prev => ({ ...prev, isLoading }));
  };
  
  const setError = (error: string | null, hasBackupData: boolean = false) => {
    setStorageState(prev => ({ ...prev, error, hasBackupData }));
  };
  
  const resetState = () => {
    setStorageState(createInitialStorageState());
  };
  
  return {
    storageState,
    setStorageState,
    setLoading,
    setError,
    resetState
  };
}
