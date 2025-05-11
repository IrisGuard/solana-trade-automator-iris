
import { useState, useEffect } from "react";
import { ApiKey } from "../types";
import { toast } from "sonner";

// Προεπιλεγμένα κλειδιά επίδειξης
const demoKeys: ApiKey[] = [
  {
    id: "demo-1",
    name: "Binance API Key",
    key: "9HzJAsB7CsPvE2XTyCN9oQMPTMgn32mLvxF6sRt8",
    service: "binance",
    createdAt: "2024-02-15T10:30:00Z",
    description: "Χρήση για συναλλαγές στο Binance",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-2",
    name: "Solana Explorer",
    key: "s0LxpL0rEr4P1k3Y9nDtH3f4DA8m5sXz3G7vT8pH",
    service: "solana",
    createdAt: "2024-01-20T14:25:00Z",
    description: "Παρακολούθηση συναλλαγών Solana",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-3",
    name: "RPC Node Access",
    key: "rP3n0D3aCc3sS7kQ9mT5hY8jL2pV6cX1zN8bF5sG",
    service: "rpc",
    createdAt: "2023-11-10T09:15:00Z",
    description: "Σύνδεση με κόμβο RPC",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-4",
    name: "Exchange API (Παλιό)",
    key: "eXch4nG3K3y8B6vN3mL5hS9pQ7tR2zF1wP8kY3jC",
    service: "exchange",
    createdAt: "2023-08-05T16:45:00Z",
    description: "API πρόσβαση σε ανταλλαγή κρυπτονομισμάτων",
    status: "expired",
    expires: "2024-02-05T16:45:00Z",
    isWorking: false
  },
  {
    id: "demo-5",
    name: "Jupiter Aggregator",
    key: "jUp1T3r4gGr3g4T0rK3y5B7vC9mX1zL3pQ6sT8nM",
    service: "jupiter",
    createdAt: "2024-03-01T11:20:00Z",
    description: "Πρόσβαση στο Jupiter DEX Aggregator API",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-6",
    name: "Alchemy API (Ανακλημένο)",
    key: "4LcH3mY4P1k5Y7bV9cX1zL3pQ6sT8nM2hJ4kR7tP",
    service: "alchemy",
    createdAt: "2023-09-12T08:30:00Z",
    description: "Πρόσβαση στο Alchemy blockchain API",
    status: "revoked",
    isWorking: false
  },
  {
    id: "demo-7",
    name: "Web3 Development API",
    key: "w3B3d3V4P1k3Y9nD5hY8jL2pV6cX1zN8bF5sG7tR",
    service: "web3",
    createdAt: "2024-04-10T13:40:00Z",
    description: "API για Web3 εφαρμογές",
    status: "active",
    isWorking: true
  }
];

export function useApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isKeyVisible, setIsKeyVisible] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  
  // Φόρτωση κλειδιών από το localStorage μόνο μία φορά κατά την εκκίνηση
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        // Βεβαιωνόμαστε ότι έχουμε έγκυρα δεδομένα
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          console.log('Φορτώθηκαν κλειδιά από το localStorage:', parsedKeys.length);
          setApiKeys(parsedKeys);
        } else {
          console.log('Το localStorage δεν περιείχε έγκυρα κλειδιά, φόρτωση demo κλειδιών');
          setApiKeys(demoKeys);
          // Αποθηκεύουμε τα προεπιλεγμένα κλειδιά για μελλοντική χρήση
          localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
        }
      } catch (e) {
        console.error('Σφάλμα φόρτωσης κλειδιών:', e);
        console.log('Φόρτωση demo κλειδιών λόγω σφάλματος');
        setApiKeys(demoKeys);
        localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
      }
    } else {
      console.log('Δεν βρέθηκαν αποθηκευμένα κλειδιά, φόρτωση demo κλειδιών');
      setApiKeys(demoKeys);
      localStorage.setItem('apiKeys', JSON.stringify(demoKeys));
    }
  }, []);

  // Αποθήκευση κλειδιών στο localStorage όποτε αλλάζουν
  useEffect(() => {
    if (apiKeys.length > 0) {
      console.log('Αποθήκευση', apiKeys.length, 'κλειδιών στο localStorage');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

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
    setApiKeys(prev => prev.filter(key => key.id !== id));
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
