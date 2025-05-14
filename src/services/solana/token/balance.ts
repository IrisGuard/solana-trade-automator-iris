import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logError } from '@/utils/errorUtils';

/**
 * Fetches the balance of a specific token for a given wallet address.
 *
 * @param walletAddress The public key of the wallet to fetch the balance for.
 * @param tokenMintAddress The mint address of the token to fetch the balance for.
 * @returns The balance of the token for the wallet, or null if an error occurs.
 */
export async function getTokenBalance(walletAddress: string, tokenMintAddress: string): Promise<number | null> {
  try {
    // Setup connection and public keys
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    // Fetch token accounts associated with the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    // Find the specific token account matching the tokenMintAddress
    const targetTokenAccount = tokenAccounts.value.find(
      (account) => account.account.data.parsed.info.mint === tokenMintPublicKey.toBase58()
    );

    // If the token account is not found, return 0
    if (!targetTokenAccount) {
      return 0;
    }

    // Extract and return the balance
    const balance = targetTokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
    return balance !== undefined ? balance : 0;
  } catch (error: any) {
    logError(error, 'getTokenBalance', { walletAddress, tokenMintAddress });
    return null;
  }
}
