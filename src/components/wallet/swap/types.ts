
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

// Common tokens for easier access
export const COMMON_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  BTC: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
  ETH: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
};

export const COMMON_TOKEN_LIST = [
  {
    mint: COMMON_TOKENS.SOL,
    symbol: "SOL",
    name: "Solana",
    decimals: 9
  },
  {
    mint: COMMON_TOKENS.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6
  },
  {
    mint: COMMON_TOKENS.USDT,
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6
  },
  {
    mint: COMMON_TOKENS.BTC,
    symbol: "BTC",
    name: "Bitcoin (Wrapped)",
    decimals: 8
  },
  {
    mint: COMMON_TOKENS.ETH,
    symbol: "ETH",
    name: "Ethereum (Wrapped)",
    decimals: 8
  }
];
