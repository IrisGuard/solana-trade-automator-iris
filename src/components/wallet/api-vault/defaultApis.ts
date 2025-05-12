
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
    url: "https://www.quicknode.com/docs/solana",
    features: [
      "Enhanced APIs",
      "Webhooks",
      "Archive data",
      "Free tier available"
    ]
  },
  {
    name: "Alchemy",
    description: "Developer platform with enhanced APIs and tools",
    url: "https://docs.alchemy.com/reference/solana-api-overview"
  },
  // Νέα APIs που προσθέτουμε
  {
    name: "Phantom API",
    description: "Phantom Wallet API for Solana dApps",
    url: "https://docs.phantom.app/",
    features: [
      "Connect/disconnect wallet",
      "Sign transactions",
      "Send SOL/tokens",
      "Sign messages"
    ],
    example: "window.solana.connect()"
  },
  {
    name: "Solana Web3.js",
    description: "Official Solana JavaScript SDK",
    url: "https://solana-labs.github.io/solana-web3.js/",
    features: [
      "Transaction building",
      "Account management",
      "RPC connections",
      "Token operations"
    ],
    example: "new web3.Connection('https://api.mainnet-beta.solana.com')"
  },
  {
    name: "Solscan API",
    description: "Solscan blockchain explorer API",
    url: "https://public-api.solscan.io/docs/",
    features: [
      "Account/token lookups",
      "Transaction history",
      "NFT metadata",
      "Market data"
    ],
    example: "https://public-api.solscan.io/account/address"
  },
  {
    name: "Jupiter API",
    description: "Solana DEX aggregator API",
    url: "https://docs.jup.ag/",
    features: [
      "Token swaps",
      "Route calculation",
      "Price quotes",
      "Liquidity info"
    ]
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
