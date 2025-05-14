
// Προσωρινό mock για το Supabase client
// Αυτό θα εξασφαλίσει ότι δεν θα σπάει η εφαρμογή αν δεν είναι ρυθμισμένο το Supabase

// Create a mock dbClient that mirrors the supabase client functionality
export const dbClient = {
  // Βασικές μέθοδοι που χρησιμοποιούνται στον κώδικα
  rpc: (functionName: string, params: any) => {
    console.log(`Mock Supabase RPC call to ${functionName}:`, params);
    return {
      data: null,
      error: null
    };
  },
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => ({
          data: null,
          error: null
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: [],
          error: null
        }),
        match: (criteria: any) => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      })
    }),
    insert: (data: any) => ({
      data: null,
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    })
  })
};

export const supabase = {
  // Βασικές μέθοδοι που χρησιμοποιούνται στον κώδικα
  rpc: (functionName: string, params: any) => {
    console.log(`Mock Supabase RPC call to ${functionName}:`, params);
    return {
      data: null,
      error: null
    };
  },
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ error: null }),
    signInWithPassword: ({ email, password }: { email: string; password: string }) => 
      Promise.resolve({ data: { user: null }, error: null }),
    signUp: ({ email, password }: { email: string; password: string }) =>
      Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => ({
          data: null,
          error: null
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: [],
          error: null
        }),
        match: (criteria: any) => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      })
    }),
    insert: (data: any) => ({
      data: null,
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    })
  })
};

// Add Types for Tables to prevent type errors
export type Tables = {
  profiles: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
  };
  wallets: {
    id: string;
    user_id: string;
    address: string;
    blockchain: string;
    is_primary: boolean;
    last_connected?: string;
    created_at?: string;
    updated_at?: string;
  };
  tokens: {
    id: string;
    user_id: string;
    token_address: string;
    name: string;
    symbol: string;
    amount: number;
    logo?: string;
    created_at?: string;
    updated_at?: string;
  };
  transactions: {
    id: string;
    user_id: string;
    wallet_address: string;
    signature: string;
    type: string;
    status: string;
    amount: string;
    source?: string;
    destination?: string;
    block_time?: string;
    created_at?: string;
  };
};
