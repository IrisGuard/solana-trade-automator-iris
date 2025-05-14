
// Mock supabase client for development
// In a real app, this would be replaced with the actual Supabase client

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
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock select ${columns || '*'} from ${table} where ${column} = ${value}`);
            return {
              data: [],
              error: null,
              single: () => ({ data: null, error: null }),
              order: (column: string, { ascending }: { ascending: boolean }) => ({ data: [], error: null }),
              match: (criteria: any) => ({ data: [], error: null }),
              limit: (limit: number) => ({ data: [], error: null }),
              in: (column: string, values: any[]) => ({ data: [], error: null }),
            };
          },
          order: (column: string, { ascending }: { ascending: boolean }) => {
            console.log(`Mock select ${columns || '*'} from ${table} order by ${column} ${ascending ? 'asc' : 'desc'}`);
            return { data: [], error: null };
          },
          match: (criteria: any) => {
            console.log(`Mock select ${columns || '*'} from ${table} match criteria`, criteria);
            return { data: [], error: null };
          },
          data: [],
          error: null,
          limit: (limit: number) => {
            console.log(`Mock select ${columns || '*'} from ${table} limit ${limit}`);
            return { data: [], error: null };
          },
          eq: (column: string, value: any) => {
            console.log(`Mock select ${columns || '*'} from ${table} where ${column} = ${value}`);
            return {
              data: [],
              error: null,
              single: () => ({ data: null, error: null }),
              order: () => ({ data: [], error: null }),
              limit: (limit: number) => ({ data: [], error: null }),
            };
          },
          single: () => {
            console.log(`Mock select ${columns || '*'} from ${table} single`);
            return { data: null, error: null };
          },
          in: (column: string, values: any[]) => {
            console.log(`Mock select ${columns || '*'} from ${table} where ${column} in [${values.join(', ')}]`);
            return { data: [], error: null };
          }
        };
      },
      insert: (data: any) => {
        console.log(`Mock insert into ${table}`, data);
        return {
          select: (columns?: string) => ({
            data: null,
            error: null,
            single: () => ({ data: null, error: null }),
          }),
          data: null,
          error: null,
        };
      },
      update: (data: any) => {
        console.log(`Mock update ${table}`, data);
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
      delete: () => {
        console.log(`Mock delete from ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`where ${column} = ${value}`);
            return { data: null, error: null };
          },
          data: null,
          error: null,
        };
      },
      upsert: (data: any) => {
        console.log(`Mock upsert into ${table}`, data);
        return { data: null, error: null };
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
    return Promise.resolve(null);
  }
};

// Re-export dbClient for compatibility
export const dbClient = supabase;
