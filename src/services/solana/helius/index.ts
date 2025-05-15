
// Re-export all Helius services
export * from './config';
export * from './transactionsService';
export * from './addressesService';
export * from './connectionService';
export { handleHeliusError } from './errorHandler';

// For backward compatibility
export default {
  sendRpcRequest,
  getEnhancedTransaction,
  getEnhancedTransactions,
  getEnhancedTransactionHistory,
  getAddressAssets,
  parseTransactionData,
  getNftEvents,
  verifyConnection
};

// Import for default export
import { 
  sendRpcRequest,
  getEnhancedTransaction, 
  getEnhancedTransactions, 
  getEnhancedTransactionHistory, 
  parseTransactionData 
} from './transactionsService';

import { 
  getAddressAssets,
  getNftEvents 
} from './addressesService';

import { 
  verifyConnection 
} from './connectionService';
