
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { heliusService } from "@/services/helius/HeliusService";

// Define the Transaction interface
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price: string;
  value: string;
  timestamp: string;
  status: string;
  bot: string;
  signature?: string;
}

// Hook to fetch real transactions
export const useTransactions = (walletAddress?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setIsLoading(false);
        setTransactions([]);
        return;
      }

      setIsLoading(true);
      try {
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
            .limit(10);

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
            
            setTransactions(mappedTransactions);
            setIsLoading(false);
            return;
          }
        }
        
        // If no transactions found in DB or user not authenticated, try Helius
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
              amount = tx.tokenTransfers[0]?.amount.toString() || '0';
            } else if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
              amount = (tx.nativeTransfers[0]?.amount / LAMPORTS_PER_SOL).toString() || '0';
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
          console.log('No transactions found for wallet');
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Σφάλμα φόρτωσης συναλλαγών', {
          description: 'Δοκιμάστε να ανανεώσετε τη σελίδα'
        });
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, walletAddress]);

  return { transactions, isLoading };
};

// Helper constant for SOL to lamport conversion
const LAMPORTS_PER_SOL = 1000000000;

// Helper function to get unique tokens from transactions
export function getUniqueTokens(transactions: Transaction[]): string[] {
  return Array.from(new Set(transactions.map(tx => tx.token)));
}

// Format date helper function
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}
