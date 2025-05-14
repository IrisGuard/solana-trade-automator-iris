
import { useState, useEffect, useCallback } from 'react';
import { ApiEndpoint } from '@/types/api';
import { toast } from 'sonner';

// Mock endpoints data
const mockEndpoints: ApiEndpoint[] = [
  {
    id: '1',
    name: 'Solana Mainnet RPC',
    url: 'https://api.mainnet-beta.solana.com',
    active: true,
    apiKey: 'sol_xxxx1234',
    description: 'Primary Solana RPC endpoint'
  },
  {
    id: '2',
    name: 'Solana Testnet RPC',
    url: 'https://api.testnet.solana.com',
    active: true,
    description: 'Testnet RPC for development'
  },
  {
    id: '3',
    name: 'Custom API',
    url: 'https://my-custom-api.example.com',
    active: false,
    apiKey: 'custom_api_key',
    description: 'Custom API for special features'
  }
];

export const useGetEndpoints = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEndpoints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setEndpoints(mockEndpoints);
    } catch (err: any) {
      console.error('Error fetching endpoints:', err);
      setError(err.message || 'Failed to load endpoints');
      toast.error('Failed to load endpoints');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEndpoint = useCallback(async (endpoint: Omit<ApiEndpoint, 'id'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEndpoint: ApiEndpoint = {
        ...endpoint,
        id: `${Date.now()}`,
      };
      
      setEndpoints(prev => [...prev, newEndpoint]);
      toast.success('Endpoint added successfully');
      return newEndpoint;
    } catch (err: any) {
      console.error('Error adding endpoint:', err);
      toast.error('Failed to add endpoint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEndpoint = useCallback(async (endpoint: ApiEndpoint) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEndpoints(prev => prev.map(ep => 
        ep.id === endpoint.id ? endpoint : ep
      ));
      
      toast.success('Endpoint updated successfully');
      return endpoint;
    } catch (err: any) {
      console.error('Error updating endpoint:', err);
      toast.error('Failed to update endpoint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEndpoint = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEndpoints(prev => prev.filter(ep => ep.id !== id));
      toast.success('Endpoint deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting endpoint:', err);
      toast.error('Failed to delete endpoint');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  return {
    endpoints,
    loading,
    error,
    fetchEndpoints,
    addEndpoint,
    updateEndpoint,
    deleteEndpoint
  };
};
