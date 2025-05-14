
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import type { Token } from '@/types/wallet';

export interface TokenRecord {
  id: string;
  user_id: string;
  token_address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export const tokensService = {
  /**
   * Fetch all tokens for a user
   */
  async getUserTokens(userId: string): Promise<TokenRecord[]> {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error fetching user tokens'),
        { component: 'tokensService', source: 'getUserTokens' }
      );
      return [];
    }
  },
  
  /**
   * Save or update tokens for a user
   */
  async saveUserTokens(userId: string, tokens: Token[]): Promise<boolean> {
    try {
      // First, get existing tokens for this user
      const { data: existingTokens, error: fetchError } = await supabase
        .from('tokens')
        .select('token_address')
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      
      const existingAddresses = new Set((existingTokens || []).map(t => t.token_address));
      const tokensToUpdate = [];
      const tokensToInsert = [];
      
      // Separate tokens that need to be updated vs inserted
      for (const token of tokens) {
        if (existingAddresses.has(token.address)) {
          tokensToUpdate.push({
            token_address: token.address,
            amount: token.amount,
            updated_at: new Date().toISOString()
          });
        } else {
          tokensToInsert.push({
            user_id: userId,
            token_address: token.address,
            name: token.name,
            symbol: token.symbol,
            amount: token.amount,
            logo: token.logo
          });
        }
      }
      
      // Update existing tokens
      if (tokensToUpdate.length > 0) {
        for (const token of tokensToUpdate) {
          const { error: updateError } = await supabase
            .from('tokens')
            .update({
              amount: token.amount,
              updated_at: token.updated_at
            })
            .eq('user_id', userId)
            .eq('token_address', token.token_address);
          
          if (updateError) throw updateError;
        }
      }
      
      // Insert new tokens
      if (tokensToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('tokens')
          .insert(tokensToInsert);
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error saving user tokens'),
        { component: 'tokensService', source: 'saveUserTokens' }
      );
      return false;
    }
  },
  
  /**
   * Update a single token amount
   */
  async updateTokenAmount(userId: string, tokenAddress: string, amount: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tokens')
        .update({
          amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('token_address', tokenAddress);
      
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error updating token amount'),
        { component: 'tokensService', source: 'updateTokenAmount' }
      );
      return false;
    }
  },
  
  /**
   * Delete a token from the user's list
   */
  async deleteToken(tokenId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tokens')
        .delete()
        .eq('id', tokenId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error deleting token'),
        { component: 'tokensService', source: 'deleteToken' }
      );
      return false;
    }
  },
  
  /**
   * Convert TokenRecord from database to Token object used in frontend
   */
  mapDatabaseTokenToModel(record: TokenRecord): Token {
    return {
      address: record.token_address,
      name: record.name,
      symbol: record.symbol,
      amount: record.amount,
      decimals: 9, // Default for most Solana tokens
      logo: record.logo
    };
  }
};
