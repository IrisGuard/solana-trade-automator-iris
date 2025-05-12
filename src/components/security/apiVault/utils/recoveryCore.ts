
import { ApiKey } from "../types";
import CryptoJS from "crypto-js";

// Common passwords to try for decryption
export const COMMON_PASSWORDS = [
  'password', 
  '123456', 
  'admin', 
  'master', 
  'apikey',
  'secret',
  'key',
  'vault',
  'secure',
  'api',
  'pass',
  'crypto',
  'wallet',
  'trading',
  'exchange',
  'binance',
  'solana',
  'blockchain',
  // Additional common passwords
  'rork',
  'rorkapp',
  'admin123',
  'password123',
  'qwerty',
  '123456789',
  '12345678',
  'letmein',
  '1234',
];

// Expanded list of potential storage keys to search for API keys
export const POTENTIAL_STORAGE_KEYS = [
  'apiKeys',
  'api-keys', 
  'apikeyvault', 
  'secure-api-keys',
  'user-api-keys',
  'walletApiKeys',
  'applicationKeys',
  'devKeys',
  'serviceKeys',
  'keys',
  'apiTokens',
  'credentials',
  'secretKeys',
  'serviceTokens',
  'developerKeys',
  'api_keys',
  'externalKeys',
  'platformIntegrations',
  'integrationKeys',
  'thirdPartyTokens',
  // Additional storage keys to search
  'savedKeys',
  'userKeys',
  'appKeys',
  'cryptoKeys',
  'walletKeys',
  'dexKeys',
  'exchangeKeys',
  'tradingKeys',
  'apiKeyCollection',
  'tokenStorage',
  'accessKeys',
  'secretAccessKeys',
  'allKeys',
  'keyChain',
  'keyRing',
  'savedApiKeys',
  'appSecrets',
  'mainKeys',
  'backupKeys',
  'keyBackup',
  'authKeys',
  'persistedKeys',
  'web3Keys',
  'blockchainKeys',
  'systemKeys',
  'privateKeys',
  'publicKeys',
  'accountKeys',
  'keyStore',
  // Additional keys specifically for rork.app and similar applications
  'rorkKeys',
  'rorkApiKeys',
  'rork-keys',
  'rork-api-keys',
  'rorkapp',
  'rork',
  'rorkStorage',
  'rorkData',
  // Generic object storage names that might contain keys
  'data',
  'userData',
  'appData',
  'localStorage',
  'storage',
  'settings',
  'userSettings',
  'appSettings',
  'config',
  'userConfig',
  'appConfig',
  'preferences',
  'userPreferences',
  'appPreferences',
];

// Helper function to normalize service names
export const normalizeServiceName = (service: string): string => {
  // Convert to lowercase
  service = service.toLowerCase();
  
  // Remove common prefixes/suffixes
  service = service.replace(/(api|keys|key|service|token|tokens)$/i, '');
  service = service.replace(/^(api|keys|key|service|token|tokens)/i, '');
  
  // Remove special characters and trim
  service = service.replace(/[^a-z0-9]/g, '').trim();
  
  // Map common variations to standard names
  const serviceMap: {[key: string]: string} = {
    'binanceapi': 'binance',
    'binancecom': 'binance',
    'binanceus': 'binance',
    'solrpc': 'solana',
    'solanarpc': 'solana',
    'phantomwallet': 'phantom',
    'metamask': 'ethereum',
    'ethapi': 'ethereum',
    'ethereumrpc': 'ethereum',
    'krakenapi': 'kraken',
    'krakenex': 'kraken',
    'coinbaseapi': 'coinbase',
    'coinbasepro': 'coinbase',
  };
  
  return serviceMap[service] || service;
};

// Replace the old initializeAutoRecovery function with a simple no-op version
export const initializeAutoRecovery = (): void => {
  console.log('Auto-recovery is disabled to prevent page reloads');
};
