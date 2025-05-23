
import { Transaction } from '@/types/transaction-types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    token: 'SOL',
    amount: '10.5',
    price: '$23.45',
    value: '$246.23',
    timestamp: new Date().toISOString(),
    status: 'completed',
    bot: 'Trading Bot 1'
  },
  {
    id: '2',
    type: 'sell',
    token: 'USDC',
    amount: '100.0',
    price: '$1.00',
    value: '$100.00',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    bot: 'Market Maker Bot'
  }
];
