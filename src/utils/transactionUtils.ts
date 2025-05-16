
import { Transaction } from "@/types/transaction-types";

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
