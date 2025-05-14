
// Προσωρινό mock για το Supabase client
// Αυτό θα εξασφαλίσει ότι δεν θα σπάει η εφαρμογή αν δεν είναι ρυθμισμένο το Supabase

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
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: [],
        error: null
      })
    }),
    insert: () => ({
      data: null,
      error: null
    }),
    update: () => ({
      eq: () => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: () => ({
        data: null,
        error: null
      })
    })
  })
};
