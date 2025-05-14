
import { useState, useMemo } from "react";
import { ApiKey, ApiKeyStats, ServiceInfo } from "../types";

export function useApiKeyFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");

  const filterKeys = (keys: ApiKey[]) => {
    return keys.filter(key => {
      // Search by name or key value
      const matchesSearch = !searchTerm || 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (key.key && key.key.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by service
      const matchesService = !filterService || key.service === filterService;
      
      return matchesSearch && matchesService;
    });
  };

  const groupKeysByService = (keys: ApiKey[]) => {
    return keys.reduce<Record<string, ApiKey[]>>((acc, key) => {
      const service = key.service || 'other';
      acc[service] = acc[service] || [];
      acc[service].push(key);
      return acc;
    }, {});
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

// Utility functions that can be used without the hook
export const calculateKeyStats = (apiKeys: ApiKey[]): ApiKeyStats => ({
  total: apiKeys.length,
  active: apiKeys.filter(key => key.status === "active" || !key.status).length,
  expired: apiKeys.filter(key => key.status === "expired").length,
  revoked: apiKeys.filter(key => key.status === "revoked").length,
});

export const groupKeysByService = (apiKeys: ApiKey[]): ServiceInfo[] => {
  const keysByService = apiKeys.reduce<Record<string, ApiKey[]>>((acc, key) => {
    const service = key.service || 'other';
    acc[service] = acc[service] || [];
    acc[service].push(key);
    return acc;
  }, {});
  
  return Object.entries(keysByService).map(([serviceName, keys]) => ({
    name: serviceName,
    service: serviceName,
    count: keys.length,
    workingCount: keys.filter(k => k.isWorking).length,
    expiredCount: keys.filter(k => k.status === 'expired').length
  }));
};
