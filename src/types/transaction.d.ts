
export interface Transaction {
  signature: string;
  type: string;
  status: string;
  amount: string;
  from?: any;
  to?: any;
  timestamp: number;
  blockTime: number;
  tokenAddress?: any;
  token?: string;
}
