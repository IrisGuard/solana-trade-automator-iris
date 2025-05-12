
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { BotCard } from "@/components/bot/BotCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";

export default function Bots() {
  // We'll use a simple flag here. In a real app, you would fetch data from a backend
  const hasBots = false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Bots</CardTitle>
        </CardHeader>
        <CardContent>
          {hasBots ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BotCard />
              <CreateBotCard />
              <BotTemplateCard />
            </div>
          ) : (
            <EmptyBotState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
