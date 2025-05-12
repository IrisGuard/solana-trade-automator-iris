
import { API_ENDPOINTS, API_KEYS } from './config';

// Βασικές κλάσεις για διαχείριση των API endpoints
export class ApiEndpointManager {
  // Επιστρέφει το κατάλληλο API endpoint με βάση το όνομα της υπηρεσίας
  static getEndpoint(apiName: keyof typeof API_ENDPOINTS): string {
    return API_ENDPOINTS[apiName] || '';
  }

  // Προσθέτει το API key στο URL αν χρειάζεται
  static getUrlWithApiKey(apiName: string, endpoint: string, paramName: string = 'api_key'): string {
    const apiKey = this.getApiKey(apiName);
    if (!apiKey) return endpoint;
    
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}${paramName}=${apiKey}`;
  }

  // Επιστρέφει το API key με βάση το όνομα της υπηρεσίας
  static getApiKey(apiName: keyof typeof API_KEYS): string | null {
    return API_KEYS[apiName as keyof typeof API_KEYS] || null;
  }

  // Δημιουργεί ένα πλήρες URL για κλήση API συνδυάζοντας το βασικό endpoint με ένα path
  static buildUrl(apiName: keyof typeof API_ENDPOINTS, path: string): string {
    const baseUrl = this.getEndpoint(apiName);
    // Αφαίρεση τυχόν trailing slash από το baseUrl και leading slash από το path
    const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const sanitizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${sanitizedBaseUrl}/${sanitizedPath}`;
  }
}

// Έτοιμα API URLs για συχνές λειτουργίες
export const SolanaApis = {
  // Jupiter API
  jupiter: {
    quote: (inputMint: string, outputMint: string, amount: string) => 
      `${API_ENDPOINTS.JUPITER}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`,
    swap: `${API_ENDPOINTS.JUPITER}/swap`,
    price: (ids: string) => 
      `${API_ENDPOINTS.JUPITER}/price?ids=${ids}`
  },
  
  // Raydium API
  raydium: {
    pairs: `${API_ENDPOINTS.RAYDIUM}/v2/main/pairs`,
    pools: `${API_ENDPOINTS.RAYDIUM}/v2/main/pools`,
    price: (id: string) => 
      `${API_ENDPOINTS.RAYDIUM}/v2/main/price?fsyms=${id}`
  },
  
  // CoinGecko API
  coingecko: {
    price: (ids: string, currencies: string = 'usd') => {
      const apiKey = API_KEYS.COINGECKO;
      const baseUrl = `${API_ENDPOINTS.COINGECKO}/simple/price?ids=${ids}&vs_currencies=${currencies}`;
      return apiKey ? `${baseUrl}&x_cg_pro_api_key=${apiKey}` : baseUrl;
    },
    markets: (vs_currency: string = 'usd', category: string = 'solana-ecosystem', order: string = 'market_cap_desc') => {
      const apiKey = API_KEYS.COINGECKO;
      const baseUrl = `${API_ENDPOINTS.COINGECKO}/coins/markets?vs_currency=${vs_currency}&category=${category}&order=${order}`;
      return apiKey ? `${baseUrl}&x_cg_pro_api_key=${apiKey}` : baseUrl;
    }
  },
  
  // Solscan API
  solscan: {
    account: (address: string) => 
      `${API_ENDPOINTS.SOLSCAN}/account/${address}`,
    transaction: (signature: string) => 
      `${API_ENDPOINTS.SOLSCAN}/transaction/${signature}`,
    token: (address: string) => 
      `${API_ENDPOINTS.SOLSCAN}/token/${address}`
  }
};

// Κεφαλίδες για τα API requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Timeout για τα API requests (σε milliseconds)
export const API_TIMEOUT = 10000;

// Διαχείριση σφαλμάτων API
export class ApiErrorHandler {
  static handleError(error: any, apiName: string): Error {
    console.error(`API Error (${apiName}):`, error);
    
    if (error.response) {
      return new Error(`${apiName} API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    }
    
    if (error.request) {
      return new Error(`${apiName} API Request Error: No response received`);
    }
    
    return new Error(`${apiName} API Error: ${error.message || 'Unknown error'}`);
  }
}
