
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { heliusService } from "@/services/helius/HeliusService";
import { transactionRecordService } from "@/services/transactions/TransactionRecordService";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  timestamp: Date;
  token?: string;
  source?: string;
  destination?: string;
  block_time?: string;
  wallet_address: string;
  value_usd?: number;
}

export const useTransactionsData = (walletAddress: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const fetchTransactions = useCallback(async (address: string) => {
    if (!address) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch transactions from Helius
      const solanaTransactions = await heliusService.fetchTransactions(address, 20);
      
      // Fetch transactions from our database
      const dbTransactions = await transactionRecordService.getTransactions(address, 50);

      // Process Helius transactions
      const processedSolanaTransactions = solanaTransactions.map((tx: any) => ({
        id: tx.id || tx.signature || `helius_${Math.random().toString(36).substring(2, 15)}`,
        signature: tx.signature,
        type: tx.type || 'transfer',
        status: tx.status || 'confirmed',
        amount: tx.amount || '0',
        timestamp: new Date(tx.timestamp || tx.blockTime * 1000 || Date.now()),
        token: tx.token || 'SOL',
        source: tx.source || '',
        destination: tx.destination || '',
        block_time: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : undefined,
        wallet_address: address,
        value_usd: tx.value_usd || undefined
      }));

      // Process database transactions
      const processedDbTransactions: Transaction[] = dbTransactions.map((tx: any) => ({
        id: tx.id || tx.signature || `db_${Math.random().toString(36).substring(2, 15)}`,
        signature: tx.signature,
        type: tx.type || 'transfer',
        status: tx.status || 'confirmed',
        amount: tx.amount || '0',
        timestamp: new Date(tx.block_time || tx.created_at || Date.now()),
        token: tx.token || 'SOL',
        source: tx.source || '',
        destination: tx.destination || '',
        wallet_address: tx.wallet_address,
        value_usd: tx.value_usd || undefined,
        block_time: tx.block_time
      }));

      // Merge and deduplicate transactions using signature as unique identifier
      const mergedTransactions = [...processedSolanaTransactions];
      
      // Add DB transactions that don't exist in the Solana transactions
      processedDbTransactions.forEach(dbTx => {
        if (!mergedTransactions.some(tx => tx.signature === dbTx.signature)) {
          mergedTransactions.push(dbTx);
        }
      });

      // Store new Helius transactions in our database
      await storeNewTransactionsInDb(processedSolanaTransactions, address);

      // Sort by timestamp, most recent first
      const sortedTransactions = mergedTransactions.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );

      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
      toast.error("Failed to fetch transaction history");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Store new transactions in database
  const storeNewTransactionsInDb = async (transactions: Transaction[], walletAddress: string) => {
    if (!user?.id) {
      console.log("No user ID available, skipping database storage");
      return;
    }

    try {
      for (const tx of transactions) {
        // Check if transaction already exists
        const existingTx = await transactionRecordService.getTransactionBySignature(tx.signature);
        
        if (!existingTx) {
          // Create a database-compatible transaction object
          await transactionRecordService.recordTransaction({
            signature: tx.signature,
            type: tx.type,
            status: tx.status,
            amount: tx.amount,
            block_time: tx.timestamp.toISOString(),
            source: tx.source,
            destination: tx.destination,
            wallet_address: walletAddress,
            user_id: user.id,
            token: tx.token,
            value_usd: tx.value_usd
          });
        }
      }
    } catch (error) {
      console.error("Error storing transactions in database:", error);
      // Non-critical error, we can continue
    }
  };

  // Initial fetch
  useEffect(() => {
    if (walletAddress) {
      fetchTransactions(walletAddress);
    }
  }, [walletAddress, fetchTransactions]);

  // Refresh function
  const refresh = useCallback(() => {
    if (walletAddress) {
      fetchTransactions(walletAddress);
    }
  }, [walletAddress, fetchTransactions]);

  return { transactions, isLoading, error, refresh };
};
