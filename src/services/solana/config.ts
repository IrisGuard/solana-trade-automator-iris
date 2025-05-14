import { Commitment, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Λίστα με αξιόπιστα δημόσια RPC endpoints (για failover)
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053',
  BACKUP_1: 'https://eclipse.helius-rpc.com/',
  BACKUP_2: 'https://solana-rpc.publicnode.com',
  BACKUP_3: 'https://api.blockeden.xyz/solana/67nCBdZQSH9z3YqDDjdm',
  BACKUP_4: 'https://go.getblock.io/4136d34f90a6488b84214ae26f0ed5f4',
  BACKUP_5: 'https://solana.drpc.org/',
  BACKUP_6: 'https://endpoints.omniatech.io/v1/sol/mainnet/public',
  BACKUP_7: 'https://solana.api.onfinality.io/public',
  HELIUS_WS: 'wss://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053',
  DEVNET: clusterApiUrl('devnet'),
  TESTNET: clusterApiUrl('testnet')
};

// APIs και third-party υπηρεσίες
export const API_ENDPOINTS = {
  SOLSCAN: 'https://public-api.solscan.io',
  SOLANA_FM: 'https://api.solana.fm/v0',
  COINCAP: 'https://api.coincap.io/v2',
  COINPAPRIKA: 'https://api.coinpaprika.com/v1',
  CRYPTOCOMPARE: 'https://min-api.cryptocompare.com/data',
  COINLIB: 'https://coinlib.io/api/v1',
  JUPITER: 'https://lite-api.jup.ag',
  RAYDIUM: 'https://api.raydium.io',
  ORCA: 'https://api.orca.so/v1',
  SOLFLARE: 'https://public-api.solflare.com',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  HELIUS_API: 'https://api.helius.xyz/v0'
};

// API keys για third-party υπηρεσίες (μόνο για public keys)
export const API_KEYS = {
  COINGECKO: 'CG-2KBnBnmkjfr2zoCQA51GsWBj',
  HELIUS: 'ddb32813-1f4b-459d-8964-310b1b73a053'
};

// Επιλογές σύνδεσης με ρυθμίσεις αξιοπιστίας
export const CONNECTION_CONFIG = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: 60000, // 60 δευτερόλεπτα
  disableRetryOnRateLimit: false
};

// Initialize τη σύνδεση με το κύριο endpoint
export const connection = new Connection(RPC_ENDPOINTS.PRIMARY, CONNECTION_CONFIG);

// Δημιουργία fallback σύνδεσης αν η κύρια αποτύχει
export const createFallbackConnection = () => {
  // Δοκιμάζει τα backups με τη σειρά
  for (const endpoint of [
    RPC_ENDPOINTS.BACKUP_1, 
    RPC_ENDPOINTS.BACKUP_2, 
    RPC_ENDPOINTS.BACKUP_3,
    RPC_ENDPOINTS.BACKUP_4,
    RPC_ENDPOINTS.BACKUP_5
  ]) {
    try {
      return new Connection(endpoint, CONNECTION_CONFIG);
    } catch (err) {
      console.warn('Failed to create connection with endpoint:', endpoint);
    }
  }
  // Αν όλα αποτύχουν, επιστρέφει τη σύνδεση με το τελευταίο backup
  return new Connection(RPC_ENDPOINTS.BACKUP_6, CONNECTION_CONFIG);
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
  "J2NhFnBxcwbxovE7avBQCXWJ8Rm5RhQhNSbNybbMWHCU": "Atrix Protocol",
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s": "Metaplex Token Metadata",
  "Stake1111111111111111111111111111111111111111": "Stake Program",
  "Vote111111111111111111111111111111111111111": "Vote Program",
  "SearcherDz1LucrwNZSXRrZe27iCbXgdZqYdVqjTkDqL": "MEV Searcher Program",
  "ComputeBudget111111111111111111111111111111": "Compute Budget"
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
  },
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
    name: "Bonk",
    symbol: "BONK",
    decimals: 5,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png"
  },
  "RAYv9wav3Q57K6vKXBXBAR9v8RNUWM3V7GNLXt8KmgH": {
    name: "Raydium",
    symbol: "RAY",
    decimals: 6,
    logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/RAYv9wav3Q57K6vKXBXBAR9v8RNUWM3V7GNLXt8KmgH/logo.png"
  }
};

// Τιμές για demo
export const MOCK_PRICES: Record<string, number> = {
  "So11111111111111111111111111111111111111112": 60.2, // SOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 1.0, // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 1.0, // USDT
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": 62.5, // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": 61.8, // stSOL
  "JUP6i4ozu5ydDCnLiMogSckDPpfSgD2AVtnwvMJUdLt": 0.85, // JUP
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": 0.00000237, // BONK
  "RAYv9wav3Q57K6vKXBXBAR9v8RNUWM3V7GNLXt8KmgH": 0.34 // RAY
};

// Explorer URL για links συναλλαγών
export const EXPLORER_URL = "https://explorer.solana.com";

// Για μετατροπή lamports σε SOL
export const LAMPORTS_PER_SOL = 1000000000;
