
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

export interface TokenInfo {
  symbol: string;
  name: string;
  address?: string;
  mint?: string;
  decimals?: number;
  logo?: string;
}

export const COMMON_TOKEN_LIST: TokenInfo[] = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6
  },
  {
    symbol: "BONK",
    name: "Bonk",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5
  }
];
