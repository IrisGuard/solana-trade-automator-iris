
import React from "react";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function EmptyBotState() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center">
      <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-medium">No Active Bots</h3>
      <p className="text-sm text-muted-foreground">
        You don't have any active bots right now. Start a bot to begin trading.
      </p>
    </Card>
  );
}
