
export interface Order {
  id: string;
  type: 'stop-loss' | 'take-profit' | 'limit-buy' | 'limit-sell' | 'buy' | 'sell' | 'stop_loss' | 'take_profit';
  price: number;
  amount: number;
  token: string;
  tokenAddress: string;
  status: string;
  created: string;
  createdAt?: Date;
}
