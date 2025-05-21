
import { Token } from "@/types/wallet";

export interface SwapFormProps {
  isConnected?: boolean;
  connectWallet?: () => void;
}

export interface SwapQuoteProps {
  inputToken: {
    symbol: string;
    name: string;
    mint: string;
  };
  outputToken: {
    symbol: string;
    name: string;
    mint: string;
  };
  outputAmount: number;
  inputAmount: number;
  priceImpact: string;
}

export interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  isLoading: boolean;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  quoteResponse: any | null;
  priceImpact: string;
}

export interface BotStatus {
  type: 'idle' | 'running' | 'paused' | 'error';
}

export interface TradingOrder {
  id: string;
  tokenSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
}
