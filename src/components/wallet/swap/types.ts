
// If this file doesn't exist yet, let's create it with the necessary types
import { Token } from "@/types/wallet";

export interface SwapFormProps {
  isConnected: boolean;
  connectWallet: () => void;
}

export interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  isLoading: boolean;
  quoteResponse: any | null;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  outputAmount: string;
  priceImpact: string;
}

export interface SwapQuoteProps {
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  outputAmount: string;
  inputAmount: string;
  priceImpact: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
}
