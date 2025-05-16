
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { PendingChange } from '@/services/changeApprovalService';

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
      
      // Query the pending_changes table
      const { data, error } = await supabase
        .from('pending_changes')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });
        
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
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
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
          comments: reason,
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
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
          submitter_id: user.id,
          table_name: 'general',
          record_id: 'manual-submission',
          changes_json: { description }
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
