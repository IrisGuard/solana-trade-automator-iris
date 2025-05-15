
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

// Define the PendingChange interface
interface PendingChange {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  requested_by: string;
  approval_date?: string;
  approved_by?: string;
  rejected_reason?: string;
}

export function useChangeApproval() {
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPendingChanges();
  }, []);

  const fetchPendingChanges = async () => {
    try {
      setLoading(true);
      
      // Directly query the pending_changes table
      const { data, error } = await supabase
        .from('pending_changes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPendingChanges(data as PendingChange[] || []);
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useChangeApproval',
        source: 'fetchPendingChanges'
      });
      
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const approveChange = async (changeId: string) => {
    try {
      const { error } = await supabase
        .from('pending_changes')
        .update({ 
          status: 'approved',
          approval_date: new Date().toISOString(),
          approved_by: supabase.auth.getUser().then(({ data }) => data.user?.id)
        })
        .eq('id', changeId);

      if (error) throw error;
      
      // Refresh the list after approving
      await fetchPendingChanges();
      
      return { error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useChangeApproval',
        source: 'approveChange'
      });
      
      return { error: err as Error };
    }
  };

  const rejectChange = async (changeId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('pending_changes')
        .update({ 
          status: 'rejected',
          rejected_reason: reason
        })
        .eq('id', changeId);

      if (error) throw error;
      
      // Refresh the list after rejecting
      await fetchPendingChanges();
      
      return { error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useChangeApproval',
        source: 'rejectChange'
      });
      
      return { error: err as Error };
    }
  };

  const submitChange = async (title: string, description: string) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('pending_changes')
        .insert({
          title,
          description,
          status: 'pending',
          requested_by: user.id
        });

      if (error) throw error;
      
      // Refresh the list after submitting
      await fetchPendingChanges();
      
      return { error: null };
    } catch (err) {
      errorCollector.captureError(err as Error, {
        component: 'useChangeApproval',
        source: 'submitChange'
      });
      
      return { error: err as Error };
    }
  };

  return {
    pendingChanges,
    loading,
    error,
    fetchPendingChanges,
    approveChange,
    rejectChange,
    submitChange,
  };
}
