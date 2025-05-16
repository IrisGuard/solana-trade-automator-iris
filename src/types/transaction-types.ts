
export enum TransactionFilterType {
  ALL = 'all',
  SEND = 'send',
  RECEIVE = 'receive',
  SWAP = 'swap'
}

export interface Transaction {
  id?: string;
  signature?: string;
  type: string;
  status: string;
  amount?: number | string;
  timestamp?: number;
  from?: string;
  to?: string;
}
