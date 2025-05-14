
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface BotActionButtonsProps {
  isLoading: boolean;
  botStatus: string;
  hasSelectedToken: boolean;
  startBot: () => void;
  stopBot: () => void;
}

export function BotActionButtons({
  isLoading,
  botStatus,
  hasSelectedToken,
  startBot,
  stopBot
}: BotActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        className="flex-1"
        onClick={startBot}
        disabled={isLoading || botStatus === 'running' || !hasSelectedToken}
      >
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Εκκίνηση Bot
      </Button>
      <Button
        variant="destructive"
        className="flex-1"
        onClick={stopBot}
        disabled={isLoading || botStatus !== 'running'}
      >
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Διακοπή Bot
      </Button>
    </div>
  );
}
