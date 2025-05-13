
import { ResourceLink, ResourceCategory } from './types';

// Define the resource categories for Solana
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: 'wallet', name: 'Πορτοφόλια' },
  { id: 'dex', name: 'Ανταλλακτήρια (DEX)' },
  { id: 'tools', name: 'Εργαλεία' },
  { id: 'nft', name: 'NFT' },
  { id: 'learn', name: 'Εκπαιδευτικό Υλικό' },
];

// Define Solana resources that can be accessed through the Help section
export const SOLANA_RESOURCES: ResourceLink[] = [
  {
    url: 'https://phantom.app/',
    title: 'Phantom Wallet',
    description: 'Το επίσημο Solana wallet. Απαραίτητο για την χρήση της πλατφόρμας μας.',
    category: 'wallet'
  },
  {
    url: 'https://solflare.com/',
    title: 'Solflare',
    description: 'Εναλλακτικό wallet για Solana με προχωρημένα χαρακτηριστικά.',
    category: 'wallet'
  },
  {
    url: 'https://jup.ag/',
    title: 'Jupiter Aggregator',
    description: 'Το καλύτερο DEX aggregator για Solana με βέλτιστες τιμές συναλλαγών.',
    category: 'dex'
  },
  {
    url: 'https://raydium.io/',
    title: 'Raydium',
    description: 'Automated Market Maker (AMM) και Liquidity Provider στο Solana.',
    category: 'dex'
  },
  {
    url: 'https://trade.dexlab.space/',
    title: 'Dexlab',
    description: 'Πλατφόρμα για εμπόριο και δημιουργία token στο Solana.',
    category: 'tools'
  },
  {
    url: 'https://solscan.io/',
    title: 'Solscan',
    description: 'Block explorer για το Solana blockchain.',
    category: 'tools'
  },
  {
    url: 'https://magiceden.io/',
    title: 'Magic Eden',
    description: 'Κορυφαία πλατφόρμα για NFTs στο Solana.',
    category: 'nft'
  },
  {
    url: 'https://solanau.org/',
    title: 'Solana University',
    description: 'Εκπαιδευτικό υλικό για developers στο Solana.',
    category: 'learn'
  },
  {
    url: 'https://docs.solana.com/',
    title: 'Solana Documentation',
    description: 'Επίσημη τεκμηρίωση του Solana blockchain.',
    category: 'learn'
  },
  {
    url: 'https://www.helius.dev/',
    title: 'Helius API',
    description: 'Υψηλής απόδοσης API για Solana developers.',
    category: 'tools'
  },
  {
    url: 'https://www.tensor.trade/',
    title: 'Tensor',
    description: 'Ανταλλακτήριο NFT με προηγμένα χαρακτηριστικά.',
    category: 'nft'
  },
  {
    url: 'https://birdeye.so/',
    title: 'Birdeye',
    description: 'Αναλυτική πλατφόρμα για παρακολούθηση τιμών και στατιστικών.',
    category: 'tools'
  },
];
