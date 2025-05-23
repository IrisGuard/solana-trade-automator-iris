
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price: string; // Made required
  value: string;
  timestamp: string;
  status: string;
  bot: string;
  signature?: string;
}

export type TransactionFilterType = 'all' | 'sent' | 'received';
