
import { clusterApiUrl } from '@solana/web3.js';

// API Endpoints βασισμένα στο PR του χρήστη
export const API_ENDPOINTS = {
  HELIUS_API: 'https://api.helius.xyz/v0',
  HELIUS_RPC: 'https://mainnet.helius-rpc.com',
  SOLSCAN: 'https://api.solscan.io',
  SOLANA_FM: 'https://api.solana.fm',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BIRDEYE: 'https://api.birdeye.so',
  JUPITER: 'https://price.jup.ag/v4',
  RAYDIUM: 'https://api.raydium.io'
};

// RPC Endpoints
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  BACKUP_1: 'https://solana-api.projectserum.com',
  BACKUP_2: 'https://rpc.ankr.com/solana',
  BACKUP_3: clusterApiUrl('mainnet-beta'),
  BACKUP_4: 'https://ssc-dao.genesysgo.net',
  BACKUP_5: 'https://mainnet.rpcpool.com',
  BACKUP_6: 'https://solana-mainnet.rpc.extrnode.com',
  BACKUP_7: 'https://solana-mainnet.g.alchemy.com/v2/demo',
  HELIUS_WS: 'wss://mainnet.helius-rpc.com',
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: clusterApiUrl('devnet'),
  TESTNET: clusterApiUrl('testnet')
};

// Γνωστά προγράμματα στο Solana
export const KNOWN_PROGRAMS = {
  TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  ASSOCIATED_TOKEN_PROGRAM: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
  JUPITER_PROGRAM: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  RAYDIUM_PROGRAM: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  SERUM_PROGRAM: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
};

// Γνωστές διευθύνσεις token
export const KNOWN_TOKEN_ADDRESSES = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BTC: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  ETH: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
};

// Σταθερά από @solana/web3.js
export const LAMPORTS_PER_SOL = 1000000000;

// Mock τιμές για το development
export const MOCK_PRICES = {
  [KNOWN_TOKEN_ADDRESSES.SOL]: { price: 24.56, priceChange24h: 1.2 },
  [KNOWN_TOKEN_ADDRESSES.USDC]: { price: 1.00, priceChange24h: 0.01 },
  [KNOWN_TOKEN_ADDRESSES.USDT]: { price: 1.00, priceChange24h: -0.02 },
  [KNOWN_TOKEN_ADDRESSES.BTC]: { price: 45323.45, priceChange24h: 0.5 },
  [KNOWN_TOKEN_ADDRESSES.ETH]: { price: 2145.67, priceChange24h: -1.3 }
};

// Κλειδιά API για πρόσβαση σε διαφορετικές υπηρεσίες
export const API_KEYS = {
  HELIUS: 'ddb32813-1f4b-459d-8964-310b1b73a053', // Demo key - Replace with actual key
  SOLSCAN: '',  // Replace with actual key
  BIRDEYE: ''   // Replace with actual key
};
