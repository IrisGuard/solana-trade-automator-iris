
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Λίστα με αξιόπιστα δημόσια RPC endpoints (για failover)
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  BACKUP_1: 'https://solana-mainnet.g.alchemy.com/v2/demo',
  BACKUP_2: 'https://rpc.ankr.com/solana',
  BACKUP_3: 'https://ssc-dao.genesysgo.net',
  BACKUP_4: clusterApiUrl('mainnet-beta'),
  DEVNET: clusterApiUrl('devnet'),
  TESTNET: clusterApiUrl('testnet')
};

// Επιλογές σύνδεσης με ρυθμίσεις αξιοπιστίας
export const CONNECTION_CONFIG = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 δευτερόλεπτα
  disableRetryOnRateLimit: false
};

// Initialize τη σύνδεση με το κύριο endpoint
export const connection = new Connection(RPC_ENDPOINTS.PRIMARY, CONNECTION_CONFIG);

// Δημιουργία fallback σύνδεσης αν η κύρια αποτύχει
export const createFallbackConnection = () => {
  // Δοκιμάζει τα backups με τη σειρά
  for (const endpoint of [RPC_ENDPOINTS.BACKUP_1, RPC_ENDPOINTS.BACKUP_2, RPC_ENDPOINTS.BACKUP_3]) {
    try {
      return new Connection(endpoint, CONNECTION_CONFIG);
    } catch (err) {
      console.warn('Failed to create connection with endpoint:', endpoint);
    }
  }
  // Αν όλα αποτύχουν, επιστρέφει τη σύνδεση με το τελευταίο backup
  return new Connection(RPC_ENDPOINTS.BACKUP_4, CONNECTION_CONFIG);
};

// SPL Token program ID
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Associated Token Account Program ID
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

// System Program ID
export const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

// Γνωστά προγράμματα για αναγνώριση τύπου συναλλαγής
export const KNOWN_PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL": "Associated Token Account Program",
  "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB": "Jupiter Aggregator",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM Program",
  "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z75Qb8xsse": "Solend Program",
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr": "Memo Program",
  "mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68": "Marginfi",
  "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY": "Phoenix DEX",
  "J2NhFnBxcwbxovE7avBQCXWJ8Rm5RhQhNSbNybbMWHCU": "Atrix Protocol"
};

// Γνωστές διευθύνσεις tokens
export const KNOWN_TOKEN_ADDRESSES: Record<string, { name: string; symbol: string; logo?: string; decimals?: number }> = {
  "So11111111111111111111111111111111111111112": {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  },
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
  },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": {
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png"
  },
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": {
    name: "Marinade staked SOL (mSOL)",
    symbol: "mSOL",
    decimals: 9,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png"
  },
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": {
    name: "Lido Staked SOL",
    symbol: "stSOL",
    decimals: 9,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png"
  },
  "JUP6i4ozu5ydDCnLiMogSckDPpfSgD2AVtnwvMJUdLt": {
    name: "Jupiter",
    symbol: "JUP",
    decimals: 6,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUP6i4ozu5ydDCnLiMogSckDPpfSgD2AVtnwvMJUdLt/logo.png"
  }
};

// Τιμές για demo
export const MOCK_PRICES: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 60.2, // SOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 1.0, // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 1.0, // USDT
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": 62.5, // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": 61.8, // stSOL
  "JUP6i4ozu5ydDCnLiMogSckDPpfSgD2AVtnwvMJUdLt": 0.85 // JUP
};

// Helius API Key - παράδειγμα για χρήση με τη βιβλιοθήκη Helius
export const HELIUS_API_KEY = ""; // Θα πρέπει να ορισθεί από την API Vault

// Explorer URL για links συναλλαγών
export const EXPLORER_URL = "https://explorer.solana.com";

// Για μετατροπή lamports σε SOL
export const LAMPORTS_PER_SOL = 1000000000;
