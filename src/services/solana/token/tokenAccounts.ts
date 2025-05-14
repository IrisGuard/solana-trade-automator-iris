
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SOLANA_ENDPOINTS } from '@/config/endpoints';

/**
 * Interface for token account information
 */
export interface TokenAccountInfo {
  address: string;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
}

/**
 * Get all token accounts for a wallet address
 * @param walletAddress The wallet address to get token accounts for
 * @returns An array of token account information
 */
export async function getTokenAccounts(walletAddress: string): Promise<TokenAccountInfo[]> {
  try {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const connection = new Connection(SOLANA_ENDPOINTS.RPC);
    const publicKey = new PublicKey(walletAddress);
    
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID
    });

    return tokenAccounts.value.map(account => {
      const parsedInfo = account.account.data.parsed.info;
      
      return {
        address: account.pubkey.toBase58(),
        mint: parsedInfo.mint,
        owner: parsedInfo.owner,
        amount: parsedInfo.tokenAmount.amount,
        decimals: parsedInfo.tokenAmount.decimals
      };
    });
  } catch (error) {
    console.error('Error getting token accounts:', error);
    return [];
  }
}
