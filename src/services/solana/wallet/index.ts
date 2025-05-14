
import { connection } from '../config';
import { fetchSOLBalance } from './balance';
import { sendToken } from './transfer';

// Export individual functions
export { fetchSOLBalance, sendToken };

// Export wallet service object for backward compatibility
export const walletService = {
  // Get connection instance
  getConnection: () => connection,
  
  // Get SOL balance for a given address
  getSolBalance: fetchSOLBalance,
  
  // Send token functionality
  sendToken,

  // Add connect method (simplified implementation)
  connect: async (): Promise<boolean> => {
    // This is a placeholder implementation
    console.log('Connect wallet called');
    return true;
  },
  
  // Add disconnect method (simplified implementation)
  disconnect: async (): Promise<boolean> => {
    // This is a placeholder implementation
    console.log('Disconnect wallet called');
    return true;
  }
};
