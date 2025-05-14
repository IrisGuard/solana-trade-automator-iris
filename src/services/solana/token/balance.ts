
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import { RPC_ENDPOINTS } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';

// Interface for the returned balance
export interface TokenBalance {
  address: string;
  amount: number;
  decimals: number;
  uiAmount: number;
}

/**
 * Fetches the balance of a specific token for a given wallet address
 * @param walletAddress - The public key of the wallet
 * @param tokenAddress - The public key of the token
 * @returns Promise with the token balance
 */
export async function fetchTokenBalance(
  walletAddress: string, 
  tokenAddress: string
): Promise<TokenBalance | null> {
  try {
    // Create connection
    const connection = new Connection(RPC_ENDPOINTS.mainnet);
    
    // Convert strings to PublicKeys
    const wallet = new PublicKey(walletAddress);
    const token = new PublicKey(tokenAddress);
    
    // Find the associated token account
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, { mint: token });
    
    // If the wallet has no token accounts for this mint, return 0 balance
    if (tokenAccounts.value.length === 0) {
      return {
        address: tokenAddress,
        amount: 0,
        decimals: 0,
        uiAmount: 0
      };
    }
    
    // Get the token account with the highest balance
    const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
    const decimals = accountInfo.tokenAmount.decimals;
    const amount = parseFloat(accountInfo.tokenAmount.amount);
    const uiAmount = amount / Math.pow(10, decimals);
    
    return {
      address: tokenAddress,
      amount,
      decimals,
      uiAmount
    };
  } catch (error) {
    errorCollector.reportError(error instanceof Error ? error : new Error('Unknown error fetching token balance'), {
      component: 'fetchTokenBalance',
      severity: 'warning',
      message: `Error fetching balance for token ${tokenAddress}`,
      code: 'TOKEN_BALANCE_ERROR'
    });
    return null;
  }
}
