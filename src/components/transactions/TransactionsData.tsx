
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

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

// Hook to fetch real transactions or return demo data
export const useTransactions = (walletAddress?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id || !walletAddress) {
        setTransactions(demoTransactions);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch transactions from Supabase
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('wallet_address', walletAddress)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          // Map database transactions to the Transaction interface
          const mappedTransactions: Transaction[] = data.map((tx) => ({
            id: tx.id,
            type: tx.type,
            token: tx.type === 'SOL_TRANSFER' ? 'SOL' : 'Unknown',
            amount: tx.amount,
            price: '$0.00', // This would come from a price service
            value: '$0.00', // This would come from a price service
            timestamp: tx.created_at,
            status: tx.status,
            bot: 'Manual', // This would come from bot data
            signature: tx.signature
          }));
          setTransactions(mappedTransactions);
        } else {
          // Fall back to demo data if no transactions found
          setTransactions(demoTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions(demoTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, walletAddress]);

  return { transactions, isLoading };
};

// Demo transactions data for fallback
export const demoTransactions: Transaction[] = [
  {
    id: "TX123456",
    type: "buy",
    token: "SOL",
    amount: "0.5",
    price: "$82.45",
    value: "$41.23",
    timestamp: "2023-05-09T09:24:15Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123457",
    type: "sell",
    token: "ETH",
    amount: "0.02",
    price: "$2,345.67",
    value: "$46.91",
    timestamp: "2023-05-09T08:15:22Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
  {
    id: "TX123458",
    type: "buy",
    token: "BTC",
    amount: "0.001",
    price: "$42,345.12",
    value: "$42.35",
    timestamp: "2023-05-08T23:45:11Z",
    status: "completed",
    bot: "BTC/USDC Bot",
  },
  {
    id: "TX123459",
    type: "sell",
    token: "SOL",
    amount: "1.2",
    price: "$80.15",
    value: "$96.18",
    timestamp: "2023-05-08T17:32:45Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123460",
    type: "buy",
    token: "RAY",
    amount: "25",
    price: "$1.25",
    value: "$31.25",
    timestamp: "2023-05-08T12:10:05Z",
    status: "completed",
    bot: "Manual",
  },
];

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
