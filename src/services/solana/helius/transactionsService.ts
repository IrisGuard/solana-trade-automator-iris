
import { HELIUS_API_BASE_URL, getHeliusApiKey } from './config';
import { handleHeliusError } from './errorHandler';

/**
 * Send an RPC request to the Helius API
 */
export const sendRpcRequest = async (method: string, params: any[]): Promise<any> => {
  const apiKey = getHeliusApiKey();
  const url = `${HELIUS_API_BASE_URL}/rpc?api-key=${apiKey}`;
  
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
    const url = `${HELIUS_API_BASE_URL}/transactions?api-key=${apiKey}&commitment=confirmed`;
    
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
    const url = `${HELIUS_API_BASE_URL}/transactions?api-key=${apiKey}&commitment=confirmed`;
    
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
    const url = `${HELIUS_API_BASE_URL}/addresses/${address}/transactions?api-key=${apiKey}&type=ALL&limit=${limit}`;
    
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
 * Parse transaction data using Helius API
 */
export const parseTransactionData = async (transactionData: string): Promise<any> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_API_BASE_URL}/transactions/parse?api-key=${apiKey}`;
    
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
