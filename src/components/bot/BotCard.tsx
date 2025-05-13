
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BotCardHeader } from "./components/BotCardHeader";
import { BotCardMetrics } from "./components/BotCardMetrics";
import { BotCardSettings } from "./components/BotCardSettings";
import { BotCardFooter } from "./components/BotCardFooter";

export interface BotCardProps {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
  index: number;
  onToggle?: (index: number) => void;
}

export function BotCard({ 
  botName, 
  isActive, 
  tokens, 
  profit, 
  timeRunning, 
  index,
  onToggle
}: BotCardProps) {
  const [active, setActive] = useState(isActive);
  const [expanded, setExpanded] = useState(false);

  const toggleBot = () => {
    if (onToggle) {
      onToggle(index);
    } else {
      setActive(!active);
    }
  };

  return (
    <Card className="overflow-hidden">
      <BotCardHeader 
        botName={botName} 
        tokens={tokens} 
        isActive={onToggle ? isActive : active} 
        onToggle={toggleBot} 
      />
      
      <CardContent className="pb-2">
        <BotCardMetrics profit={profit} timeRunning={timeRunning} />

        {expanded && <BotCardSettings index={index} />}
      </CardContent>
      
      <BotCardFooter 
        expanded={expanded} 
        onToggleExpand={() => setExpanded(!expanded)} 
      />
    </Card>
  );
}
