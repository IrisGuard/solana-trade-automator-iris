
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

// Define the interface for pending changes
export interface PendingChange {
  id: string;
  submitter_id: string;
  table_name: string;
  record_id: string;
  changes_json: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  comments?: string;
  // Additional fields for backward compatibility
  title?: string;
  description?: string;
  requested_by?: string;
  approval_date?: string;
  approved_by?: string;
  rejected_reason?: string;
  created_at?: string;
}

// Get pending changes using a custom function
export async function getPendingChanges(): Promise<PendingChange[]> {
  try {
    const { data, error } = await supabase
      .from('pending_changes')
      .select('*')
      .eq('status', 'pending');
      
    if (error) {
      throw error;
    }
    
    return data as PendingChange[] || [];
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'changeApprovalService',
      source: 'getPendingChanges'
    });
    return [];
  }
}

// Approve a pending change
export async function approveChange(changeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pending_changes')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewer_id: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', changeId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'changeApprovalService',
      source: 'approveChange',
      details: { changeId }
    });
    return false;
  }
}

// Reject a pending change
export async function rejectChange(changeId: string, reason?: string): Promise<boolean> {
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
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'changeApprovalService',
      source: 'rejectChange',
      details: { changeId, reason }
    });
    return false;
  }
}

// Submit a change for approval
export async function submitChange(
  entityType: string,
  recordId: string,
  changes: any,
  title?: string,
  description?: string
): Promise<string | null> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data: result, error } = await supabase
      .from('pending_changes')
      .insert({
        submitter_id: user.id,
        table_name: entityType,
        record_id: recordId,
        changes_json: changes,
        status: 'pending',
        title: title || `Change for ${entityType} ${recordId}`,
        description: description || JSON.stringify(changes)
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return result.id;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'changeApprovalService',
      source: 'submitChange',
      details: { entityType, recordId }
    });
    return null;
  }
}
