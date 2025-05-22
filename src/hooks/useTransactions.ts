
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { Transaction } from "@/types/transaction-types";
import { heliusService } from "@/services/helius/HeliusService";
import { mockTransactions } from "@/services/mocks/mockTransactions";
import { errorCollector } from "@/utils/error-handling/collector";

interface UseTransactionsProps {
  walletAddress?: string | null;
  limit?: number;
}

export const useTransactions = ({ walletAddress, limit = 10 }: UseTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching transactions for wallet:', walletAddress);
      
      // First try to fetch from Supabase if user is authenticated
      if (user?.id) {
        console.log('Fetching transactions from Supabase for wallet:', walletAddress);
        
        // Fetch transactions from Supabase
        const { data: dbTransactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })
          .limit(limit || 10);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (dbTransactions && dbTransactions.length > 0) {
          console.log('Found transactions in Supabase:', dbTransactions.length);
          
          // Map database transactions to the Transaction interface
          const mappedTransactions: Transaction[] = dbTransactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type || 'unknown',
            token: 'SOL', // Default token if not present
            amount: tx.amount || '0',
            price: '$0.00', // Default price if not present
            value: '$0.00', // Default value if not present
            timestamp: tx.created_at || new Date().toISOString(),
            status: tx.status || 'completed',
            bot: tx.source === 'bot' ? 'Trading Bot' : 'Manual', // Determine if from bot
            signature: tx.signature
          }));
          
          setTransactions(mappedTransactions);
          setLoading(false);
          return;
        }
      }
      
      // If no transactions found in DB or user not authenticated, try Helius
      console.log('Fetching transactions from Helius for wallet:', walletAddress);
      const heliusTransactions = await heliusService.getTransactionHistory(walletAddress, limit);
      
      if (heliusTransactions && heliusTransactions.length > 0) {
        console.log('Found transactions on Helius:', heliusTransactions.length);
        
        // Map Helius transactions to the Transaction interface
        const mappedTransactions: Transaction[] = heliusTransactions.map((tx: any, index: number) => {
          // Parse the transaction data
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
            amount = (tx.nativeTransfers[0]?.amount / 1000000000).toString() || '0';
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
        
        setTransactions(mappedTransactions);
      } else {
        console.log('No real transactions found, using mock data for testing');
        setTransactions(mockTransactions.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      errorCollector.captureError(error, {
        component: 'useTransactions',
        source: 'hook'
      });
      
      toast.error('Προσωρινό πρόβλημα φόρτωσης συναλλαγών', {
        description: 'Χρησιμοποιούνται δοκιμαστικά δεδομένα'
      });
      
      // Use mock data on error
      setTransactions(mockTransactions.slice(0, limit));
    } finally {
      setLoading(false);
    }
  }, [user, walletAddress, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refreshTransactions = () => {
    fetchTransactions();
  };

  return {
    transactions,
    loading,
    refreshTransactions
  };
};
