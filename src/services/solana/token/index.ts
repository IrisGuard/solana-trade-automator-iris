
import { Token } from '../token/types';

// Μοκ δεδομένα για τη δοκιμή του UI
const mockTokens: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    name: 'Solana',
    symbol: 'SOL',
    amount: 1.23,
    decimals: 9,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    name: 'Wrapped Bitcoin',
    symbol: 'BTC',
    amount: 0.001,
    decimals: 8,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png'
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    amount: 100,
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  }
];

export const fetchTokenBalance = async (wallet: string, tokenAddress: string): Promise<number> => {
  console.log(`Fetching balance for token ${tokenAddress} in wallet ${wallet}`);
  
  // Προσομοίωση API κλήσης
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = mockTokens.find(t => t.address === tokenAddress);
      resolve(token?.amount || 0);
    }, 500);
  });
};

export const fetchAllTokenBalances = async (walletAddress: string): Promise<Token[]> => {
  console.log(`Fetching all token balances for wallet ${walletAddress}`);
  
  // Προσομοίωση API κλήσης
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTokens);
    }, 1000);
  });
};
