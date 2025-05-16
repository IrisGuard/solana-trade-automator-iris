
import { Token, TokenPrices } from "@/types/wallet";

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
