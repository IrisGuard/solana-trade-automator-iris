import { toast } from "sonner";

// Υπηρεσία για αλληλεπίδραση με το Phantom API
export const phantomService = {
  isInstalled: (): boolean => {
    return !!window.solana && window.solana.isPhantom;
  },
  
  connect: async () => {
    try {
      if (!window.solana) {
        throw new Error("Phantom wallet is not installed");
      }
      
      const response = await window.solana.connect();
      return response.publicKey.toString();
    } catch (error: any) {
      console.error("Error connecting to Phantom:", error);
      throw error;
    }
  },
  
  disconnect: async () => {
    try {
      if (!window.solana) return;
      await window.solana.disconnect();
      return true;
    } catch (error) {
      console.error("Error disconnecting Phantom:", error);
      throw error;
    }
  }
};

// Υπηρεσία για αλληλεπίδραση με το Solscan API
export const solscanService = {
  getAccountInfo: async (address: string) => {
    try {
      const response = await fetch(`https://public-api.solscan.io/account/${address}`);
      if (!response.ok) {
        throw new Error(`Solscan API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching Solscan account info:", error);
      toast.error("Failed to fetch account information from Solscan");
      throw error;
    }
  },
  
  getTokenHolders: async (tokenAddress: string) => {
    try {
      const response = await fetch(`https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}`);
      if (!response.ok) {
        throw new Error(`Solscan API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching token holders:", error);
      toast.error("Failed to fetch token holders information");
      throw error;
    }
  }
};

// Υπηρεσία για αλληλεπίδραση με το Jupiter API
export const jupiterService = {
  getQuote: async (inputMint: string, outputMint: string, amount: number) => {
    try {
      // Χρησιμοποιούμε το Jupiter API v4
      const response = await fetch(
        `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
      );
      
      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching Jupiter swap quote:", error);
      toast.error("Failed to get swap quote from Jupiter");
      throw error;
    }
  }
};

// Υπηρεσία για αλληλεπίδραση με το Raydium API
export const raydiumService = {
  getPairs: async () => {
    try {
      const response = await fetch("https://api.raydium.io/v2/main/pairs");
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching Raydium pairs:", error);
      toast.error("Failed to fetch Raydium trading pairs");
      throw error;
    }
  },
  
  getTokens: async () => {
    try {
      const response = await fetch("https://api.raydium.io/v2/main/token-list");
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching Raydium tokens:", error);
      toast.error("Failed to fetch Raydium tokens list");
      throw error;
    }
  },
  
  getPrices: async (mints: string[]) => {
    try {
      const mintsParam = mints.join(',');
      const response = await fetch(`https://api.raydium.io/v2/main/price?mints=${mintsParam}`);
      
      if (!response.ok) {
        throw new Error(`Raydium API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching Raydium prices:", error);
      toast.error("Failed to fetch token prices from Raydium");
      throw error;
    }
  }
};

// Εξάγουμε όλες τις υπηρεσίες
export const apiServices = {
  phantom: phantomService,
  solscan: solscanService,
  jupiter: jupiterService,
  raydium: raydiumService
};
