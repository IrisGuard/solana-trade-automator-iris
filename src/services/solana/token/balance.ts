
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenBalance } from '@/types/wallet';
import { SOLANA_ENDPOINTS } from '@/config/endpoints';

/**
 * Get the SOL balance for a wallet address
 * @param walletAddress The wallet address to get the balance for
 * @returns The SOL balance
 */
export async function getSolBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection(SOLANA_ENDPOINTS.RPC);
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    throw error;
  }
}

/**
 * Get the token balances for a wallet address
 * @param walletAddress The wallet address to get the token balances for
 * @returns An array of token balances
 */
export async function getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const connection = new Connection(SOLANA_ENDPOINTS.RPC);
    const publicKey = new PublicKey(walletAddress);
    
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID
    });

    return tokenAccounts.value.map(tokenAccount => {
      const accountData = tokenAccount.account.data.parsed.info;
      
      return {
        mint: accountData.mint,
        owner: accountData.owner,
        amount: accountData.tokenAmount.amount,
        decimals: accountData.tokenAmount.decimals
      };
    });
  } catch (error) {
    console.error('Error getting token balances:', error);
    return [];
  }
}
