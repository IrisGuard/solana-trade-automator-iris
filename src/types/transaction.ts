
export interface Transaction {
  signature: string;
  type: string;
  status: string;
  amount?: string | number;
  from?: string;
  to?: string;
  timestamp?: number;
  blockTime: number;
  tokenAddress?: string;
  token?: string;
}
