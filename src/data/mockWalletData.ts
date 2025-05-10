
import { Token } from "@/types/wallet";

export const getMockTokens = (): Token[] => [
  { 
    address: 'So11111111111111111111111111111111111111112', 
    name: 'Solana', 
    symbol: 'SOL', 
    amount: 2.5,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
  },
  { 
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
    name: 'USD Coin', 
    symbol: 'USDC', 
    amount: 158.42,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  { 
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', 
    name: 'Raydium', 
    symbol: 'RAY', 
    amount: 50,
    logo: 'https://raw.githubusercontent.com/raydium-io/media-assets/master/logo.png'
  }
];
