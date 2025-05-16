
import { Token } from "@/types/wallet";
import { TokenPrice } from "@/services/solana/token/types";

export type TokenPrices = Record<string, TokenPrice>;

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
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  refreshWalletData: (address?: string) => Promise<void>;
  selectTokenForTrading: (tokenAddress: string) => Token | null;
}
