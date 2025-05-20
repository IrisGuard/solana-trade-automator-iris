
import { Token } from '@/types/wallet';
import { TokenPrices } from '@/types/wallet';

// Interface for the wallet connection hook return values
export interface WalletConnectionHook {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  walletAddress: string | null;
  solBalance: number;
  tokens: Token[];
  tokenPrices: TokenPrices;
  isLoadingTokens: boolean;
  isPhantomInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshWalletData: (address?: string) => Promise<void>;
  selectTokenForTrading: (tokenAddress: string) => Token | null;
}
