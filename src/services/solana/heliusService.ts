
// This file is maintained for backward compatibility
// It re-exports all functionality from the newly structured modules

import * as heliusServices from './helius';
export default heliusServices.default;

// Re-export all individual functions
export const {
  sendRpcRequest,
  getEnhancedTransaction,
  getEnhancedTransactions,
  getEnhancedTransactionHistory,
  getAddressAssets,
  parseTransactionData,
  getNftEvents,
  verifyConnection,
  handleHeliusError,
  getHeliusApiKey
} = heliusServices;

export const HELIUS_BASE_URL = heliusServices.HELIUS_BASE_URL;
