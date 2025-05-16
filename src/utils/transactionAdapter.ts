
import { Transaction as TransactionDataType } from "@/hooks/useTransactionsData";
import { Transaction as TransactionTypesType } from "@/types/transaction-types";
import { Transaction as TransactionType } from "@/types/transaction";

/**
 * Adapts a transaction from useTransactionsData format to transaction-types format
 */
export function adaptTransactionDataToTypes(tx: TransactionDataType): TransactionTypesType {
  return {
    id: tx.id || tx.signature || Math.random().toString(),
    type: tx.type || 'unknown',
    token: tx.token || 'SOL',
    amount: tx.amount || '0',
    price: '$0.00', // Default value
    value: '$0.00', // Default value
    timestamp: tx.timestamp?.toISOString() || new Date().toISOString(),
    status: tx.status || 'completed',
    bot: 'Manual', // Default value
    signature: tx.signature
  };
}

/**
 * Adapts an array of transactions from useTransactionsData format to transaction-types format
 */
export function adaptTransactionsDataToTypes(transactions: TransactionDataType[]): TransactionTypesType[] {
  return transactions.map(adaptTransactionDataToTypes);
}
