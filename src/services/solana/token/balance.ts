
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logError } from '@/utils/errorUtils';

/**
 * Get SPL token balance for a wallet
 * @param connection Solana connection
 * @param walletAddress Wallet address
 * @param tokenAddress SPL token address
 * @returns Token balance as number
 */
export async function getTokenBalance(
  connection: Connection, 
  walletAddress: string, 
  tokenAddress: string
): Promise<number> {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenPublicKey = new PublicKey(tokenAddress);
    
    // Find associated token account
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletPublicKey,
      { mint: tokenPublicKey }
    );
    
    if (tokenAccounts.value.length === 0) {
      return 0; // No token account found
    }
    
    // Get the token account info
    const accountInfo = tokenAccounts.value[0].account;
    const data = Buffer.from(accountInfo.data);
    
    // Extract the balance (64-bit integer at offset 64)
    const balance = data.readBigUInt64LE(64);
    
    return Number(balance);
  } catch (error) {
    logError(`Failed to get token balance for ${tokenAddress}`, 'tokenBalance', error);
    throw error;
  }
}

/**
 * Get SOL balance for a wallet
 * @param connection Solana connection
 * @param walletAddress Wallet address
 * @returns SOL balance as number
 */
export async function getSolBalance(
  connection: Connection,
  walletAddress: string
): Promise<number> {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(walletPublicKey);
    return balance / 1_000_000_000; // Convert lamports to SOL
  } catch (error) {
    logError('Failed to get SOL balance', 'solBalance', { 
      walletAddress, 
      tokenAddress: 'SOL' 
    });
    throw error;
  }
}
