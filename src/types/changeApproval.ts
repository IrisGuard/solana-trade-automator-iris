
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

export interface ChangeSubmitData {
  title?: string;
  description?: string;
  table_name?: string;
  record_id?: string;
  changes_json?: Record<string, any>;
}
