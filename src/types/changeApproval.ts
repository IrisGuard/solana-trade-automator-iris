
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
}

export interface ChangeSubmitData {
  table_name: string;
  record_id: string;
  changes_json: Record<string, any>;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}
