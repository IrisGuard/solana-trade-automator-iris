
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { BotCard } from "@/components/bot/BotCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";
import { useBotControl } from "@/hooks/useBotControl";
import { BotRow } from "@/services/bot/types";

// Mock template data - typically this would come from an API
const mockTemplates = [
  {
    title: "DCA Trading Bot",
    description: "Dollar-cost averaging strategy for automated trading",
    features: ["Scheduled purchases", "Risk management", "Performance analytics"]
  },
  {
    title: "Momentum Trading",
    description: "Advanced trading based on market momentum indicators",
    features: ["Technical indicators", "Customizable thresholds", "Automatic execution"]
  }
];

export default function Bots() {
  const { bots, loading } = useBotControl();
  
  // We'll use the bot data from useBotControl
  const hasBots = bots.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Bots</CardTitle>
        </CardHeader>
        <CardContent>
          {hasBots ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot, index) => (
                <BotCard 
                  key={`bot-${bot.id}`}
                  botName={bot.name}
                  isActive={bot.active}
                  tokens={bot.config?.quoteToken ? [bot.config.quoteToken] : ["Unknown"]}
                  profit={bot.config?.profit || "0%"}
                  timeRunning={bot.config?.timeRunning || "0h"}
                  index={index}
                  id={bot.id}
                />
              ))}
              <CreateBotCard />
              {mockTemplates.map((template, index) => (
                <BotTemplateCard 
                  key={`template-${index}`}
                  title={template.title}
                  description={template.description}
                  features={template.features}
                />
              ))}
            </div>
          ) : (
            <EmptyBotState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
