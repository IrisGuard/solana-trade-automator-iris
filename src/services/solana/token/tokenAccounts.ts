
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logError } from '@/utils/errorUtils';

/**
 * Get all token accounts for a wallet
 * @param connection Solana connection
 * @param walletAddress Wallet address
 * @returns Array of token accounts
 */
export async function getTokenAccounts(connection: Connection, walletAddress: string) {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    
    // Get all token accounts for the wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    return tokenAccounts.value;
  } catch (error) {
    logError('Failed to get token accounts', 'tokenAccounts', { walletAddress });
    throw error;
  }
}

/**
 * Parse token accounts into a more usable format
 * @param connection Solana connection
 * @param tokenAccounts Token accounts from getTokenAccounts
 * @returns Parsed token accounts with balance and mint info
 */
export async function parseTokenAccounts(connection: Connection, tokenAccounts: any[]) {
  try {
    const parsedAccounts = [];
    
    for (const tokenAccount of tokenAccounts) {
      const accountData = Buffer.from(tokenAccount.account.data);
      const mint = new PublicKey(accountData.slice(0, 32));
      const owner = new PublicKey(accountData.slice(32, 64));
      const amount = accountData.readBigUInt64LE(64);
      
      // Only include accounts with a balance
      if (amount > 0) {
        parsedAccounts.push({
          pubkey: tokenAccount.pubkey.toBase58(),
          mint: mint.toBase58(),
          owner: owner.toBase58(),
          amount: Number(amount)
        });
      }
    }
    
    return parsedAccounts;
  } catch (error) {
    logError('Failed to parse token accounts', 'parseTokenAccounts', { walletAddress: 'unknown' });
    throw error;
  }
}
