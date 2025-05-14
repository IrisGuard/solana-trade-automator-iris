
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Token } from '@/types/wallet';
import { HeliusService } from '../heliusService';
import { errorCollector } from '@/utils/error-handling/collector';

/**
 * Fetches all token accounts for a given wallet address
 * with enhanced error handling and rate limit protection
 */
export async function getParsedTokenAccounts(walletAddress: string): Promise<Token[]> {
  try {
    console.log("Fetching token accounts for address:", walletAddress);
    
    // Create connection using Helius RPC endpoint with key rotation
    const connection = new Connection(HeliusService.getRpcEndpoint());
    
    // Convert string address to PublicKey
    const pubKey = new PublicKey(walletAddress);
    
    // Get all token accounts for this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      pubKey,
      { programId: TOKEN_PROGRAM_ID },
      'confirmed'
    );
    
    // Map token accounts to our Token type
    const tokens: Token[] = tokenAccounts.value
      .filter(account => {
        const tokenAmount = account.account.data.parsed.info.tokenAmount;
        // Filter out tokens with zero balance
        return Number(tokenAmount.amount) > 0;
      })
      .map(account => {
        const accountData = account.account.data.parsed.info;
        const tokenAmount = accountData.tokenAmount;
        const mint = accountData.mint;
        
        return {
          address: mint,
          owner: walletAddress, 
          symbol: mint.substring(0, 4),  // Temporary symbol - will be updated with token metadata
          name: `Token ${mint.substring(0, 8)}...`, // Temporary name
          logo: "", // Will be updated with token metadata
          amount: parseFloat(tokenAmount.uiAmountString || '0'),
          decimals: tokenAmount.decimals,
          usdValue: 0, // Will be updated with price data
        };
      });
    
    console.log(`Found ${tokens.length} tokens for wallet ${walletAddress}`);
    return tokens;
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    errorCollector.captureError(error, {
      component: 'TokenService',
      method: 'getParsedTokenAccounts',
      walletAddress
    });
    return [];
  }
}
