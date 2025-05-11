
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';
import { Token } from '@/types/wallet';

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
