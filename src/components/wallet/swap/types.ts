
import { Token } from "@/types/wallet";

export interface SwapFormProps {
  isConnected: boolean;
  connectWallet: () => Promise<void>;
}

export interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  isLoading: boolean;
  quoteResponse: any | null;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  priceImpact: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
}

export interface SwapQuoteProps {
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
}

// Common token constants for the app
export const COMMON_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  ETH: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
};

export const COMMON_TOKEN_LIST = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: COMMON_TOKENS.SOL,
    decimals: 9
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: COMMON_TOKENS.USDC,
    decimals: 6
  },
  {
    symbol: "USDT",
    name: "Tether",
    mint: COMMON_TOKENS.USDT,
    decimals: 6
  },
  {
    symbol: "ETH",
    name: "Ethereum (Solana)",
    mint: COMMON_TOKENS.ETH,
    decimals: 8
  }
];
