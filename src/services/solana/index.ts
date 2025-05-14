
// Main Solana service exports

import { fetchSOLBalance } from './wallet';
import { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices as fetchTokenPricesFromToken } from './token';
import { fetchTransactionHistory } from './transaction';
import { getTokenPrice, fetchTokenPrices as fetchTokenPricesFromPrice, priceService } from './price';

// Import services for backward compatibility
import { walletService } from './wallet';
import { tokenService } from './token';
import { transactionService } from './transaction';
import { raydiumService } from './raydiumService';
import { tradingService } from './tradingService';
import { connection } from './config';

// Export a standard interface for the modular approach
export const solanaService = {
  wallet: {
    fetchBalance: fetchSOLBalance
  },
  token: {
    fetchBalance: fetchTokenBalance,
    fetchAllBalances: fetchAllTokenBalances,
    fetchPrices: fetchTokenPricesFromToken
  },
  price: {
    getTokenPrice,
    fetchPrices: fetchTokenPricesFromPrice
  },
  transaction: {
    fetchHistory: fetchTransactionHistory
  }
};

// Export individual services for backward compatibility
export {
  walletService,
  tokenService,
  transactionService,
  raydiumService,
  tradingService,
  priceService,
  connection
};

// Also export the individual functions for direct access
export { fetchSOLBalance } from './wallet';
export { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices } from './token';
export { fetchTransactionHistory } from './transaction';

// Export default as the combined service
export default solanaService;
