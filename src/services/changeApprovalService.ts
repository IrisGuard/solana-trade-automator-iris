
import { supabase } from '@/integrations/supabase/client';
import type { PendingChange, ChangeSubmitData } from '@/types/changeApproval';
import { toast } from 'sonner';

export const changeApprovalService = {
  // Get all pending changes (for admins only)
  async getPendingChanges(): Promise<PendingChange[]> {
    try {
      const { data, error } = await supabase.rpc('get_pending_changes');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending changes:', error);
      toast.error('Failed to fetch pending changes');
      return [];
    }
  },
  
  // Get changes submitted by the current user
  async getUserChanges(): Promise<PendingChange[]> {
    try {
      const { data, error } = await supabase
        .from('pending_changes')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user changes:', error);
      toast.error('Failed to fetch your change requests');
      return [];
    }
  },
  
  // Submit a new change
  async submitChange(changeData: ChangeSubmitData): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc(
        'submit_change', 
        { 
          p_table_name: changeData.table_name,
          p_record_id: changeData.record_id,
          p_changes_json: changeData.changes_json
        }
      );
      
      if (error) throw error;
      toast.success('Change request submitted successfully');
      return data;
    } catch (error) {
      console.error('Error submitting change:', error);
      toast.error('Failed to submit change request');
      return null;
    }
  },
  
  // Approve a change (admin only)
  async approveChange(changeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc(
        'approve_change',
        { p_change_id: changeId }
      );
      
      if (error) throw error;
      toast.success('Change approved successfully');
      return true;
    } catch (error) {
      console.error('Error approving change:', error);
      toast.error('Failed to approve change');
      return false;
    }
  },
  
  // Reject a change (admin only)
  async rejectChange(changeId: string, comments?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc(
        'reject_change',
        { 
          p_change_id: changeId,
          p_comments: comments || null
        }
      );
      
      if (error) throw error;
      toast.success('Change rejected');
      return true;
    } catch (error) {
      console.error('Error rejecting change:', error);
      toast.error('Failed to reject change');
      return false;
    }
  },
  
  // Check if current user is admin
  async isUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};
