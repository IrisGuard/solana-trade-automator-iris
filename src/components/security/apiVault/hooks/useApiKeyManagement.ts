
import { useApiKeyOperations } from "./useApiKeyOperations";
import { useApiKeyFilters } from "./useApiKeyFilters";
import { useApiKeyVisibility } from "./useApiKeyVisibility";
import { useApiKeyStorage } from "./useApiKeyStorage";

export function useApiKeyManagement() {
  // Βασικές λειτουργίες για τη διαχείριση των κλειδιών API
  const { apiKeys, setApiKeys, addNewKey, deleteKey, handleImport } = useApiKeyOperations([]);
  
  // Φίλτρα και αναζήτηση
  const { searchTerm, setSearchTerm, filterService, setFilterService, filterKeys, groupKeysByService } = useApiKeyFilters();
  
  // Διαχείριση ορατότητας
  const { isKeyVisible, toggleKeyVisibility } = useApiKeyVisibility();
  
  // Διαχείριση αποθήκευσης κλειδιών
  useApiKeyStorage(apiKeys, setApiKeys);
  
  return {
    // Κατάσταση των κλειδιών
    apiKeys,
    setApiKeys,
    
    // Διαχείριση ορατότητας
    isKeyVisible,
    toggleKeyVisibility,
    
    // Φίλτρα αναζήτησης
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    
    // Λειτουργίες κλειδιών
    addNewKey,
    deleteKey,
    handleImport,
    
    // Βοηθητικές συναρτήσεις
    getFilteredKeys: () => filterKeys(apiKeys),
    getKeysByService: () => groupKeysByService(apiKeys)
  };
}
