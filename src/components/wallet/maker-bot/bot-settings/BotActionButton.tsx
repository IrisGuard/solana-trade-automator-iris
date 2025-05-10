
import React from "react";
import { Button } from "@/components/ui/button";

interface BotActionButtonProps {
  botActive: boolean;
  handleStartBot: () => void;
  handleStopBot: () => void;
}

export function BotActionButton({ botActive, handleStartBot, handleStopBot }: BotActionButtonProps) {
  return (
    botActive ? (
      <Button 
        variant="destructive" 
        className="w-full" 
        onClick={handleStopBot}
      >
        Stop Bot
      </Button>
    ) : (
      <Button 
        className="w-full" 
        onClick={handleStartBot}
      >
        Start Bot
      </Button>
    )
  );
}
