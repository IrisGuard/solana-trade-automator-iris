
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { heliusService } from "@/services/helius/HeliusService";
import { Transaction } from "@/types/transaction-types";

// Helper constant for SOL to lamport conversion
const LAMPORTS_PER_SOL = 1000000000;

export const useTransactionsData = (walletAddress?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { user } = useUser();

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) {
      setIsLoading(false);
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    try {
      // First try to fetch from Supabase if user is authenticated
      let finalTransactions: Transaction[] = [];
      
      if (user?.id) {
        console.log('Fetching transactions from Supabase for wallet:', walletAddress);
        
        // Fetch transactions from Supabase
        const { data: dbTransactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (dbTransactions && dbTransactions.length > 0) {
          console.log('Found transactions in Supabase:', dbTransactions.length);
          
          // Map database transactions to the Transaction interface
          const mappedTransactions: Transaction[] = dbTransactions.map((tx) => ({
            id: tx.id,
            type: tx.type || 'unknown',
            token: tx.type === 'SOL_TRANSFER' ? 'SOL' : 'SPL',
            amount: tx.amount || '0',
            price: '$0.00', // This would come from a price service
            value: '$0.00', // This would come from a price service
            timestamp: tx.created_at,
            status: tx.status || 'completed',
            bot: 'Manual', // This would come from bot data
            signature: tx.signature
          }));
          
          finalTransactions = mappedTransactions;
        }
      }
      
      // If no transactions or too few found in DB, try Helius
      if (finalTransactions.length < 5) {
        console.log('Fetching transactions from Helius for wallet:', walletAddress);
        const heliusTransactions = await heliusService.getTransactionHistory(walletAddress);
        
        if (heliusTransactions && heliusTransactions.length > 0) {
          console.log('Found transactions on Helius:', heliusTransactions.length);
          
          // Map Helius transactions to the Transaction interface
          const mappedTransactions: Transaction[] = heliusTransactions.map((tx, index) => {
            // Parse the transaction data - in a real app this would be more sophisticated
            const txType = tx.type || 'UNKNOWN';
            let tokenSymbol = 'UNKNOWN';
            
            if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
              tokenSymbol = tx.tokenTransfers[0]?.tokenName || 'SPL';
            } else {
              tokenSymbol = 'SOL';
            }
            
            // Extract amount
            let amount = '0';
            if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
              amount = tx.tokenTransfers[0]?.amount?.toString() || '0';
            } else if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
              amount = (tx.nativeTransfers[0]?.amount / LAMPORTS_PER_SOL).toString() || '0';
            }
            
            // Save transaction to database if logged in
            if (user?.id) {
              try {
                supabase.from('transactions').insert({
                  user_id: user.id,
                  wallet_address: walletAddress,
                  signature: tx.signature || `tx-${index}`,
                  type: txType.toLowerCase(),
                  amount: amount,
                  status: 'completed',
                  source: tx.source || 'helius',
                  destination: tx.destination || null,
                  block_time: tx.timestamp ? new Date(tx.timestamp) : new Date()
                }).then(({ error }) => {
                  if (error) {
                    console.error('Error saving transaction to database:', error);
                  }
                });
              } catch (err) {
                console.error('Error saving transaction to database:', err);
              }
            }
            
            return {
              id: tx.signature || `tx-${index}`,
              type: txType.toLowerCase(),
              token: tokenSymbol,
              amount: amount,
              price: '$0.00',
              value: '$0.00',
              timestamp: tx.timestamp || new Date().toISOString(),
              status: 'completed',
              bot: 'Manual',
              signature: tx.signature
            };
          });
          
          // Merge transactions, taking Supabase ones first (they have more info)
          finalTransactions = [...finalTransactions, ...mappedTransactions];
          
          // Remove duplicates based on signature
          const uniqueMap = new Map();
          finalTransactions.forEach(tx => {
            if (!uniqueMap.has(tx.id)) {
              uniqueMap.set(tx.id, tx);
            }
          });
          
          finalTransactions = Array.from(uniqueMap.values());
        }
      }
      
      // Sort by timestamp (newest first)
      finalTransactions.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });
      
      setTransactions(finalTransactions);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Σφάλμα φόρτωσης συναλλαγών', {
        description: 'Δοκιμάστε να ανανεώσετε τη σελίδα'
      });
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, walletAddress]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { 
    transactions, 
    isLoading, 
    refreshTransactions: fetchTransactions,
    lastRefresh 
  };
};
