
import { Connection, PublicKey } from '@solana/web3.js';
import { Token } from '@/types/wallet';
import { RPC_ENDPOINTS } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';

export interface TokenWithMetadata extends Token {
  logo?: string;
}

/**
 * Fetches all token accounts for a given wallet address
 * @param walletAddress - The public key of the wallet
 * @returns Promise with array of tokens
 */
export async function fetchAllTokenAccounts(walletAddress: string): Promise<TokenWithMetadata[]> {
  try {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    // Create connection
    const connection = new Connection(RPC_ENDPOINTS.mainnet);
    
    // Convert string to PublicKey
    const wallet = new PublicKey(walletAddress);
    
    // Get all token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    const tokens: TokenWithMetadata[] = tokenAccounts.value.map(account => {
      const accountData = account.account.data.parsed.info;
      const mintAddress = accountData.mint;
      const amount = parseFloat(accountData.tokenAmount.amount);
      const decimals = accountData.tokenAmount.decimals;
      const uiAmount = amount / Math.pow(10, decimals);
      
      // We'd usually fetch these from a token list or API
      // For now, using placeholders
      return {
        address: mintAddress,
        name: `Token ${mintAddress.substring(0, 8)}`,
        symbol: `TKN-${mintAddress.substring(0, 4)}`,
        amount: uiAmount,
        decimals
      };
    })
    .filter(token => token.amount > 0); // Only show tokens with balance

    // Enrich with metadata if we have it
    // This would be where you'd call an API to get token metadata
    
    return tokens;
  } catch (error) {
    errorCollector.reportError(error instanceof Error ? error : new Error('Unknown error fetching token accounts'), {
      component: 'fetchAllTokenAccounts',
      severity: 'warning',
      message: 'Error fetching token accounts',
      code: 'TOKEN_ACCOUNTS_ERROR'
    });
    return [];
  }
}
