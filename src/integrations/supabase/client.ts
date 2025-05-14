
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

// Define a better Mock response type
interface MockResponse {
  data: any;
  error: any | null;
  status: number;
  statusText: string;
  count: number | null;
}

// Helper function to create a standardized response
function createResponse(data: any = null, error: any = null): MockResponse {
  return {
    data,
    error,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
    count: Array.isArray(data) ? data.length : null
  };
}

// Improved mock chain builders
function buildSelectChain(data: any[] = []) {
  const selectChain = {
    data,
    error: null,
    single: () => ({ data: data.length > 0 ? data[0] : null, error: null }),
    maybeSingle: () => ({ data: data.length > 0 ? data[0] : null, error: null }),
    select: (columns?: string) => selectChain,
    eq: (column: string, value: any) => buildSelectChain(data),
    neq: (column: string, value: any) => buildSelectChain(data),
    gt: (column: string, value: any) => buildSelectChain(data),
    lt: (column: string, value: any) => buildSelectChain(data),
    gte: (column: string, value: any) => buildSelectChain(data),
    lte: (column: string, value: any) => buildSelectChain(data),
    like: (column: string, value: any) => buildSelectChain(data),
    ilike: (column: string, value: any) => buildSelectChain(data),
    is: (column: string, value: any) => buildSelectChain(data),
    in: (column: string, values: any[]) => buildSelectChain(data),
    contains: (column: string, value: any) => buildSelectChain(data),
    containedBy: (column: string, value: any) => buildSelectChain(data),
    rangeLt: (column: string, range: any) => buildSelectChain(data),
    rangeGt: (column: string, range: any) => buildSelectChain(data),
    rangeGte: (column: string, range: any) => buildSelectChain(data),
    rangeLte: (column: string, range: any) => buildSelectChain(data),
    rangeAdjacent: (column: string, range: any) => buildSelectChain(data),
    overlaps: (column: string, value: any) => buildSelectChain(data),
    textSearch: (column: string, query: string, options: any) => buildSelectChain(data),
    match: (query: any) => buildSelectChain(data),
    not: (column: string, operator: string, value: any) => buildSelectChain(data),
    or: (filters: string, options: any) => buildSelectChain(data),
    filter: (column: string, operator: string, value: any) => buildSelectChain(data),
    order: (column: string, options: any) => buildSelectChain(data),
    limit: (count: number) => buildSelectChain(data),
    range: (from: number, to: number) => buildSelectChain(data),
    abortSignal: (signal: AbortSignal) => buildSelectChain(data),
  };
  return selectChain;
}

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
      select: (columns?: string) => buildSelectChain([]),
      insert: (data: any, options?: any) => {
        console.log(`Mock insert into ${table}`, data, options);
        const insertChain = {
          select: (columns?: string) => ({ 
            data: Array.isArray(data) ? data : [data], 
            error: null,
            single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
            maybeSingle: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
            eq: (column: string, value: any) => insertChain,
          }),
          single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
          maybeSingle: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
          data: Array.isArray(data) ? data : [data], 
          error: null,
          eq: (column: string, value: any) => insertChain,
          neq: (column: string, value: any) => insertChain,
        };
        return insertChain;
      },
      update: (data: any) => {
        console.log(`Mock update ${table}`, data);
        const updateChain = {
          eq: (column: string, value: any) => {
            console.log(`where ${column} = ${value}`);
            return { 
              data: Array.isArray(data) ? data : [data],
              error: null,
              select: (columns?: string) => ({
                data: Array.isArray(data) ? data : [data],
                error: null,
                single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
                maybeSingle: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
                eq: (column: string, value: any) => updateChain,
                neq: (column: string, value: any) => updateChain,
              }),
              single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            };
          },
          neq: (column: string, value: any) => ({ 
            data: Array.isArray(data) ? data : [data], 
            error: null,
            select: (columns?: string) => ({
              data: Array.isArray(data) ? data : [data],
              error: null,
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            }),
            eq: (column: string, value: any) => updateChain,
            neq: (column: string, value: any) => updateChain,
          }),
          match: (criteria: any) => ({ 
            data: Array.isArray(data) ? data : [data], 
            error: null,
            select: (columns?: string) => ({
              data: Array.isArray(data) ? data : [data],
              error: null,
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            }),
            eq: (column: string, value: any) => updateChain,
            neq: (column: string, value: any) => updateChain,
          }),
          in: (column: string, values: any[]) => ({ 
            data: Array.isArray(data) ? data : [data], 
            error: null,
            select: (columns?: string) => ({
              data: Array.isArray(data) ? data : [data],
              error: null,
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            }),
            eq: (column: string, value: any) => updateChain,
            neq: (column: string, value: any) => updateChain,
          }),
          select: (columns?: string) => ({
            data: null, 
            error: null,
            eq: (column: string, value: any) => ({
              data: Array.isArray(data) ? data : [data],
              error: null,
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            }),
            neq: (column: string, value: any) => ({
              data: Array.isArray(data) ? data : [data],
              error: null,
              eq: (column: string, value: any) => updateChain,
              neq: (column: string, value: any) => updateChain,
            }),
          }),
          data: null,
          error: null,
        };
        return updateChain;
      },
      delete: () => {
        console.log(`Mock delete from ${table}`);
        const deleteChain = {
          eq: (column: string, value: any) => {
            console.log(`where ${column} = ${value}`);
            return { 
              data: null, 
              error: null,
              eq: (column: string, value: any) => deleteChain,
              neq: (column: string, value: any) => deleteChain,
            };
          },
          neq: (column: string, value: any) => {
            console.log(`where ${column} != ${value}`);
            return { 
              data: null, 
              error: null,
              eq: (column: string, value: any) => deleteChain,
              neq: (column: string, value: any) => deleteChain,
            };
          },
          match: (criteria: any) => {
            console.log(`match criteria`, criteria);
            return { 
              data: null, 
              error: null,
              eq: (column: string, value: any) => deleteChain,
              neq: (column: string, value: any) => deleteChain,
            };
          },
          in: (column: string, values: any[]) => {
            console.log(`where ${column} in (${values.join(', ')})`);
            return { 
              data: null, 
              error: null,
              eq: (column: string, value: any) => deleteChain,
              neq: (column: string, value: any) => deleteChain,
            };
          },
          data: null,
          error: null,
        };
        return deleteChain;
      },
      upsert: (data: any, options?: any) => {
        console.log(`Mock upsert into ${table}`, data, options);
        const upsertChain = {
          data: Array.isArray(data) ? data : [data], 
          error: null,
          select: (columns?: string) => ({
            data: Array.isArray(data) ? data : [data],
            error: null,
            single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
            maybeSingle: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
            eq: (column: string, value: any) => upsertChain,
            neq: (column: string, value: any) => upsertChain,
          }),
          eq: (column: string, value: any) => upsertChain,
          neq: (column: string, value: any) => upsertChain,
        };
        return upsertChain;
      },
      // Add the following methods directly on the returned object
      eq: (column: string, value: any) => buildSelectChain([]),
      neq: (column: string, value: any) => buildSelectChain([]),
      in: (column: string, values: any[]) => buildSelectChain([]),
      order: (column: string, options: any) => buildSelectChain([]),
      limit: (count: number) => buildSelectChain([]),
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
