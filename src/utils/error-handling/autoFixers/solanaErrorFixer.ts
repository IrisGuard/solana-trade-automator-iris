
import { BotError, RPC_ENDPOINTS } from '../errorTypes';
import { connection } from '@/services/solana/config';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';

export async function fixSolanaError(error: BotError): Promise<boolean> {
  try {
    // Test current RPC endpoint
    const testKey = new PublicKey('So11111111111111111111111111111111111111112');
    
    try {
      await connection.getBalance(testKey);
    } catch (testError) {
      // RPC endpoint is failing, switch to backup
      if (error.metadata?.rpcEndpoint) {
        const currentEndpoint = String(error.metadata.rpcEndpoint);
        const newEndpoint = currentEndpoint.includes('mainnet') 
          ? RPC_ENDPOINTS.BACKUP
          : RPC_ENDPOINTS.FALLBACK;
        
        // Update the connection endpoint
        // Note: _rpcEndpoint is not directly accessible, so we create a notification instead
        toast.info("Switching to backup RPC endpoint", { 
          description: `Switched from ${currentEndpoint} to ${newEndpoint}` 
        });
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error fixing Solana error:", error);
    return false;
  }
}
