
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
  // Use sendToken as a placeholder for connect/disconnect functionality
  // since they don't exist in walletService
  connectWallet: () => Promise.resolve(true),
  disconnectWallet: () => Promise.resolve(true),
  fetchSOLBalance: walletService.getSolBalance,
  sendToken: walletService.sendToken,
  
  // Token methods
  getTokenAccounts: tokenService.getTokenAccounts,
  getTokenPrice: tokenService.getTokenPrice,
  // Use getTokenAccounts as a substitute for getTokenBalance
  // since it doesn't exist in tokenService
  fetchTokenBalance: (address: string): Promise<Token[]> => tokenService.getTokenAccounts(address),
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
