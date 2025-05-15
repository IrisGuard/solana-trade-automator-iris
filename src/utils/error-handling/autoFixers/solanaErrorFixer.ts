
import { BotError } from "../errorTypes";
import { RPC_ENDPOINTS } from "../constants";

export function fixSolanaError(error: BotError): { fixed: boolean, newEndpoint?: string } {
  // Handle common Solana JSON RPC errors
  if (error.message?.includes('429 Too Many Requests') || 
      error.message?.includes('Server responded with 429') ||
      error.message?.includes('Rate limit exceeded')) {
    // Switch to backup RPC endpoint
    return { fixed: true, newEndpoint: RPC_ENDPOINTS.BACKUP };
  }
  
  // Handle timeout errors
  if (error.message?.includes('timeout') || error.message?.includes('connection refused')) {
    // The current endpoint might be down, try fallback
    return { fixed: true, newEndpoint: RPC_ENDPOINTS.FALLBACK };
  }

  // If we have metadata, use it to make more specific fixes
  const metadata = error.metadata || {};
  if (metadata.rpcEndpoint && metadata.rpcEndpoint.includes('mainnet-beta.solana.com')) {
    return { fixed: true, newEndpoint: RPC_ENDPOINTS.PRIMARY };
  }
  
  return { fixed: false };
}
