
import { ApiKey } from "../types";

// Demo API keys to help users get started with the API Vault feature
export const demoKeys: ApiKey[] = [
  {
    id: "demo-helius-1",
    name: "Helius API Demo Key",
    key: "ddb32813-1f4b-459d-8964-310b1b73a053",
    service: "helius",
    createdAt: new Date().toISOString(),
    description: "Demo key for Helius API testing",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-solana-1", 
    name: "Solana RPC Endpoint",
    key: "https://api.mainnet-beta.solana.com",
    service: "solana",
    createdAt: new Date().toISOString(),
    description: "Public Solana RPC endpoint",
    status: "active",
    isWorking: true
  }
];
