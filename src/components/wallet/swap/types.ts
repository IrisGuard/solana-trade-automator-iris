
import { Token } from "@/types/wallet";

export interface SwapFormProps {
  isConnected?: boolean;
  connectWallet?: () => void;
}

export interface SwapQuoteProps {
  inputToken: Token | { symbol: string; name: string; mint: string };
  outputToken: Token | { symbol: string; name: string; mint: string };
  inputAmount: number;
  outputAmount: number;
  priceImpact: string;
}

export interface TokenInfo {
  symbol: string;
  name?: string;
  mint: string;
}

export interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  isLoading: boolean;
  quoteResponse: any;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  priceImpact: string;
}

export const COMMON_TOKEN_LIST = [
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
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    decimals: 6
  }
];
