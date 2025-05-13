
import { ResourceLink, ResourceCategory } from "./types";

// Κατηγορίες πόρων για το Solana
export const resourceCategories: ResourceCategory[] = [
  { id: "getting-started", name: "Ξεκινώντας" },
  { id: "documentation", name: "Τεκμηρίωση" },
  { id: "developers", name: "Προγραμματιστές" },
  { id: "tools", name: "Εργαλεία" },
  { id: "defi", name: "DeFi" },
  { id: "nft", name: "NFT" }
];

// Πόροι για το Solana
export const helpResources: ResourceLink[] = [
  {
    url: "https://solana.com/docs/intro",
    title: "Εισαγωγή στο Solana",
    description: "Μάθετε τα βασικά για το Solana blockchain και την αρχιτεκτονική του.",
    category: "Ξεκινώντας"
  },
  {
    url: "https://soldev.app/",
    title: "Solana Developer Portal",
    description: "Ένας πλήρης οδηγός για developers που θέλουν να αναπτύξουν στο Solana.",
    category: "Προγραμματιστές"
  },
  {
    url: "https://www.helius.dev/",
    title: "Helius API Documentation",
    description: "Τεκμηρίωση για τις Helius APIs που χρησιμοποιούνται στην εφαρμογή.",
    category: "Τεκμηρίωση"
  },
  {
    url: "https://phantom.app/",
    title: "Phantom Wallet",
    description: "Το πιο δημοφιλές πορτοφόλι για το Solana blockchain.",
    category: "Εργαλεία"
  },
  {
    url: "https://jup.ag/",
    title: "Jupiter Aggregator",
    description: "Ο καλύτερος aggregator για swaps στο Solana.",
    category: "DeFi"
  },
  {
    url: "https://solscan.io/",
    title: "Solscan Explorer",
    description: "Εξερευνήστε συναλλαγές και λογαριασμούς στο Solana blockchain.",
    category: "Εργαλεία"
  },
  {
    url: "https://raydium.io/",
    title: "Raydium",
    description: "Αυτοματοποιημένο market maker και DeFi πλατφόρμα στο Solana.",
    category: "DeFi"
  },
  {
    url: "https://magiceden.io/",
    title: "Magic Eden",
    description: "Η μεγαλύτερη αγορά NFT στο Solana.",
    category: "NFT"
  },
  {
    url: "https://solanafm.com/",
    title: "Solana FM",
    description: "Explorer και αναλυτικά εργαλεία για το Solana blockchain.",
    category: "Εργαλεία"
  },
  {
    url: "https://github.com/solana-labs/solana-program-library",
    title: "Solana Program Library",
    description: "Συλλογή από on-chain programs για το Solana.",
    category: "Προγραμματιστές"
  }
];
