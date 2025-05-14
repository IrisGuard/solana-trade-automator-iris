
import { useState, useEffect } from 'react';
import { fetchApiEndpoints } from '@/utils/supabaseEndpoints';

export interface ApiEndpoint {
  id?: string;
  name: string;
  url: string;
  category?: string;
  is_active?: boolean;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useGetEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    setLoading(true);
    try {
      const data = await fetchApiEndpoints();
      setEndpoints(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading endpoints'));
      console.error('Error loading endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    endpoints,
    loading,
    error,
    reloadEndpoints: loadEndpoints
  };
}
