import type { ErrorCollector } from '@/utils/error-handling/collector/types';
import { apiKeys } from './apiConfig';
import { errorCollector } from '@/utils/error-handling/collector';

// Define the base URL for Helius API
const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

// Get a valid Helius API key from the configured keys
const getHeliusApiKey = (): string => {
  // If we have specific API keys for Helius, use them
  if (apiKeys && apiKeys.helius && apiKeys.helius.length > 0) {
    return apiKeys.helius[Math.floor(Math.random() * apiKeys.helius.length)];
  }
  
  // Fallback to demo key
  return 'demo-key';  // Replace with your actual demo key if available
};

const handleHeliusError = (error: unknown, source: string) => {
  // Create a proper error object
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorObj = error instanceof Error ? error : new Error(errorMessage);
  
  errorCollector.captureError(errorObj, {
    component: 'HeliusService',
    source,
    details: error,
    severity: 'high'
  });
  
  throw error;
};

/**
 * Send an RPC request to the Helius API
 * @param method The RPC method to call
 * @param params The parameters to pass to the method
 * @returns The result of the RPC call
 */
export const sendRpcRequest = async (method: string, params: any[]): Promise<any> => {
  const apiKey = getHeliusApiKey();
  const url = `${HELIUS_BASE_URL}/rpc?api-key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-proxy',
        method,
        params,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Unknown RPC error');
    }
    
    return data.result;
  } catch (error) {
    handleHeliusError(error, 'sendRpcRequest');
  }
};

/**
 * Get enhanced transaction details for a specific signature
 */
export const getEnhancedTransaction = async (signature: string): Promise<any> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_BASE_URL}/transactions?api-key=${apiKey}&commitment=confirmed`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactions: [signature] }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    handleHeliusError(error, 'getEnhancedTransaction');
  }
};

/**
 * Get enhanced transaction details for multiple signatures
 */
export const getEnhancedTransactions = async (signatures: string[]): Promise<any[]> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_BASE_URL}/transactions?api-key=${apiKey}&commitment=confirmed`;
    
    // Process signatures in batches of 100 (Helius API limit)
    const batchSize = 100;
    let results: any[] = [];
    
    for (let i = 0; i < signatures.length; i += batchSize) {
      const batch = signatures.slice(i, i + batchSize);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions: batch }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      results = results.concat(data);
    }
    
    return results;
  } catch (error) {
    handleHeliusError(error, 'getEnhancedTransactions');
  }
};

/**
 * Get transaction history for an address with enhanced details
 */
export const getEnhancedTransactionHistory = async (address: string, options?: { limit?: number }): Promise<any[]> => {
  try {
    const apiKey = getHeliusApiKey();
    const limit = options?.limit || 100;
    const url = `${HELIUS_BASE_URL}/addresses/${address}/transactions?api-key=${apiKey}&type=ALL&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleHeliusError(error, 'getEnhancedTransactionHistory');
  }
};

/**
 * Get all assets owned by an address
 */
export const getAddressAssets = async (address: string): Promise<any> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_BASE_URL}/addresses/${address}/balances?api-key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleHeliusError(error, 'getAddressAssets');
  }
};

/**
 * Parse transaction data using Helius API
 */
export const parseTransactionData = async (transactionData: string): Promise<any> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_BASE_URL}/transactions/parse?api-key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactions: [transactionData] }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    handleHeliusError(error, 'parseTransactionData');
  }
};

/**
 * Get NFT events by address
 */
export const getNftEvents = async (address: string, options?: { limit?: number }): Promise<any[]> => {
  try {
    const apiKey = getHeliusApiKey();
    const limit = options?.limit || 100;
    const url = `${HELIUS_BASE_URL}/nft-events?api-key=${apiKey}&sourceAddress=${address}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleHeliusError(error, 'getNftEvents');
  }
};

/**
 * Verify if the Helius connection is working
 */
export const verifyConnection = async (): Promise<boolean> => {
  try {
    const apiKey = getHeliusApiKey();
    // Just check if we can access the API with a simple request
    const url = `${HELIUS_BASE_URL}/status?api-key=${apiKey}`;
    
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    handleHeliusError(error, 'verifyConnection');
    return false;
  }
};

// Export as default for module interoperability
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
