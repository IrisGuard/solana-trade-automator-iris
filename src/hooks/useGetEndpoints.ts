
import { useState, useEffect } from 'react';
import { ApiEndpoint } from '@/types/api';

export function useGetEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEndpoints = async () => {
      setLoading(true);
      try {
        // In a real application, this would fetch from an API
        // For now, we'll use mock data
        const mockEndpoints: ApiEndpoint[] = [
          {
            id: '1',
            name: 'Get Token Balance',
            url: '/api/v1/tokens/{address}/balance',
            description: 'Retrieve the token balance for a specific address',
            method: 'GET',
            category: 'Tokens',
            requiresAuth: true,
            status: 'active'
          },
          {
            id: '2',
            name: 'Get Wallet Transactions',
            url: '/api/v1/wallets/{address}/transactions',
            description: 'Fetch recent transactions for a wallet address',
            method: 'GET',
            category: 'Transactions',
            requiresAuth: true,
            status: 'active'
          },
          {
            id: '3',
            name: 'Create Trade Order',
            url: '/api/v1/trading/orders',
            description: 'Create a new trading order',
            method: 'POST',
            category: 'Trading',
            requiresAuth: true,
            status: 'active'
          },
          {
            id: '4',
            name: 'Update API Key',
            url: '/api/v1/auth/keys/{id}',
            description: 'Update an existing API key',
            method: 'PUT',
            category: 'Authentication',
            requiresAuth: true,
            status: 'active'
          },
          {
            id: '5',
            name: 'Delete API Key',
            url: '/api/v1/auth/keys/{id}',
            description: 'Remove an API key',
            method: 'DELETE',
            category: 'Authentication',
            requiresAuth: true,
            status: 'active'
          }
        ];
        
        setEndpoints(mockEndpoints);
        setError(null);
      } catch (err) {
        console.error('Error fetching endpoints:', err);
        setError('Failed to load API endpoints');
      } finally {
        setLoading(false);
      }
    };

    fetchEndpoints();
  }, []);

  return { endpoints, loading, error };
}
