
import React from "react";

// This file contains the sample transaction data that can be replaced with real API calls later
export interface Transaction {
  id: string;
  type: string;
  token: string;
  amount: string;
  price: string;
  value: string;
  timestamp: string;
  status: string;
  bot: string;
}

export const transactions: Transaction[] = [
  {
    id: "TX123456",
    type: "buy",
    token: "SOL",
    amount: "0.5",
    price: "$82.45",
    value: "$41.23",
    timestamp: "2023-05-09T09:24:15Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123457",
    type: "sell",
    token: "ETH",
    amount: "0.02",
    price: "$2,345.67",
    value: "$46.91",
    timestamp: "2023-05-09T08:15:22Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
  {
    id: "TX123458",
    type: "buy",
    token: "BTC",
    amount: "0.001",
    price: "$42,345.12",
    value: "$42.35",
    timestamp: "2023-05-08T23:45:11Z",
    status: "completed",
    bot: "BTC/USDC Bot",
  },
  {
    id: "TX123459",
    type: "sell",
    token: "SOL",
    amount: "1.2",
    price: "$80.15",
    value: "$96.18",
    timestamp: "2023-05-08T17:32:45Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123460",
    type: "buy",
    token: "RAY",
    amount: "25",
    price: "$1.25",
    value: "$31.25",
    timestamp: "2023-05-08T12:10:05Z",
    status: "completed",
    bot: "Manual",
  },
  {
    id: "TX123461",
    type: "sell",
    token: "BTC",
    amount: "0.002",
    price: "$42,100.50",
    value: "$84.20",
    timestamp: "2023-05-07T22:05:33Z",
    status: "completed",
    bot: "BTC/USDC Bot",
  },
  {
    id: "TX123462",
    type: "buy",
    token: "ETH",
    amount: "0.05",
    price: "$2,340.20",
    value: "$117.01",
    timestamp: "2023-05-07T16:28:19Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
  {
    id: "TX123463",
    type: "buy",
    token: "SOL",
    amount: "2.0",
    price: "$78.50",
    value: "$157.00",
    timestamp: "2023-05-07T09:14:02Z",
    status: "completed",
    bot: "SOL/USDC Bot",
  },
  {
    id: "TX123464",
    type: "sell",
    token: "RAY",
    amount: "15",
    price: "$1.30",
    value: "$19.50",
    timestamp: "2023-05-06T20:45:37Z",
    status: "completed",
    bot: "Manual",
  },
  {
    id: "TX123465",
    type: "buy",
    token: "ETH",
    amount: "0.08",
    price: "$2,320.75",
    value: "$185.66",
    timestamp: "2023-05-06T14:32:11Z",
    status: "completed",
    bot: "ETH/USDC Bot",
  },
];

// Helper function to get unique tokens from transactions
export function getUniqueTokens(transactions: Transaction[]): string[] {
  return Array.from(new Set(transactions.map(tx => tx.token)));
}

// Format date helper function
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}
