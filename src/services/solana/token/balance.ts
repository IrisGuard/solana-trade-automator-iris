
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { errorCollector } from "@/utils/error-handling/collector";
import { SOLANA_RPC_ENDPOINTS } from "@/config/endpoints";

/**
 * Get the SOL balance for a wallet address
 */
export async function getSolanaBalance(
  walletAddress: string
): Promise<number | null> {
  try {
    // Initialize connection
    const connection = new Connection(SOLANA_RPC_ENDPOINTS.MAINNET);
    
    // Parse wallet public key
    const publicKey = new PublicKey(walletAddress);
    
    // Get SOL balance
    const balance = await connection.getBalance(publicKey);
    
    // Convert from lamports to SOL
    return balance / 1_000_000_000;
  } catch (error) {
    errorCollector.captureError(
      error instanceof Error ? error : new Error("Unknown error getting SOL balance"), 
      {
        component: "BalanceService",
        details: { walletAddress },
        source: "getSolanaBalance"
      }
    );
    return null;
  }
}

/**
 * Get all SPL token balances for a wallet
 */
export async function getSplTokenBalances(walletAddress: string) {
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
    
    // Process token accounts
    const tokens = tokenAccounts.value.map((tokenAccount) => {
      const parsedInfo = tokenAccount.account.data.parsed.info;
      
      return {
        mint: parsedInfo.mint,
        amount: parsedInfo.tokenAmount.uiAmount,
        decimals: parsedInfo.tokenAmount.decimals
      };
    });
    
    return tokens;
  } catch (error) {
    errorCollector.captureError(
      error instanceof Error ? error : new Error("Unknown error getting SPL token balances"), 
      {
        component: "BalanceService",
        details: { walletAddress },
        source: "getSplTokenBalances"
      }
    );
    return [];
  }
}
