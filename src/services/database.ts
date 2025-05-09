
import { supabase } from '@/lib/supabase';

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
  
  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile]);
    
    if (error) throw error;
    return data;
  }
};

/**
 * Wallet Service
 */
export const walletService = {
  async saveWalletAddress(userId: string, address: string) {
    const { data, error } = await supabase
      .from('wallets')
      .upsert({ user_id: userId, address, last_connected: new Date() });
    
    if (error) throw error;
    return data;
  },
  
  async getWalletByUser(userId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};

/**
 * Tokens Service
 */
export const tokensService = {
  async saveTokens(userId: string, tokens: any[]) {
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
  
  async getTransactionsByWallet(address: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', address)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
