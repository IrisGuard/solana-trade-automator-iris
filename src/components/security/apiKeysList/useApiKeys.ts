
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  service: string;
  created_at: string;
  status: string;
  key_value: string;
}

export function useApiKeys(userId: string) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [userId]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch API keys from Supabase here
      // For now, using mock data
      setTimeout(() => {
        setApiKeys([
          {
            id: '1',
            name: 'Helius API Key',
            service: 'Helius',
            created_at: new Date().toISOString(),
            status: 'active',
            key_value: 'abc123def456'
          },
          {
            id: '2',
            name: 'CoinGecko API Key',
            service: 'CoinGecko',
            created_at: new Date().toISOString(),
            status: 'active',
            key_value: 'xyz789uvw012'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleAddKey = () => {
    console.log("Add API key");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  return {
    apiKeys,
    loading,
    visibleKeys,
    copiedKey,
    toggleKeyVisibility,
    handleCopy,
    handleAddKey,
    formatDate
  };
}
