
import { Token } from "@/types/wallet";

export interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  isLoading: boolean;
  quoteResponse: any;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  outputAmount: string;
  priceImpact: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  amount?: number;
  logo?: string;
}

export interface SwapQuoteProps {
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  outputAmount: string;
  inputAmount: string;
  priceImpact: string;
}

export interface SwapFormProps {
  isConnected: boolean;
  connectWallet: () => void;
}

// Common Solana tokens
export const COMMON_TOKENS = [
  { mint: "So11111111111111111111111111111111111111112", symbol: "SOL", name: "Solana", decimals: 9 },
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", name: "USD Coin", decimals: 6 },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", name: "Tether", decimals: 6 },
  { mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", symbol: "mSOL", name: "Marinade Staked SOL", decimals: 9 },
  { mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", symbol: "stSOL", name: "Lido Staked SOL", decimals: 9 },
];
