
import { ApiKey } from "../types";

// Demo API keys to help users get started with the API Vault feature
// All demo keys have been replaced with placeholder values
export const demoKeys: ApiKey[] = [
  {
    id: "demo-helius-1",
    name: "Helius API (Placeholder)",
    key: "[Your Helius API Key]",
    service: "helius",
    createdAt: new Date().toISOString(),
    description: "Add your Helius API key here",
    status: "pending",
    isWorking: false
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
