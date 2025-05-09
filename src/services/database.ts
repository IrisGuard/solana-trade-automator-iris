
import { supabase } from '@/integrations/supabase/client';
import { Token } from '@/hooks/useWalletConnection';

/**
 * User Profile Service
 */
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from('wallets')
      .upsert({ 
        user_id: userId, 
        address, 
        last_connected: new Date(),
        is_primary: true
      });
    
    if (error) throw error;
    return data;
  },
  
  async getWalletByUser(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPrimaryWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is not an error in this context
      throw error;
    }
    
    return data || null;
  }
};

/**
 * Tokens Service
 */
export const tokensService = {
  async saveTokens(userId: string, tokens: Token[]) {
    // First remove existing tokens for this user
    await supabase
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
    
    const { data, error } = await supabase
      .from('tokens')
      .insert(tokenData);
    
    if (error) throw error;
    return data;
  },
  
  async getTokensByUser(userId: string) {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};

/**
 * Transactions Service
 */
export const transactionsService = {
  async saveTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction]);
    
    if (error) throw error;
    return data;
  },
  
  async getTransactionsByUser(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTransactionsByWallet(address: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

/**
 * Bots Service
 */
export const botsService = {
  async createBot(userId: string, botData: any) {
    const { data, error } = await supabase
      .from('bots')
      .insert([{
        user_id: userId,
        ...botData
      }]);
    
    if (error) throw error;
    return data;
  },
  
  async getBotsByUser(userId: string) {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },
  
  async updateBot(botId: string, updates: any) {
    const { data, error } = await supabase
      .from('bots')
      .update(updates)
      .eq('id', botId);
    
    if (error) throw error;
    return data;
  },
  
  async deleteBot(botId: string) {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', botId);
    
    if (error) throw error;
    return { success: true };
  }
};
