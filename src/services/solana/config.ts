
/**
 * Ρυθμίσεις για τα Solana RPC endpoints
 */
export const RPC_ENDPOINTS = {
  // Κύρια endpoints
  PRIMARY: "https://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
  
  // Εναλλακτικά endpoints
  BACKUP_1: "https://solana-mainnet.rpc.extrnode.com",
  BACKUP_2: "https://api.mainnet-beta.solana.com",
  BACKUP_3: "https://solana-api.projectserum.com",
  BACKUP_4: "https://rpc.ankr.com/solana",
  BACKUP_5: "https://ssc-dao.genesysgo.net",
  BACKUP_6: "https://solana-mainnet.g.alchemy.com/v2/demo",
  BACKUP_7: "https://solana-mainnet.spcn.prod.block.one",
  
  // WebSocket endpoints
  HELIUS_WS: "wss://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
  
  // Δίκτυα δοκιμών
  DEVNET: "https://api.devnet.solana.com",
  TESTNET: "https://api.testnet.solana.com",
};

/**
 * API Endpoints για υπηρεσίες
 */
export const API_ENDPOINTS = {
  // Helius API
  HELIUS_API: "https://api.helius.xyz/v0",
  HELIUS_RPC: "https://mainnet.helius-rpc.com",
  
  // Solana blockchain explorers
  SOLSCAN: "https://api.solscan.io",
  SOLANA_FM: "https://api.solana.fm",
  
  // Τιμές και δεδομένα αγοράς
  COINGECKO: "https://api.coingecko.com/api/v3",
  BIRDEYE: "https://public-api.birdeye.so",
};

/**
 * Χρόνοι λήξης για αποθηκευμένα δεδομένα (σε milliseconds)
 */
export const CACHE_EXPIRY = {
  TOKEN_METADATA: 24 * 60 * 60 * 1000, // 24 ώρες
  PRICE_DATA: 5 * 60 * 1000, // 5 λεπτά
  BALANCE_DATA: 30 * 1000, // 30 δευτερόλεπτα
};

/**
 * Προεπιλεγμένο timeout για αιτήματα API (σε milliseconds)
 */
export const API_TIMEOUT = 30000; // 30 δευτερόλεπτα

/**
 * Προεπιλεγμένες HTTP κεφαλίδες για αιτήματα API
 */
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
