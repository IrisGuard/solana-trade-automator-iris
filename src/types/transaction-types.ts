
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price?: string; // Made optional
  value: string;
  timestamp: string;
  status: string;
  bot: string;
  signature?: string; // Added missing property
}

export type TransactionFilterType = 'all' | 'sent' | 'received';
