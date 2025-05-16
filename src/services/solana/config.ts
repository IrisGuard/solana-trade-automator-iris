
import { clusterApiUrl, Connection, ConnectionConfig } from "@solana/web3.js";

export const CLUSTER = "mainnet-beta";
export const SOLANA_CLUSTER = CLUSTER;
export const LAMPORTS_PER_SOL = 1000000000;

// RPC Endpoints for different networks
export const RPC_ENDPOINTS = {
  MAINNET: "https://api.mainnet-beta.solana.com",
  DEVNET: "https://api.devnet.solana.com",
  TESTNET: "https://api.testnet.solana.com",
  FALLBACK: clusterApiUrl("mainnet-beta")
};

// API Endpoints for various services
export const API_ENDPOINTS = {
  HELIUS: "https://api.helius.xyz/v0",
  SOLANA_FM: "https://api.solana.fm",
  JUPITER: "https://quote-api.jup.ag/v4"
};

// Well-known Solana program IDs
export const KNOWN_PROGRAMS = {
  TOKEN_PROGRAM: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  ASSOCIATED_TOKEN: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  SYSTEM_PROGRAM: "11111111111111111111111111111111",
  MEMO_PROGRAM: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
};

// Connection settings
export const CONNECTION_CONFIG = {
  commitment: "confirmed" as const,
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
};

// DEFAULT NETWORK API KEYS
export const API_KEYS = {
  // Demo public key - limited usage
  HELIUS_DEMO: "ddb32813-1f4b-459d-8964-310b1b73a053"
};

// Create and export a connection instance
export const connection = new Connection(
  RPC_ENDPOINTS.MAINNET,
  CONNECTION_CONFIG
);
