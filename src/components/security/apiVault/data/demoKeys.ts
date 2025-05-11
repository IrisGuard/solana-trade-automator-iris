
import { ApiKey } from "../types";

// Προεπιλεγμένα κλειδιά επίδειξης
export const demoKeys: ApiKey[] = [
  {
    id: "demo-1",
    name: "Binance API Key",
    key: "9HzJAsB7CsPvE2XTyCN9oQMPTMgn32mLvxF6sRt8",
    service: "binance",
    createdAt: "2024-02-15T10:30:00Z",
    description: "Χρήση για συναλλαγές στο Binance",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-2",
    name: "Solana Explorer",
    key: "s0LxpL0rEr4P1k3Y9nDtH3f4DA8m5sXz3G7vT8pH",
    service: "solana",
    createdAt: "2024-01-20T14:25:00Z",
    description: "Παρακολούθηση συναλλαγών Solana",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-3",
    name: "RPC Node Access",
    key: "rP3n0D3aCc3sS7kQ9mT5hY8jL2pV6cX1zN8bF5sG",
    service: "rpc",
    createdAt: "2023-11-10T09:15:00Z",
    description: "Σύνδεση με κόμβο RPC",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-4",
    name: "Exchange API (Παλιό)",
    key: "eXch4nG3K3y8B6vN3mL5hS9pQ7tR2zF1wP8kY3jC",
    service: "exchange",
    createdAt: "2023-08-05T16:45:00Z",
    description: "API πρόσβαση σε ανταλλαγή κρυπτονομισμάτων",
    status: "expired",
    expires: "2024-02-05T16:45:00Z",
    isWorking: false
  },
  {
    id: "demo-5",
    name: "Jupiter Aggregator",
    key: "jUp1T3r4gGr3g4T0rK3y5B7vC9mX1zL3pQ6sT8nM",
    service: "jupiter",
    createdAt: "2024-03-01T11:20:00Z",
    description: "Πρόσβαση στο Jupiter DEX Aggregator API",
    status: "active",
    isWorking: true
  },
  {
    id: "demo-6",
    name: "Alchemy API (Ανακλημένο)",
    key: "4LcH3mY4P1k5Y7bV9cX1zL3pQ6sT8nM2hJ4kR7tP",
    service: "alchemy",
    createdAt: "2023-09-12T08:30:00Z",
    description: "Πρόσβαση στο Alchemy blockchain API",
    status: "revoked",
    isWorking: false
  },
  {
    id: "demo-7",
    name: "Web3 Development API",
    key: "w3B3d3V4P1k3Y9nD5hY8jL2pV6cX1zN8bF5sG7tR",
    service: "web3",
    createdAt: "2024-04-10T13:40:00Z",
    description: "API για Web3 εφαρμογές",
    status: "active",
    isWorking: true
  }
];
