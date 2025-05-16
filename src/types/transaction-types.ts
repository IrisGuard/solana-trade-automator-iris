
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

// Define the Transaction filter types
export type TransactionFilterType = 'all' | 'sent' | 'received';
