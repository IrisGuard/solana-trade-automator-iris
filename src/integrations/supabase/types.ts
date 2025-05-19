export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys_storage: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_encrypted: boolean | null
          key_value: string
          name: string
          service: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          key_value: string
          name: string
          service: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          key_value?: string
          name?: string
          service?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      approved_addresses: {
        Row: {
          address: string
          blockchain: string
          created_at: string | null
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          address: string
          blockchain?: string
          created_at?: string | null
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          address?: string
          blockchain?: string
          created_at?: string | null
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      bot_performance: {
        Row: {
          bot_id: string
          id: string
          profit_amount: number | null
          profit_percentage: number | null
          successful_trades: number | null
          timestamp: string | null
          total_trades: number | null
        }
        Insert: {
          bot_id: string
          id?: string
          profit_amount?: number | null
          profit_percentage?: number | null
          successful_trades?: number | null
          timestamp?: string | null
          total_trades?: number | null
        }
        Update: {
          bot_id?: string
          id?: string
          profit_amount?: number | null
          profit_percentage?: number | null
          successful_trades?: number | null
          timestamp?: string | null
          total_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_performance_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bot_performance"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_templates: {
        Row: {
          created_at: string | null
          default_config: Json
          description: string | null
          id: string
          name: string
          strategy: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_config: Json
          description?: string | null
          id?: string
          name: string
          strategy: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_config?: Json
          description?: string | null
          id?: string
          name?: string
          strategy?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bot_transactions: {
        Row: {
          amount: number
          bot_id: string
          created_at: string | null
          id: string
          price: number | null
          signature: string | null
          status: string
          token_symbol: string
          transaction_type: string
        }
        Insert: {
          amount: number
          bot_id: string
          created_at?: string | null
          id?: string
          price?: number | null
          signature?: string | null
          status: string
          token_symbol: string
          transaction_type: string
        }
        Update: {
          amount?: number
          bot_id?: string
          created_at?: string | null
          id?: string
          price?: number | null
          signature?: string | null
          status?: string
          token_symbol?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_transactions_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bot"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          active: boolean | null
          config: Json | null
          created_at: string | null
          id: string
          name: string
          strategy: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          strategy: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          strategy?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          browser_info: Json | null
          component: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          resolution_notes: string | null
          resolved: boolean | null
          source: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          component?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          source: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          component?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          source?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          setting_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      solscan_data: {
        Row: {
          address: string
          created_at: string
          data_type: string
          id: string
          response: Json | null
        }
        Insert: {
          address: string
          created_at?: string
          data_type: string
          id?: string
          response?: Json | null
        }
        Update: {
          address?: string
          created_at?: string
          data_type?: string
          id?: string
          response?: Json | null
        }
        Relationships: []
      }
      tokens: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          logo: string | null
          name: string
          symbol: string
          token_address: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          symbol: string
          token_address: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          symbol?: string
          token_address?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_settings: {
        Row: {
          created_at: string | null
          delay_seconds: number | null
          id: string
          max_daily_amount: number | null
          max_transaction_amount: number | null
          notification_app: boolean | null
          notification_email: boolean | null
          updated_at: string | null
          user_id: string
          whitelist_only: boolean | null
        }
        Insert: {
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          max_daily_amount?: number | null
          max_transaction_amount?: number | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          updated_at?: string | null
          user_id: string
          whitelist_only?: boolean | null
        }
        Update: {
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          max_daily_amount?: number | null
          max_transaction_amount?: number | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          updated_at?: string | null
          user_id?: string
          whitelist_only?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: string
          block_time: string | null
          created_at: string | null
          destination: string | null
          id: string
          signature: string
          source: string | null
          status: string
          type: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount: string
          block_time?: string | null
          created_at?: string | null
          destination?: string | null
          id?: string
          signature: string
          source?: string | null
          status: string
          type: string
          user_id: string
          wallet_address: string
        }
        Update: {
          amount?: string
          block_time?: string | null
          created_at?: string | null
          destination?: string | null
          id?: string
          signature?: string
          source?: string | null
          status?: string
          type?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          device: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          location: string | null
          login_at: string | null
          logout_at: string | null
          user_id: string
        }
        Insert: {
          device?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          user_id: string
        }
        Update: {
          device?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string
          blockchain: string
          created_at: string | null
          id: string
          is_primary: boolean
          last_connected: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          blockchain?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean
          last_connected?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          blockchain?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean
          last_connected?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_error: {
        Args: {
          p_error_message: string
          p_error_stack?: string
          p_component?: string
          p_source?: string
          p_url?: string
          p_browser_info?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
