
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logError } from '@/utils/errorUtils';
import { Token } from '@/types/wallet';
import { getTokenAccounts, parseTokenAccounts } from './token/tokenAccounts';
import { getTokenBalance, getSolBalance } from './token/balance';

/**
 * Service for managing Solana SPL tokens
 */
export const tokenService = {
  /**
   * Create a connection object with retry capabilities
   */
  createConnection(options: { endpoint: string, maxRetries?: number, retryDelay?: number }) {
    const { endpoint, maxRetries = 3, retryDelay = 1000 } = options;
    return new Connection(endpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });
  },

  /**
   * Get token accounts for a wallet
   */
  async getTokenAccounts(connection: Connection, walletAddress: string) {
    return await getTokenAccounts(connection, walletAddress);
  },

  /**
   * Get parsed token accounts with balance information
   */
  async getParsedTokenAccounts(connection: Connection, walletAddress: string) {
    try {
      const tokenAccounts = await this.getTokenAccounts(connection, walletAddress);
      return await parseTokenAccounts(connection, tokenAccounts);
    } catch (error) {
      logError('Failed to get parsed token accounts', 'tokenService', { 
        action: 'getParsedTokenAccounts', 
        walletAddress 
      });
      return [];
    }
  },

  /**
   * Get SPL token balance
   */
  async getTokenBalance(connection: Connection, walletAddress: string, tokenAddress: string) {
    return await getTokenBalance(connection, walletAddress, tokenAddress);
  },

  /**
   * Get SOL balance
   */
  async getSolBalance(connection: Connection, walletAddress: string) {
    return await getSolBalance(connection, walletAddress);
  },

  /**
   * Get all tokens and balances for a wallet
   */
  async getAllTokens(connection: Connection, walletAddress: string): Promise<Token[]> {
    try {
      // Get SOL balance
      const solBalance = await this.getSolBalance(connection, walletAddress);
      
      // Get SPL tokens
      const parsedTokenAccounts = await this.getParsedTokenAccounts(connection, walletAddress);
      
      // Create Token objects
      const tokens: Token[] = [
        {
          name: 'Solana',
          symbol: 'SOL',
          address: 'SOL', // SOL doesn't have an SPL address
          amount: solBalance,
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        }
      ];
      
      // Add SPL tokens
      for (const account of parsedTokenAccounts) {
        try {
          // Get token metadata (in a real app you'd use a token registry)
          const metadata = {
            name: `Token ${account.mint.slice(0, 4)}`,
            symbol: `TKN-${account.mint.slice(0, 4)}`,
            decimals: 9
          };
          
          tokens.push({
            name: metadata.name,
            symbol: metadata.symbol,
            address: account.mint,
            amount: account.amount / Math.pow(10, metadata.decimals),
            decimals: metadata.decimals,
            logo: undefined
          });
        } catch (tokenError) {
          console.error('Error parsing token:', tokenError);
        }
      }
      
      return tokens;
    } catch (error) {
      logError('Failed to get all tokens', 'tokenService', { 
        action: 'getAllTokens', 
        address: walletAddress 
      });
      return [];
    }
  }
};
