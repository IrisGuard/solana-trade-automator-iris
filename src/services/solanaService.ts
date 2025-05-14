
import { Connection, PublicKey } from '@solana/web3.js';
import { walletService } from './solana/wallet';
import { tokenService } from './solana/token';
import { transactionService } from './solana/transaction';
import { priceService } from './solana/price';
import { Token } from '@/types/wallet';
import { TokenPriceData } from './solana/price/types';

// Export a unified solanaService object
export const solanaService = {
  // Wallet methods
  getConnection: walletService.getConnection,
  getSolBalance: walletService.getSolBalance,
  connectWallet: walletService.connect,
  disconnectWallet: walletService.disconnect,
  fetchSOLBalance: walletService.getSolBalance,
  sendToken: walletService.sendToken,
  
  // Token methods
  getTokenAccounts: tokenService.getTokenAccounts,
  getTokenPrice: tokenService.getTokenPrice,
  fetchTokenBalance: tokenService.getTokenBalance,
  fetchAllTokenBalances: tokenService.getTokenAccounts,
  fetchTokenPrices: (tokenAddress: string): Promise<TokenPriceData> => {
    return priceService.getTokenPrice(tokenAddress);
  },
  
  // Transaction methods
  getRecentTransactions: transactionService.getRecentTransactions,
  parseTransaction: transactionService.parseTransaction,
  fetchTransactions: transactionService.getRecentTransactions,
  
  // Price methods
  subscribeToPriceUpdates: priceService.subscribeToPriceUpdates,
  unsubscribeFromPriceUpdates: priceService.unsubscribeFromPriceUpdates
};
