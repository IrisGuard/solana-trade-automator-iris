
import { useState } from "react";

export interface Bot {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
}

export function useBotControl() {
  const [bots, setBots] = useState<Bot[]>([
    { 
      botName: "SOL/USDC Bot",
      isActive: true,
      tokens: ["SOL", "USDC"],
      profit: "+3.8%",
      timeRunning: "12h 34m",
    },
    { 
      botName: "BTC/USDC Bot",
      isActive: false,
      tokens: ["BTC", "USDC"],
      profit: "-0.5%",
      timeRunning: "0h 0m",
    },
    { 
      botName: "ETH/USDC Bot",
      isActive: true,
      tokens: ["ETH", "USDC"],
      profit: "+2.1%",
      timeRunning: "5h 17m",
    },
  ]);

  const [activeTab, setActiveTab] = useState("active");

  const templates = [
    {
      title: "DCA Momentum Bot",
      description: "Dollar-cost averaging with momentum indicators",
      features: [
        "Auto-adjusting position sizes",
        "Momentum indicators",
        "Dollar-cost averaging"
      ]
    },
    {
      title: "Arbitrage Bot",
      description: "Profit from price differences across exchanges",
      features: [
        "Multi-exchange support",
        "Real-time price comparison",
        "Auto-execution"
      ]
    },
    {
      title: "Grid Trading Bot",
      description: "Place buy/sell orders at regular price intervals",
      features: [
        "Customizable price grid",
        "Profit from price volatility",
        "Auto grid rebalancing"
      ]
    }
  ];

  const startAllBots = () => {
    setBots(bots.map(bot => ({ ...bot, isActive: true })));
  };

  const stopAllBots = () => {
    setBots(bots.map(bot => ({ ...bot, isActive: false })));
  };

  return {
    bots,
    activeTab,
    setActiveTab,
    templates,
    startAllBots,
    stopAllBots
  };
}
