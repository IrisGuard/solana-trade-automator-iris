
export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'transfer';
  token: string;
  tokenSymbol: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  signature?: string;
  fee?: number;
}

export const mockTransactions: Transaction[] = [];

export function getRecentTransactions(walletAddress: string, limit: number = 10): Transaction[] {
  console.log(`Getting recent transactions for ${walletAddress}, limit: ${limit}`);
  return mockTransactions.slice(0, limit);
}
