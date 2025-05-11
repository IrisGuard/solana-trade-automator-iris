
import { Connection, PublicKey } from '@solana/web3.js';

// Χρησιμοποιούμε ένα αξιόπιστο public RPC endpoint
export const SOLANA_RPC_ENDPOINT = 'https://solana-mainnet.rpc.extrnode.com';

// Initialize the connection to Solana
export const connection = new Connection(SOLANA_RPC_ENDPOINT);

// SPL Token program ID
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Γνωστές διευθύνσεις tokens
export const KNOWN_TOKEN_ADDRESSES: Record<string, { name: string; symbol: string; logo?: string }> = {
  "So11111111111111111111111111111111111111112": {
    name: "Solana",
    symbol: "SOL",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  },
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
    name: "USD Coin",
    symbol: "USDC",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
  },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": {
    name: "USDT",
    symbol: "USDT",
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png"
  },
  // Προσθήκη περισσότερων γνωστών tokens εδώ
};

// Εικονικές τιμές για demo
export const MOCK_PRICES: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 60.2, // SOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 1.0, // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 1.0, // USDT
};
