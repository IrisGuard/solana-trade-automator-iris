
import { ApiKey, RecommendedApi, ApiSettings } from "./types";

// Default recommended APIs for Solana
export const DEFAULT_RECOMMENDED_APIS: RecommendedApi[] = [
  {
    name: "Solana RPC API",
    description: "Official Solana RPC API for blockchain interaction",
    url: "https://docs.solana.com/api"
  },
  {
    name: "Helius",
    description: "Enhanced Solana RPC with additional functionality",
    url: "https://docs.helius.dev/"
  },
  {
    name: "QuickNode",
    description: "Fast and reliable Solana node infrastructure",
    url: "https://www.quicknode.com/docs/solana"
  },
  {
    name: "Alchemy",
    description: "Developer platform with enhanced APIs and tools",
    url: "https://docs.alchemy.com/reference/solana-api-overview"
  }
];

// Default API keys for demonstration
export const DEFAULT_API_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Solana Mainnet",
    service: "Solana RPC",
    key: "demo-key-solana-mainnet",
    connected: true,
    createdAt: new Date().toISOString(),
    status: "active"
  },
  {
    id: "2",
    name: "Helius Development",
    service: "Helius API",
    key: "demo-key-helius",
    connected: false,
    createdAt: new Date().toISOString(),
    status: "active"
  }
];

// Default API settings
export const DEFAULT_API_SETTINGS: ApiSettings = {
  rpcEndpoint: "https://api.mainnet-beta.solana.com",
  apiEndpoint: "https://api.solana.fm/v1",
  websocketEndpoint: "wss://api.mainnet-beta.solana.com",
  rpcUrl: "https://api.mainnet-beta.solana.com",
  customRpc: false,
  fallbackRpc: true,
  rateLimit: 10
};
