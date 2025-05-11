
import { dbClient, Tables } from '@/integrations/supabase/client';
import { Token } from '@/hooks/useWalletConnection';

/**
 * User Profile Service
 */
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await dbClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Tables['profiles'];
  },
  
  async updateProfile(userId: string, updates: Partial<Tables['profiles']>) {
    const { data, error } = await dbClient
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  },
};

/**
 * Wallet Service
 */
export const walletService = {
  async saveWalletAddress(userId: string, address: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .upsert({ 
        user_id: userId, 
        address, 
        last_connected: new Date().toISOString(),
        is_primary: true,
        blockchain: 'solana' // Adding a default value
      });
    
    if (error) throw error;
    return data;
  },
  
  async getWalletByUser(userId: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });
    
    if (error) throw error;
    return data as Tables['wallets'][];
  },

  async getPrimaryWallet(userId: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is not an error in this context
      throw error;
    }
    
    return data as Tables['wallets'] | null;
  }
};

/**
 * Tokens Service
 */
export const tokensService = {
  async saveTokens(userId: string, tokens: Token[]) {
    // First remove existing tokens for this user
    await dbClient
      .from('tokens')
      .delete()
      .eq('user_id', userId);
    
    // Then insert new tokens
    const tokenData = tokens.map(token => ({
      user_id: userId,
      token_address: token.address,
      name: token.name,
      symbol: token.symbol,
      amount: token.amount,
      logo: token.logo
    }));
    
    const { data, error } = await dbClient
      .from('tokens')
      .insert(tokenData);
    
    if (error) throw error;
    return data;
  },
  
  async getTokensByUser(userId: string) {
    const { data, error } = await dbClient
      .from('tokens')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Tables['tokens'][];
  }
};

/**
 * Transactions Service
 */
export const transactionsService = {
  async saveTransaction(transaction: any) {
    const { data, error } = await dbClient
      .from('transactions')
      .insert([transaction]);
    
    if (error) throw error;
    return data;
  },
  
  async getTransactionsByUser(userId: string) {
    const { data, error } = await dbClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tables['transactions'][];
  },

  async getTransactionsByWallet(address: string) {
    const { data, error } = await dbClient
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tables['transactions'][];
  }
};

/**
 * Bots Service
 */
export const botsService = {
  async createBot(userId: string, botData: any) {
    const { data, error } = await dbClient
      .from('bots')
      .insert([{
        user_id: userId,
        ...botData,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return data;
  },
  
  async getBotsByUser(userId: string) {
    const { data, error } = await dbClient
      .from('bots')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Tables['bots'][];
  },
  
  async updateBot(botId: string, updates: any) {
    const { data, error } = await dbClient
      .from('bots')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', botId);
    
    if (error) throw error;
    return data;
  },
  
  async deleteBot(botId: string) {
    const { error } = await dbClient
      .from('bots')
      .delete()
      .eq('id', botId);
    
    if (error) throw error;
    return { success: true };
  }
};
