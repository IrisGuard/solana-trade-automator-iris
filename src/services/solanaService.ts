
import { fetchSOLBalance } from './solana/walletService';
import { fetchAllTokenBalances } from './solana/token';
import { tokenServiceObj as tokenService } from './solana/token/index';
import { errorCollector } from '@/utils/error-handling/collector';

// Εκτέλεση πολλαπλών λειτουργιών σχετικών με το wallet
export const fetchWalletData = async (address: string) => {
  try {
    // Παράλληλη λήψη δεδομένων
    const [solBalance, tokens] = await Promise.all([
      fetchSOLBalance(address),
      fetchAllTokenBalances(address)
    ]);
    
    return {
      solBalance,
      tokens
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    errorCollector.captureError(error instanceof Error ? error : new Error('Error fetching wallet data'), {
      component: 'SolanaService',
      details: { action: 'fetchWalletData', address },
      source: 'client'
    });
    
    return {
      solBalance: 0,
      tokens: []
    };
  }
};

// Εξαγωγή του tokenService για συμβατότητα με προηγούμενο κώδικα
export { tokenService };

// Συνάρτηση για αποστολή token με βελτιωμένο error handling
export const sendToken = async (from: string, to: string, amount: number, tokenAddress?: string) => {
  try {
    // To be implemented
    console.log(`Would send ${amount} from ${from} to ${to}`);
    return false;
  } catch (error) {
    console.error('Error sending token:', error);
    errorCollector.captureError(error instanceof Error ? error : new Error('Error sending token'), {
      component: 'SolanaService',
      details: { action: 'sendToken', from, to, amount, tokenAddress },
      source: 'client'
    });
    return false;
  }
};

// Φόρτωση ιστορικών συναλλαγών
export const fetchTransactionHistory = async (address: string) => {
  try {
    // To be implemented
    console.log(`Would fetch transaction history for ${address}`);
    return [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    errorCollector.captureError(error instanceof Error ? error : new Error('Error fetching transaction history'), {
      component: 'SolanaService',
      details: { action: 'fetchTransactionHistory', address },
      source: 'client'
    });
    return [];
  }
};
