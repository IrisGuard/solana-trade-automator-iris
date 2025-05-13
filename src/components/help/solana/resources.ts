
import { ResourceLink, ResourceCategory } from './types';

export const resourceCategories: ResourceCategory[] = [
  { id: 'basics', name: 'Βασικά' },
  { id: 'wallets', name: 'Πορτοφόλια' },
  { id: 'development', name: 'Ανάπτυξη' },
  { id: 'tokens', name: 'Tokens' },
  { id: 'trading', name: 'Trading' },
  { id: 'security', name: 'Ασφάλεια' },
];

export const helpResources: ResourceLink[] = [
  {
    url: 'https://solana.com/docs/intro',
    title: 'Εισαγωγή στο Solana',
    description: 'Βασική εισαγωγή στο Solana blockchain και τα χαρακτηριστικά του',
    category: 'Βασικά',
  },
  {
    url: 'https://docs.phantom.app/',
    title: 'Phantom Wallet',
    description: 'Οδηγίες χρήσης του Phantom Wallet για το Solana',
    category: 'Πορτοφόλια',
  },
  {
    url: 'https://solana.com/developers',
    title: 'Solana για Προγραμματιστές',
    description: 'Πόροι και εργαλεία για την ανάπτυξη στο Solana',
    category: 'Ανάπτυξη',
  },
  {
    url: 'https://spl.solana.com/token',
    title: 'SPL Tokens',
    description: 'Πληροφορίες για το Solana Program Library Token Standard',
    category: 'Tokens',
  },
  {
    url: 'https://jup.ag/docs',
    title: 'Jupiter Exchange',
    description: 'Aggregator συναλλαγών για το Solana με την καλύτερη τιμή',
    category: 'Trading',
  },
  {
    url: 'https://solana.com/news/solana-security-best-practices',
    title: 'Πρακτικές Ασφάλειας',
    description: 'Βέλτιστες πρακτικές για την ασφάλεια στο Solana',
    category: 'Ασφάλεια',
  },
  {
    url: 'https://www.youtube.com/watch?v=1jzROE6EhxM',
    title: 'Οδηγός Solana για Αρχάριους',
    description: 'Βίντεο εκμάθησης των βασικών του Solana',
    category: 'Βασικά',
  },
  {
    url: 'https://raydium.io/swap/',
    title: 'Raydium DEX',
    description: 'Αποκεντρωμένο ανταλλακτήριο στο Solana',
    category: 'Trading',
  },
  {
    url: 'https://docs.solana.com/wallet-guide',
    title: 'Οδηγός Πορτοφολιών Solana',
    description: 'Επίσημος οδηγός για τα πορτοφόλια στο Solana',
    category: 'Πορτοφόλια',
  },
  {
    url: 'https://solflare.com/',
    title: 'Solflare Wallet',
    description: 'Εναλλακτική λύση πορτοφολιού για το Solana',
    category: 'Πορτοφόλια',
  }
];
