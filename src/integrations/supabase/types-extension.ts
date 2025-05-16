
import type { Database } from './types';

// Extend the Database types with pending_changes table
// This will be used until Supabase auto-generates the updated types
export type ExtendedDatabase = Database & {
  public: {
    Tables: Database['public']['Tables'] & {
      pending_changes: {
        Row: {
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
          title?: string;
          description?: string;
          requested_by?: string;
          approval_date?: string;
          approved_by?: string;
          rejected_reason?: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          submitter_id: string;
          table_name: string;
          record_id: string;
          changes_json: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string;
          reviewer_id?: string;
          comments?: string;
          title?: string;
          description?: string;
          requested_by?: string;
          approval_date?: string;
          approved_by?: string;
          rejected_reason?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          submitter_id?: string;
          table_name?: string;
          record_id?: string;
          changes_json?: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string;
          reviewer_id?: string;
          comments?: string;
          title?: string;
          description?: string;
          requested_by?: string;
          approval_date?: string;
          approved_by?: string;
          rejected_reason?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pending_changes_submitter_id_fkey";
            columns: ["submitter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pending_changes_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
};
