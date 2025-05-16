import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Helius } from 'helius-sdk';
import { errorCollector } from '@/utils/error-handling/collector';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyEntry } from '@/services/api-keys/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_NETWORKS = [
  {
    name: 'Mainnet Beta',
    value: 'mainnet-beta',
    endpoint: clusterApiUrl('mainnet-beta'),
  },
  {
    name: 'Devnet',
    value: 'devnet',
    endpoint: clusterApiUrl('devnet'),
  },
  {
    name: 'Testnet',
    value: 'testnet',
    endpoint: clusterApiUrl('testnet'),
  },
];

// Export the class as default and as a named export for compatibility
export class HeliusKeyManager {
  private apiKey: string;
  private helius: Helius | null = null;
  private connection: Connection | null = null;
  private network: string;
  private userId: string | undefined;

  constructor(apiKey: string, network: string = 'mainnet-beta', userId: string | undefined = undefined) {
    this.apiKey = apiKey;
    this.network = network;
    this.userId = userId;
    this.initializeHelius();
  }

  private initializeHelius() {
    try {
      const endpoint = DEFAULT_NETWORKS.find(n => n.value === this.network)?.endpoint || clusterApiUrl(this.network as any);
      this.helius = new Helius(this.apiKey, {
        baseUrl: 'https://rpc.helius.xyz',
      });
      this.connection = new Connection(endpoint);
    } catch (error) {
      console.error("Error initializing Helius:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to initialize Helius'), {
        component: 'HeliusKeyManager',
        source: 'initializeHelius',
        details: { apiKey: this.apiKey, network: this.network }
      });
    }
  }

  public async getEnhancedTransactions(account: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getEnhancedTransactions({
        account,
      });
      return response;
    } catch (error) {
      console.error("Error fetching enhanced transactions:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get enhanced transactions'), {
        component: 'HeliusKeyManager',
        source: 'getEnhancedTransactions',
        details: { account }
      });
      return null;
    }
  }

  public async getAccountNFTs(account: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getAccountNFTs(account);
      return response;
    } catch (error) {
      console.error("Error fetching account NFTs:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get account NFTs'), {
        component: 'HeliusKeyManager',
        source: 'getAccountNFTs',
        details: { account }
      });
      return null;
    }
  }

  public async getNFTMetadata(mintAccount: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getNFTMetadata(mintAccount);
      return response;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get NFT metadata'), {
        component: 'HeliusKeyManager',
        source: 'getNFTMetadata',
        details: { mintAccount }
      });
      return null;
    }
  }

  public async getSPLMetadata(mintAccount: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getSPLMetadata(mintAccount);
      return response;
    } catch (error) {
      console.error("Error fetching SPL metadata:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get SPL metadata'), {
        component: 'HeliusKeyManager',
        source: 'getSPLMetadata',
        details: { mintAccount }
      });
      return null;
    }
  }

  public async getAsset(id: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getAsset(id);
      return response;
    } catch (error) {
      console.error("Error fetching asset:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get asset'), {
        component: 'HeliusKeyManager',
        source: 'getAsset',
        details: { id }
      });
      return null;
    }
  }

  public async getAssets(
    ownerAddress?: string,
    grouping?: string,
    groupingValue?: string,
    limit?: number,
    page?: number
  ) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }

      const options: any = {};
      if (ownerAddress) options.ownerAddress = ownerAddress;
      if (grouping && groupingValue) options.grouping = [grouping, groupingValue];
      if (limit) options.limit = limit;
      if (page) options.page = page;

      const response = await this.helius.getAssets(options);
      return response;
    } catch (error) {
      console.error("Error fetching assets:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get assets'), {
        component: 'HeliusKeyManager',
        source: 'getAssets',
        details: { ownerAddress, grouping, groupingValue, limit, page }
      });
      return null;
    }
  }

  public async getAssetsByAuthority(
    authority: string,
    limit?: number,
    page?: number
  ) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }

      const options: any = {
        authority,
        limit,
        page
      };

      const response = await this.helius.getAssetsByAuthority(options);
      return response;
    } catch (error) {
      console.error("Error fetching assets by authority:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get assets by authority'), {
        component: 'HeliusKeyManager',
        source: 'getAssetsByAuthority',
        details: { authority, limit, page }
      });
      return null;
    }
  }

  public async getAssetsByCreator(
    creator: string,
    limit?: number,
    page?: number
  ) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }

      const options: any = {
        creator,
        limit,
        page
      };

      const response = await this.helius.getAssetsByCreator(options);
      return response;
    } catch (error) {
      console.error("Error fetching assets by creator:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get assets by creator'), {
        component: 'HeliusKeyManager',
        source: 'getAssetsByCreator',
        details: { creator, limit, page }
      });
      return null;
    }
  }

  public async getFirstVerifiedCreator(mint: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getFirstVerifiedCreator(mint);
      return response;
    } catch (error) {
      console.error("Error fetching first verified creator:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get first verified creator'), {
        component: 'HeliusKeyManager',
        source: 'getFirstVerifiedCreator',
        details: { mint }
      });
      return null;
    }
  }

  public async getTransactions(
    account: string,
    limit?: number,
    page?: number
  ) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }

      const options: any = {
        account,
        limit,
        page
      };

      const response = await this.helius.getTransactions(options);
      return response;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get transactions'), {
        component: 'HeliusKeyManager',
        source: 'getTransactions',
        details: { account, limit, page }
      });
      return null;
    }
  }

  public async getTokenList() {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getTokenList();
      return response;
    } catch (error) {
      console.error("Error fetching token list:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get token list'), {
        component: 'HeliusKeyManager',
        source: 'getTokenList'
      });
      return null;
    }
  }

  public async getAddressesByDelegate(delegate: string) {
    try {
      if (!this.helius) {
        throw new Error("Helius SDK not initialized.");
      }
      const response = await this.helius.getAddressesByDelegate(delegate);
      return response;
    } catch (error) {
      console.error("Error fetching addresses by delegate:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get addresses by delegate'), {
        component: 'HeliusKeyManager',
        source: 'getAddressesByDelegate',
        details: { delegate }
      });
      return null;
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      if (!this.connection) {
        throw new Error("Solana connection not initialized.");
      }
      // Use a different method to check health since isHealthy is not available
      const blockHeight = await this.connection.getBlockHeight();
      return blockHeight > 0;
    } catch (error) {
      console.error("Error checking connection health:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to check connection health'), {
        component: 'HeliusKeyManager',
        source: 'isHealthy'
      });
      return false;
    }
  }

  public async getLatestBlockHeight(): Promise<number | null> {
    try {
      if (!this.connection) {
        throw new Error("Solana connection not initialized.");
      }
      const slot = await this.connection.getSlot();
      return slot;
    } catch (error) {
      console.error("Error getting current slot:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get current slot'), {
        component: 'HeliusKeyManager',
        source: 'getLatestBlockHeight'
      });
      return null;
    }
  }

  public async getBalance(publicKey: string): Promise<number | null> {
    try {
      if (!this.connection) {
        throw new Error("Solana connection not initialized.");
      }
      const pubKey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubKey);
      return balance;
    } catch (error) {
      console.error("Error getting balance:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to get balance'), {
        component: 'HeliusKeyManager',
        source: 'getBalance',
        details: { publicKey }
      });
      return null;
    }
  }

  public async testKey(): Promise<boolean> {
    try {
      const isHeliusInitialized = !!this.helius;
      const isSolanaHealthy = await this.isHealthy();
      return isHeliusInitialized && isSolanaHealthy;
    } catch (error) {
      console.error("Error testing Helius key:", error);
      errorCollector.captureError(error instanceof Error ? error : new Error('Failed to test Helius key'), {
        component: 'HeliusKeyManager',
        source: 'testKey'
      });
      return false;
    }
  }

  public async addKeyToDatabase(keyData: any) {
    try {
      const { name, service, key_value, status } = keyData;
      
      // Make sure we provide all required fields
      const { error } = await supabase
        .from('api_keys_storage')
        .insert({
          name,
          service,
          key_value,
          status,
          user_id: (await supabase.auth.getUser()).data.user?.id || '' // Ensure user_id is provided
        });
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error adding key to database:', error);
      return { success: false, error };
    }
  };

  public getApiKey(): string {
    return this.apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.initializeHelius();
  }
}

// Create an instance of the HeliusKeyManager for compatibility with imports
export const heliusKeyManager = new HeliusKeyManager("", "mainnet-beta");

// Re-export for backward compatibility
export default HeliusKeyManager;
