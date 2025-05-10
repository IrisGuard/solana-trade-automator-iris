
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { connection, TOKEN_PROGRAM_ID, KNOWN_TOKEN_ADDRESSES, MOCK_PRICES } from './config';
import { walletService } from './walletService';

export const tokenService = {
  // Get all token accounts owned by an address
  getTokenAccounts: async (address: string): Promise<Token[]> => {
    try {
      const publicKey = new PublicKey(address);
      
      // Get user's token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Transform data to Token[]
      const tokens: Token[] = [];
      
      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        // Skip tokens with zero balance
        if (amount === 0) continue;
        
        // Find info for known tokens
        const knownToken = KNOWN_TOKEN_ADDRESSES[mintAddress];
        
        tokens.push({
          address: mintAddress,
          name: knownToken?.name || `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: knownToken?.symbol || 'UNKNOWN',
          amount: amount,
          logo: knownToken?.logo
        });
      }
      
      // Add native SOL to the token list
      const solBalance = await walletService.getSolBalance(address);
      if (solBalance > 0) {
        tokens.unshift({
          address: 'So11111111111111111111111111111111111111112',
          name: 'Solana',
          symbol: 'SOL',
          amount: solBalance,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        });
      }
      
      return tokens;
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens');
      return [];
    }
  },
  
  // Get current price for a token
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    // Simulate prices for known tokens
    return MOCK_PRICES[tokenAddress] || Math.random() * 10;
  }
};
