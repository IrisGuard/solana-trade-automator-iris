
import { apiConfig } from './apiConfig';
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

// Helper function to get API key from configuration
const getHeliusApiKey = (): string => {
  if (!apiConfig || !apiConfig.keys || !apiConfig.keys.helius) {
    throw new Error('Helius API key is not configured');
  }
  return apiConfig.keys.helius;
};

// Helper to get API URL with key
const getHeliusApiUrl = (): string => {
  const apiKey = getHeliusApiKey();
  return `https://api.helius.xyz/v0?api-key=${apiKey}`;
};

// Interface for RPC request parameters
interface RpcRequestParams {
  method: string;
  params: any[];
}

// Send a JSON-RPC request to Helius API
async function sendRpcRequest<T>(params: RpcRequestParams): Promise<T> {
  try {
    const response = await fetch(getHeliusApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: params.method,
        params: params.params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    return data.result;
  } catch (error) {
    errorCollector.captureError(error, {
      component: 'HeliusService',
      source: 'sendRpcRequest',
      context: { method: params.method }
    });
    throw error;
  }
}

// API functions
export const heliusService = {
  // Get enhanced transaction details
  async getEnhancedTransaction(signature: string): Promise<any> {
    try {
      return await sendRpcRequest({
        method: 'getEnhancedTransaction',
        params: [signature]
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'getEnhancedTransaction',
        context: { signature }
      });
      throw error;
    }
  },

  // Get multiple enhanced transactions
  async getEnhancedTransactions(signatures: string[]): Promise<any[]> {
    try {
      return await sendRpcRequest({
        method: 'getEnhancedTransactions',
        params: [{ transactionHashes: signatures }]
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'getEnhancedTransactions',
        context: { signatures }
      });
      throw error;
    }
  },

  // Get enhanced transaction history for address
  async getEnhancedTransactionHistory(
    address: string,
    options: { before?: string; until?: string; limit?: number } = {}
  ): Promise<any[]> {
    try {
      const params: any = { account: address };
      
      if (options.before) params.before = options.before;
      if (options.until) params.until = options.until;
      if (options.limit) params.limit = options.limit;
      
      return await sendRpcRequest({
        method: 'getEnhancedTransactionHistory',
        params: [params]
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'getEnhancedTransactionHistory',
        context: { address, options }
      });
      throw error;
    }
  },

  // Get address assets (NFTs and tokens)
  async getAddressAssets(address: string): Promise<any> {
    try {
      return await sendRpcRequest({
        method: 'getAssetsByOwner',
        params: [address, { page: 1, limit: 100 }]
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'getAddressAssets',
        context: { address }
      });
      throw error;
    }
  },

  // Parse transaction data
  async parseTransactionData(rawTransaction: string): Promise<any> {
    try {
      return await sendRpcRequest({
        method: 'parseTransactionData',
        params: [rawTransaction]
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'parseTransactionData'
      });
      throw error;
    }
  },

  // Get NFT events
  async getNftEvents(
    options: {
      query?: Record<string, any>;
      options?: { limit?: number; page?: number };
    } = {}
  ): Promise<any> {
    try {
      const params = [{}];
      
      if (options.query) params[0] = { ...options.query };
      if (options.options) params.push(options.options);
      
      return await sendRpcRequest({
        method: 'getNftEvents',
        params
      });
    } catch (error) {
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'getNftEvents'
      });
      throw error;
    }
  },

  // Verify API connection and key validity
  async verifyConnection(): Promise<boolean> {
    try {
      // Try a simple request to verify the connection
      await this.getEnhancedTransactions(['5werj5j6wtP8y6DmbMeE5Xqfg89Q93o579n3Yj4tX6G9w75jC9ac2vTvqYFGJvBsjEqeTGhho8jNeJ9zafaVeqS']);
      toast.success('Helius API connection verified');
      return true;
    } catch (error) {
      toast.error('Helius API connection failed');
      errorCollector.captureError(error, {
        component: 'HeliusService',
        source: 'verifyConnection'
      });
      return false;
    }
  },

  // Set API key - note this is a front-end safe way to set the key during runtime
  // but it won't persist between sessions
  setApiKey(key: string): void {
    if (!apiConfig.keys) {
      apiConfig.keys = { helius: key };
    } else {
      apiConfig.keys.helius = key;
    }
  }
};

export default heliusService;
