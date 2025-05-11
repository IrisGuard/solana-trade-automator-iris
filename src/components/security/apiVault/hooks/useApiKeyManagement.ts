
import { useState, useEffect } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";

export function useApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");

  // Add new key
  const addNewKey = (newKey: ApiKey) => {
    // Ensure the key has an ID and createdAt
    const keyWithDefaults = {
      ...newKey,
      id: newKey.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: newKey.createdAt || new Date().toISOString()
    };
    
    setApiKeys(prev => [...prev, keyWithDefaults]);
    toast.success("Το κλειδί προστέθηκε επιτυχώς");
  };

  // Delete key
  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("Το κλειδί διαγράφηκε επιτυχώς");
  };

  // Toggle key visibility
  const toggleKeyVisibility = (id: string) => {
    setIsKeyVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle bulk import
  const handleImport = (importedKeys: ApiKey[]) => {
    // Check for duplicates by comparing key values
    const existingKeyValues = new Set(apiKeys.map(key => key.key));
    
    // Filter out keys that already exist
    const newKeys = importedKeys.filter(key => !existingKeyValues.has(key.key));
    
    // Add new keys
    if (newKeys.length > 0) {
      setApiKeys(prev => [...prev, ...newKeys]);
      
      if (newKeys.length !== importedKeys.length) {
        toast.warning(`Προστέθηκαν ${newKeys.length} νέα κλειδιά. ${importedKeys.length - newKeys.length} παραλείφθηκαν ως διπλότυπα.`);
      } else {
        toast.success(`Προστέθηκαν ${newKeys.length} νέα κλειδιά επιτυχώς!`);
      }
    } else if (importedKeys.length > 0) {
      toast.warning("Όλα τα κλειδιά υπάρχουν ήδη στην κλειδοθήκη σας");
    }
  };

  // Get keys filtered by search term and service
  const getFilteredKeys = () => {
    return apiKeys.filter(key => {
      const matchesSearch = 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (key.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterService === 'all' || key.service.toLowerCase() === filterService.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  };

  // Group keys by service
  const getKeysByService = () => {
    const grouped: Record<string, ApiKey[]> = {};
    
    getFilteredKeys().forEach(key => {
      const service = key.service.toLowerCase();
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push(key);
    });
    
    return grouped;
  };

  return {
    apiKeys,
    setApiKeys,
    isKeyVisible,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    addNewKey,
    deleteKey,
    toggleKeyVisibility,
    handleImport,
    getFilteredKeys,
    getKeysByService
  };
}
