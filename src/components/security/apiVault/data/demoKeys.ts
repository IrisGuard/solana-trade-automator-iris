
import { ApiKey } from "../types";

// No demo keys - only real user keys
export const demoKeys: ApiKey[] = [];

export const getApiKeyHelp = () => {
  return {
    helius: {
      name: "Helius API Guide",
      description: "Get your key at https://dev.helius.xyz/dashboard/app",
      placeholder: "Your Real Helius API Key"
    },
    solana: {
      name: "Solana RPC Info", 
      description: "Use your own RPC endpoint from Quicknode/Alchemy",
      placeholder: "https://your-real-node-url.com"
    }
  };
};
