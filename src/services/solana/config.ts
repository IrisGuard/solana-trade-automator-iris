
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Network configuration
export const SOLANA_NETWORK = 'mainnet-beta';
export const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

// Program IDs
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Known token addresses with metadata
export const KNOWN_TOKEN_ADDRESSES: Record<string, { name: string; symbol: string; logo?: string }> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': {
    name: 'Raydium',
    symbol: 'RAY',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
  },
  'So11111111111111111111111111111111111111112': {
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    name: 'Marinade staked SOL',
    symbol: 'mSOL',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
  }
};

// Mock price data for demo purposes
export const MOCK_PRICES: Record<string, number> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1.0,
  'So11111111111111111111111111111111111111112': 80.45,
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 0.65,
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 85.25
};
