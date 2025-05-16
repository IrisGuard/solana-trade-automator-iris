
import { ApiKey } from "../types";

// Empty array - don't use demo keys anymore
export const demoKeys: ApiKey[] = [];

// This function provides guidance but doesn't inject demo keys
export const getApiKeyHelp = () => {
  return {
    helius: {
      name: "Helius API Guide",
      description: "Get your key at https://dev.helius.xyz/dashboard/app",
      placeholder: "Your Helius API Key"
    },
    solana: {
      name: "Solana RPC Info",
      description: "Public endpoints available, or get your own at Quicknode/Alchemy",
      placeholder: "https://your-node-url.com"
    }
  };
};
