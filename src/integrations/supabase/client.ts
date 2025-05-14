
// Mock supabase client for development
// In a real app, this would be replaced with the actual Supabase client

// Mock Tables type for TypeScript support
export type Tables = {
  profiles: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
  };
  tokens: {
    id: string;
    user_id: string;
    token_address: string;
    name: string;
    symbol: string;
    amount?: number;
    logo?: string;
    created_at?: string;
    updated_at?: string;
  };
  transactions: {
    id: string;
    signature: string;
    wallet_address: string;
    user_id: string;
    type: string;
    status: string;
    amount: string;
    source?: string;
    destination?: string;
    block_time?: string;
    created_at?: string;
  };
  api_keys_storage: {
    id: string;
    user_id: string;
    name: string;
    key_value: string;
    service: string;
    description?: string;
    status?: string;
    is_encrypted?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  wallets: {
    id: string;
    user_id: string;
    address: string;
    blockchain: string;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
    last_connected?: string;
  };
  security_settings: {
    id: string;
    user_id: string;
    setting_name: string;
    is_enabled?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  bots: {
    id: string;
    user_id: string;
    name: string;
    strategy: string;
    active?: boolean;
    config?: any;
    created_at?: string;
    updated_at?: string;
  };
  bot_transactions: any;
  bot_performance: any;
  bot_templates: any;
  api_endpoints: any;
};

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock sign in with:', email, password);
      return { data: { user: null, session: null }, error: null };
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      console.log('Mock sign up with:', email, password, options);
      return { data: { user: null, session: null }, error: null };
    },
    signOut: async () => {
      console.log('Mock sign out');
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('Mock onAuthStateChange registered');
      // Return a mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Mock unsubscribe from auth state change');
            }
          }
        }
      };
    }
  },
  from: (table: string) => {
    return {
      select: (columns?: string) => {
        const baseResponse = {
          data: [],
          error: null,
          single: () => ({ data: null, error: null }),
          maybeSingle: () => ({ data: null, error: null }),
          order: (column: string, { ascending }: { ascending: boolean }) => ({ 
            data: [], 
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
            limit: (limit: number) => ({ data: [], error: null }),
            eq: (column: string, value: any) => ({ data: [], error: null }),
            in: (column: string, values: any[]) => ({ data: [], error: null }),
          }),
          match: (criteria: any) => ({
            data: [], 
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
          }),
          limit: (limit: number) => ({
            data: [], 
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
          }),
          eq: (column: string, value: any) => ({
            data: [],
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
            order: (col: string, opts: { ascending: boolean }) => ({
              data: [], 
              error: null,
              limit: (limit: number) => ({ data: [], error: null }),
            }),
            limit: (limit: number) => ({ data: [], error: null }),
            in: (col: string, values: any[]) => ({ data: [], error: null }),
          }),
          in: (column: string, values: any[]) => ({
            data: [],
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
          }),
          neq: (column: string, value: any) => ({
            data: [],
            error: null,
            single: () => ({ data: null, error: null }),
            maybeSingle: () => ({ data: null, error: null }),
          })
        };
        console.log(`Mock select ${columns || '*'} from ${table}`);
        return baseResponse;
      },
      insert: (data: any) => {
        console.log(`Mock insert into ${table}`, data);
        return {
          select: (columns?: string) => ({
            data: data ? [data] : null,
            error: null,
            single: () => ({ data: data || null, error: null }),
            maybeSingle: () => ({ data: data || null, error: null }),
          }),
          data: data ? [data] : null,
          error: null,
          single: () => ({ data: data || null, error: null }),
          maybeSingle: () => ({ data: data || null, error: null }),
        };
      },
      update: (data: any) => {
        console.log(`Mock update ${table}`, data);
        return {
          eq: (column: string, value: any) => {
            console.log(`where ${column} = ${value}`);
            return { 
              data: data ? [data] : null, 
              error: null,
              select: (columns?: string) => ({
                data: data ? [data] : null,
                error: null
              })
            };
          },
          match: (criteria: any) => {
            console.log(`match criteria`, criteria);
            return { 
              data: data ? [data] : null, 
              error: null,
              select: (columns?: string) => ({
                data: data ? [data] : null,
                error: null
              })
            };
          },
          data: null,
          error: null,
          select: (columns?: string) => ({
            data: null, 
            error: null,
            eq: (column: string, value: any) => ({
              data: data ? [data] : null,
              error: null
            })
          }),
        };
      },
      delete: () => {
        console.log(`Mock delete from ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`where ${column} = ${value}`);
            return { data: null, error: null };
          },
          match: (criteria: any) => {
            console.log(`match criteria`, criteria);
            return { data: null, error: null };
          },
          data: null,
          error: null,
        };
      },
      upsert: (data: any, options?: any) => {
        console.log(`Mock upsert into ${table}`, data, options);
        return { 
          data: data ? [data] : null, 
          error: null,
          select: (columns?: string) => ({
            data: data ? [data] : null,
            error: null
          })
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, data: any) => {
        console.log(`Mock upload to ${bucket}/${path}`);
        return { data: { path }, error: null };
      },
      download: async (path: string) => {
        console.log(`Mock download from ${bucket}/${path}`);
        return { data: null, error: null };
      },
      getPublicUrl: (path: string) => {
        return { data: { publicUrl: `https://mock-storage/${bucket}/${path}` } };
      }
    })
  },
  rpc: (method: string, params?: any) => {
    console.log(`Mock RPC call to ${method}`, params);
    return Promise.resolve({ data: null, error: null });
  }
};

// Re-export dbClient for compatibility
export const dbClient = supabase;
