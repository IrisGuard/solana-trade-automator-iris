
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { errorCollector } from "@/utils/error-handling/collector";
import { SOLANA_RPC_ENDPOINTS } from "@/config/endpoints";

/**
 * Get parsed token accounts for a wallet
 */
export async function getTokenAccounts(walletAddress: string) {
  try {
    // Initialize connection
    const connection = new Connection(SOLANA_RPC_ENDPOINTS.MAINNET);
    
    // Parse wallet public key
    const publicKey = new PublicKey(walletAddress);
    
    // Get all token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey, 
      { programId: TOKEN_PROGRAM_ID }
    );
    
    // Return the raw token account data
    return tokenAccounts.value;
  } catch (error) {
    errorCollector.captureError(
      error instanceof Error ? error : new Error("Error getting token accounts"), 
      {
        component: "TokenAccountsService",
        details: { walletAddress },
        source: "getTokenAccounts"
      }
    );
    return [];
  }
}

/**
 * Get parsed token accounts with balances for a wallet
 */
export async function getTokenAccountsWithBalances(walletAddress: string) {
  try {
    // Get token accounts
    const tokenAccounts = await getTokenAccounts(walletAddress);
    
    // Process token accounts
    return tokenAccounts.map((tokenAccount) => {
      const parsedInfo = tokenAccount.account.data.parsed.info;
      
      return {
        mint: parsedInfo.mint,
        tokenAccount: tokenAccount.pubkey.toString(),
        amount: parsedInfo.tokenAmount.uiAmount,
        decimals: parsedInfo.tokenAmount.decimals
      };
    });
  } catch (error) {
    errorCollector.captureError(
      error instanceof Error ? error : new Error("Error processing token accounts"), 
      {
        component: "TokenAccountsService",
        details: { walletAddress },
        source: "getTokenAccountsWithBalances"
      }
    );
    return [];
  }
}
