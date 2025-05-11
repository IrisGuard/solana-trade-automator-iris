
import { useState } from "react";
import { ApiKey } from "../types";

export function useApiKeyFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");

  // Φιλτράρισμα κλειδιών βάσει κριτηρίων αναζήτησης
  const filterKeys = (apiKeys: ApiKey[]) => {
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

  // Ομαδοποίηση κλειδιών ανά υπηρεσία
  const groupKeysByService = (apiKeys: ApiKey[]): Record<string, ApiKey[]> => {
    const grouped: Record<string, ApiKey[]> = {};
    
    filterKeys(apiKeys).forEach(key => {
      const service = key.service.toLowerCase();
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push(key);
    });
    
    return grouped;
  };

  return {
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    filterKeys,
    groupKeysByService
  };
}
