
import { Connection, PublicKey } from '@solana/web3.js';

// Χρησιμοποιούμε το public δημόσιο RPC endpoint της GenesysGo (Mainnet-beta)
export const SOLANA_RPC_ENDPOINT = 'https://ssc-dao.genesysgo.net';

// Initialize the connection with longer timeout και retry
export const connection = new Connection(SOLANA_RPC_ENDPOINT, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 δευτερόλεπτα
  disableRetryOnRateLimit: false
});

// SPL Token program ID
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Γνωστά προγράμματα για αναγνώριση τύπου συναλλαγής
export const KNOWN_PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL": "Associated Token Account Program",
  "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB": "Jupiter Aggregator",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM Program",
  "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z75Qb8xsse": "Solend Program"
};

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
