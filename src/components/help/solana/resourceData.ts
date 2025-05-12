
import { ResourceCategory, ResourceLink } from "./types";

// Κατηγορίες πόρων
export const categories: ResourceCategory[] = [
  { id: "all", name: "Όλα" },
  { id: "clusters", name: "Clusters & Endpoints" },
  { id: "tokens", name: "SPL Tokens" },
  { id: "accounts", name: "Λογαριασμοί & Addresses" },
  { id: "programs", name: "Programs" },
  { id: "api", name: "APIs & Services" },
  { id: "development", name: "Development" },
];

// Πόροι και σύνδεσμοι Solana
export const resources: ResourceLink[] = [
  {
    url: "https://solana.com/el/docs/references/clusters",
    title: "Solana Clusters",
    description: "Επίσημη τεκμηρίωση για τα διάφορα clusters του Solana (mainnet-beta, testnet, devnet)",
    category: "clusters"
  },
  {
    url: "https://www.comparenodes.com/library/public-endpoints/solana/",
    title: "Λίστα Public Endpoints",
    description: "Λίστα με διαθέσιμα public RPC endpoints για το Solana blockchain",
    category: "clusters"
  },
  {
    url: "https://solana.stackexchange.com/questions/6684/alchemy-endpoint-gives-wrong-wallet-balance",
    title: "Troubleshooting RPC Endpoints",
    description: "Αντιμετώπιση προβλημάτων με διάφορα RPC endpoints και λανθασμένα υπόλοιπα",
    category: "clusters"
  },
  {
    url: "https://spl.solana.com/token",
    title: "SPL Token Documentation",
    description: "Επίσημη τεκμηρίωση για το Solana Program Library (SPL) Token πρωτόκολλο",
    category: "tokens"
  },
  {
    url: "https://solana.com/el/docs/tokens",
    title: "Solana Tokens Guide",
    description: "Οδηγός για τα tokens στο Solana blockchain και πώς να δημιουργήσετε τα δικά σας",
    category: "tokens"
  },
  {
    url: "https://docs.rs/spl-associated-token-account/latest/spl_associated_token_account/",
    title: "Associated Token Account",
    description: "Τεκμηρίωση για το Associated Token Account Program του Solana",
    category: "accounts"
  },
  {
    url: "https://solana.stackexchange.com/questions/2107/what-is-the-difference-between-token-program-id-and-associated-token-account-pro",
    title: "Token Programs vs. Associated Token Accounts",
    description: "Διαφορές μεταξύ Token Program και Associated Token Account Program",
    category: "programs"
  },
  {
    url: "https://michaelhly.com/solana-py/spl/memo/instructions/",
    title: "SPL Memo Instructions",
    description: "Πληροφορίες για το SPL Memo Program και τις εντολές του",
    category: "programs"
  },
  {
    url: "https://github.com/solana-foundation/explorer/blob/master/app/utils/programs.ts",
    title: "Λίστα Γνωστών Programs",
    description: "Πηγαίος κώδικας από το Solana Explorer με τη λίστα γνωστών programs",
    category: "programs"
  },
  {
    url: "https://www.rareskills.io/post/solana-sysvar",
    title: "Solana Sysvar",
    description: "Επεξήγηση των Solana System Variables (Sysvar)",
    category: "development"
  },
  {
    url: "https://www.helius.dev/docs/api-reference/endpoints",
    title: "Helius API Reference",
    description: "Τεκμηρίωση για τα endpoints του Helius API για Solana",
    category: "api"
  },
  {
    url: "https://www.quicknode.com/docs/quicknode-sdk/Solana/Overview",
    title: "QuickNode SDK for Solana",
    description: "Τεκμηρίωση για το QuickNode SDK για το Solana blockchain",
    category: "api"
  },
  {
    url: "https://docs.moralis.com/web3-data-api/solana",
    title: "Moralis Solana API",
    description: "Τεκμηρίωση για το Moralis Web3 Data API για το Solana blockchain",
    category: "api"
  }
];
