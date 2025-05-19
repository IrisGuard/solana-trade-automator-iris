
import { toast } from "sonner";

interface SolscanTransaction {
  txHash: string;
  status: string;
  blockTime: number;
  slot: number;
  fee: number;
  signer: string[];
  tokenTransfers?: any[];
  solTransfers?: any[];
}

export const solscanService = {
  // Get transaction details
  async getTransactionDetails(signature: string): Promise<SolscanTransaction | null> {
    try {
      // Skip fetching for simulated Raydium transactions
      if (signature.startsWith('raydium-')) {
        return null;
      }

      const response = await fetch(`https://public-api.solscan.io/transaction/${signature}`);
      
      if (response.status === 429) {
        toast.warning("Solscan API rate limit reached. Please try again later.");
        return null;
      }
      
      if (!response.ok) {
        console.error(`Solscan API error: ${response.status}`);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  },
  
  // Generate Solscan link for a transaction
  getSolscanLink(signature: string): string {
    if (signature.startsWith('raydium-')) {
      return '#'; // Mock transactions don't have real links
    }
    return `https://solscan.io/tx/${signature}`;
  },
  
  // Format transaction status based on Solscan data
  formatStatus(status: string | undefined): string {
    if (!status) return "pending";
    
    switch(status.toLowerCase()) {
      case "success":
        return "success";
      case "confirmed":
        return "success";
      case "finalized":
        return "success";
      case "failed":
        return "error";
      case "error":
        return "error";
      default:
        return "pending";
    }
  }
};
