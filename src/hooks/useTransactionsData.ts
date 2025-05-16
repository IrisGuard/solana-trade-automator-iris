import { useState, useEffect, useCallback } from "react";
import { dbClient } from "@/integrations/supabase/client";
import { solanaService } from "@/services/solana";
import { useUser } from "@/hooks/useUser";

export interface Transaction {
  id: string;
  signature: string;
  type: string;
  status: string;
  amount: string;
  timestamp: Date;
  token: string; // Αλλαγή από προαιρετικό σε υποχρεωτικό
  source?: string;
  destination?: string;
  block_time?: string;
  wallet_address: string;
  value_usd: string; // Προσθήκη για συμβατότητα
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
      // Fetch transactions from Solana (Helius)
      const solanaTransactions = await solanaService.fetchTransactions(address, 20);
      
      // Also fetch transactions from our database
      const { data: dbTransactions, error: dbError } = await dbClient
        .from("transactions")
        .select("*")
        .eq("wallet_address", address)
        .order("created_at", { ascending: false })
        .limit(50);

      if (dbError) {
        throw dbError;
      }

      // Process and merge transactions
      const processedSolanaTransactions = solanaTransactions.map((tx: any) => ({
        id: tx.id || tx.signature || Math.random().toString(),
        signature: tx.signature,
        type: tx.type || 'transfer',
        status: tx.status || 'confirmed',
        amount: tx.amount || '0',
        timestamp: new Date(tx.timestamp || tx.blockTime * 1000 || Date.now()),
        token: tx.token || 'SOL', // Πάντα παρέχουμε ένα token
        source: tx.source || '',
        destination: tx.destination || '',
        block_time: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : undefined,
        wallet_address: address,
        value_usd: tx.value || '$0' // Προσθήκη για συμβατότητα
      }));

      const processedDbTransactions = (dbTransactions || []).map((tx: any) => ({
        id: tx.id || tx.signature || Math.random().toString(),
        signature: tx.signature,
        type: tx.type || 'transfer',
        status: tx.status || 'confirmed',
        amount: tx.amount || '0',
        timestamp: new Date(tx.block_time || tx.created_at || Date.now()),
        token: tx.token || 'SOL', // Πάντα παρέχουμε ένα token
        source: tx.source || '',
        destination: tx.destination || '',
        wallet_address: tx.wallet_address,
        value_usd: '$0' // Προσθήκη για συμβατότητα
      }));

      // Merge and deduplicate transactions using signature as unique identifier
      const mergedTransactions = [...processedSolanaTransactions];
      
      // Add DB transactions that don't exist in the Solana transactions
      processedDbTransactions.forEach(dbTx => {
        if (!mergedTransactions.some(tx => tx.signature === dbTx.signature)) {
          mergedTransactions.push(dbTx);
        }
      });

      // Store transactions in database (only those that don't already exist)
      await storeNewTransactionsInDb(processedSolanaTransactions, address);

      // Sort by timestamp, most recent first
      const sortedTransactions = mergedTransactions.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );

      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Store new transactions in database
  const storeNewTransactionsInDb = async (transactions: Transaction[], walletAddress: string) => {
    try {
      // For each transaction, check if it exists in DB and insert if not
      for (const tx of transactions) {
        if (!user?.id) {
          console.log("No user ID available, skipping database storage");
          continue;
        }
        
        const { data: existingTx } = await dbClient
          .from("transactions")
          .select("signature")
          .eq("signature", tx.signature)
          .single();
          
        if (!existingTx) {
          // Create a database-compatible transaction object
          const dbTx = {
            signature: tx.signature,
            type: tx.type,
            status: tx.status,
            amount: tx.amount,
            block_time: tx.timestamp.toISOString(),
            source: tx.source,
            destination: tx.destination,
            wallet_address: walletAddress,
            user_id: user.id  // Add the user_id field that was missing
          };
          
          await dbClient.from("transactions").insert(dbTx);
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

  return { transactions, isLoading, error, refresh: () => fetchTransactions(walletAddress) };
};
