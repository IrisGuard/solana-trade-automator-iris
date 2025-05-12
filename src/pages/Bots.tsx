
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { BotCard } from "@/components/bot/BotCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";
import { useBotControl } from "@/hooks/useBotControl";

export default function Bots() {
  const { bots, templates } = useBotControl();
  
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
                  key={`bot-${index}`}
                  botName={bot.botName}
                  isActive={bot.isActive}
                  tokens={bot.tokens}
                  profit={bot.profit}
                  timeRunning={bot.timeRunning}
                  index={index}
                />
              ))}
              <CreateBotCard />
              {templates.map((template, index) => (
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
