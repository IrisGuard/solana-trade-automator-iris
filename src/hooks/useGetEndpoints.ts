
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ApiEndpoint } from '@/types/api';

export function useGetEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchEndpoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('api_endpoints')
        .select('*')
        .order('name');
      
      if (fetchError) {
        throw fetchError;
      }
      
      setEndpoints(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching API endpoints:', err);
      setError(err.message || 'Σφάλμα φόρτωσης των endpoints');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);
  
  const refetch = useCallback(async () => {
    return fetchEndpoints();
  }, [fetchEndpoints]);
  
  return {
    endpoints,
    isLoading,
    error,
    refetch
  };
}
