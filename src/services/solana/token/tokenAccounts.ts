
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { Token } from '@/types/wallet';
import { RPC_ENDPOINTS } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';

// Define connection - fix the RPC_ENDPOINTS.MAINNET error
const connection = new Connection(RPC_ENDPOINTS.PRIMARY || 'https://api.mainnet-beta.solana.com');

/**
 * Get token accounts for a given wallet address
 */
export async function getTokenAccounts(walletAddress: string): Promise<any[]> {
  try {
    // Get account info
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    // Extract token data
    return tokenAccounts.value.map((tokenAccount) => {
      const accountData = tokenAccount.account.data.parsed.info;
      return {
        mint: accountData.mint,
        address: tokenAccount.pubkey.toString(),
        amount: accountData.tokenAmount.amount,
        decimals: accountData.tokenAmount.decimals,
        uiAmount: accountData.tokenAmount.uiAmount,
      };
    });
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    errorCollector.captureError(error as Error, {
      component: 'TokenAccounts',
      details: { walletAddress },
      source: 'client'
    });
    return [];
  }
}

/**
 * Get parsed token accounts with name and symbol
 * This function extends token accounts with name and symbol information
 */
export async function getParsedTokenAccounts(walletAddress: string): Promise<Token[]> {
  try {
    const accounts = await getTokenAccounts(walletAddress);
    
    // Transform to Token type - this would normally fetch token metadata
    // to get name and symbol, but for now we'll set placeholders
    return accounts.map(account => ({
      mint: account.mint,
      address: account.address,
      amount: account.amount,
      decimals: account.decimals,
      uiAmount: account.uiAmount,
      name: `Token ${account.mint.substring(0, 6)}...`,
      symbol: `TKN-${account.mint.substring(0, 3)}`
    }));
    
  } catch (error) {
    console.error('Error getting parsed token accounts:', error);
    errorCollector.captureError(error as Error, {
      component: 'TokenAccounts',
      details: { walletAddress },
      source: 'client'
    });
    return [];
  }
}
