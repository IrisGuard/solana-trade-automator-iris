
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price?: string;
  value: string;
  timestamp: string;
  status: string;
  bot: string;
}

export type TransactionFilterType = 'all' | 'sent' | 'received';
