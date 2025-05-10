
import React from "react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface BotCardHeaderProps {
  botName: string;
  tokens: string[];
  isActive: boolean;
  onToggle: () => void;
}

export function BotCardHeader({ botName, tokens, isActive, onToggle }: BotCardHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{botName}</CardTitle>
        <Switch checked={isActive} onCheckedChange={onToggle} />
      </div>
      <CardDescription>
        Trading {tokens.join("/")}
      </CardDescription>
    </CardHeader>
  );
}
