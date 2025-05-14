
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function BotFeatureGuide() {
  const features = [
    {
      title: "Trading Bot",
      description: "Automated trading based on your custom strategy",
      capabilities: [
        "Configure trading parameters",
        "Select tokens for trading",
        "Set buy/sell thresholds",
        "Stop-loss and take-profit settings",
        "Advanced technical indicators"
      ]
    },
    {
      title: "Maker Bot",
      description: "Generate liquidity and volume on DEXs",
      capabilities: [
        "Simulate trading activity",
        "Configure multiple makers",
        "Set random delay between trades",
        "Control price impact",
        "Multi-DEX support"
      ]
    },
    {
      title: "Bot Control Center",
      description: "Manage all your bots in one place",
      capabilities: [
        "Template-based bot creation",
        "Performance monitoring",
        "Start/stop individual or all bots",
        "Historical data and analytics",
        "Customize trading strategies"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bot Functionality Guide</h2>
      <p className="text-muted-foreground">
        Our platform offers three different types of bots to help you automate your trading strategies
        and maximize your profits on the Solana blockchain.
      </p>
      
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.capabilities.map((capability, capIndex) => (
                  <li key={capIndex} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
