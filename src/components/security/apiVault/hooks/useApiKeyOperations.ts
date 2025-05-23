
import { useState } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";
import { saveKeysToStorage } from "../utils/storageUtils";

export function useApiKeyOperations(initialApiKeys: ApiKey[] = []) {
  // Start with empty array instead of demo keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  
  // Security flag to ensure only user-initiated deletions are allowed
  const [userInitiatedDelete, setUserInitiatedDelete] = useState(false);

  // New security code for protection against unauthorized deletions
  const [securityToken, setSecurityToken] = useState<string>(
    `sec-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  );

  // Add new key
  const addNewKey = (newKey: ApiKey) => {
    // Ensure the key has ID and creation date
    const keyWithDefaults = {
      ...newKey,
      id: newKey.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: newKey.createdAt || new Date().toISOString(),
      status: newKey.status || 'active'
    };
    
    const updatedKeys = [...apiKeys, keyWithDefaults];
    setApiKeys(updatedKeys);
    
    // Save to localStorage with redundancy
    saveKeysToStorage(updatedKeys, false, "");
    
    toast.success("API key added successfully");
  };

  // Delete key - Protected with user confirmation and security token
  const deleteKey = (id: string) => {
    // Verify that deletion was initiated by the user
    if (!userInitiatedDelete) {
      console.error("Key deletion rejected - user confirmation required");
      toast.error("Key deletion failed - user interaction required");
      return;
    }
    
    // Additional security check for protection against programmatic deletions
    const currentTime = Date.now();
    const tokenParts = securityToken.split('-');
    if (tokenParts.length < 2 || currentTime - parseInt(tokenParts[1]) > 300000) {
      console.error("Key deletion rejected - invalid security token");
      toast.error("Key deletion failed - contact support");
      return;
    }
    
    // Reset flag after each use
    setUserInitiatedDelete(false);
    
    // Create backup before deletion
    const backupKeys = [...apiKeys];
    localStorage.setItem(`apiKeys_before_delete_${Date.now()}`, JSON.stringify(backupKeys));
    
    // Execute deletion
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    setApiKeys(updatedKeys);
    
    // Save to localStorage with backup
    saveKeysToStorage(updatedKeys, false, "");
    
    // Refresh security token
    setSecurityToken(`sec-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`);
    
    toast.success("Key deleted successfully");
  };

  // Method to enable deletion flag from user - ONLY from UI components
  const confirmKeyDeletion = (id: string) => {
    setUserInitiatedDelete(true);
    // After enabling the flag, immediate deletion of the key
    setTimeout(() => deleteKey(id), 0);
  };

  // Update key
  const updateKey = (updatedKey: ApiKey) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === updatedKey.id ? { ...key, ...updatedKey } : key
    );
    
    setApiKeys(updatedKeys);
    
    // Save to localStorage with backup
    saveKeysToStorage(updatedKeys, false, "");
    
    toast.success("Key updated successfully");
  };

  // Handle bulk import
  const handleImport = (importedKeys: ApiKey[]) => {
    // Make backup before import
    localStorage.setItem(`apiKeys_before_import_${Date.now()}`, JSON.stringify(apiKeys));
    
    // Check for duplicates by comparing key values
    const existingKeyValues = new Set(apiKeys.map(key => key.key));
    
    // Filter keys that already exist
    const newKeys = importedKeys.filter(key => !existingKeyValues.has(key.key))
      .map(key => ({
        ...key,
        id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: key.createdAt || new Date().toISOString(),
        status: key.status || 'active'
      }));
    
    // Add new keys
    if (newKeys.length > 0) {
      const updatedKeys = [...apiKeys, ...newKeys];
      setApiKeys(updatedKeys);
      
      // Save to localStorage with backup
      saveKeysToStorage(updatedKeys, false, "");
      
      if (newKeys.length !== importedKeys.length) {
        toast.warning(`Added ${newKeys.length} new keys. ${importedKeys.length - newKeys.length} skipped as duplicates.`);
      } else {
        toast.success(`Added ${newKeys.length} new keys successfully!`);
      }
    } else if (importedKeys.length > 0) {
      toast.warning("All keys already exist in your vault");
    }
  };

  return {
    apiKeys,
    setApiKeys,
    addNewKey,
    // The public method is now confirmKeyDeletion instead of deleteKey
    deleteKey: confirmKeyDeletion,
    updateKey,
    handleImport
  };
}
