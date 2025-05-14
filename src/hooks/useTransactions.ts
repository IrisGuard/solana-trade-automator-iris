
import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { useErrorReporting } from "./useErrorReporting";
import { toast } from "sonner";

interface UseTransactionsProps {
  walletAddress: string | null;
  limit?: number;
}

export function useTransactions({ walletAddress, limit = 5 }: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { reportError } = useErrorReporting();

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch transactions from Supabase
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("wallet_address", walletAddress)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform the data to match our Transaction type
      const formattedTransactions: Transaction[] = data?.map(tx => ({
        signature: tx.signature,
        type: tx.type,
        status: tx.status,
        amount: tx.amount,
        from: tx.source || undefined,
        to: tx.destination || undefined,
        timestamp: tx.block_time ? new Date(tx.block_time).getTime() : new Date(tx.created_at).getTime(),
        blockTime: tx.block_time ? new Date(tx.block_time).getTime() : undefined
      })) || [];

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      reportError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
      toast.error("Αποτυχία φόρτωσης συναλλαγών");
      
      // Fallback to mock data in case of error
      setTransactions([
        {
          signature: "mock-sig-1",
          type: "Αποστολή",
          status: "Success",
          amount: "0.5",
          from: walletAddress,
          to: "receiver1",
          timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
        },
        {
          signature: "mock-sig-2",
          type: "Λήψη",
          status: "Success",
          amount: "1.2",
          from: "sender1",
          to: walletAddress,
          timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
        },
        {
          signature: "mock-sig-3",
          type: "Αποστολή",
          status: "Failed",
          amount: "0.1",
          from: walletAddress,
          to: "receiver2",
          timestamp: Date.now() - 1000 * 60 * 60 * 48 // 2 days ago
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, limit, reportError]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    refreshTransactions: fetchTransactions
  };
}
