
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

// Define the interface for pending changes
export interface PendingChange {
  id: string;
  change_type: string;
  entity_type: string;
  entity_id: string;
  data: any;
  created_at: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Get pending changes using a custom function
export async function getPendingChanges(): Promise<PendingChange[]> {
  try {
    // Check if the table exists first
    const { data: tableExists } = await supabase
      .from('pending_changes')
      .select('id')
      .limit(1);
    
    // If the table exists, query it directly
    if (tableExists) {
      const { data, error } = await supabase
        .from('pending_changes')
        .select('*')
        .eq('status', 'pending');
        
      if (error) {
        throw error;
      }
      
      return data as PendingChange[] || [];
    } else {
      // Return empty array if table doesn't exist
      return [];
    }
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
      .update({ status: 'approved' })
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
        rejection_reason: reason
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
  changeType: 'create' | 'update' | 'delete',
  entityId: string,
  data: any
): Promise<string | null> {
  try {
    const { data: result, error } = await supabase
      .from('pending_changes')
      .insert({
        entity_type: entityType,
        change_type: changeType,
        entity_id: entityId,
        data,
        status: 'pending'
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
      details: { entityType, changeType, entityId }
    });
    return null;
  }
}
