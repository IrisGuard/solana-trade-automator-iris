
import { Transaction } from "@/types/transaction-types";

// Generate random mock transaction data when the real API isn't available
export const generateMockTransactions = (count: number = 10): Transaction[] => {
  const types = ['sent', 'received', 'swap', 'trade', 'deposit', 'withdraw'];
  const tokens = ['SOL', 'BONK', 'JUP', 'PYTH', 'DUAL'];
  const statuses = ['Success', 'Pending', 'Failed'];
  
  return Array.from({ length: count }).map((_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = (Math.random() * 100).toFixed(4);
    
    // Create a timestamp between now and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const timestamp = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
    ).toISOString();
    
    return {
      id: `mock-tx-${index}`,
      signature: `mock-sig-${Date.now()}-${index}`,
      type,
      token,
      amount,
      price: '$' + (Math.random() * 10).toFixed(2),
      value: '$' + (Number(amount) * Math.random() * 10).toFixed(2),
      timestamp,
      status,
      bot: Math.random() > 0.7 ? 'Trading Bot' : 'Manual',
    };
  });
};

// Export mock transactions for immediate use
export const mockTransactions = generateMockTransactions(15);
