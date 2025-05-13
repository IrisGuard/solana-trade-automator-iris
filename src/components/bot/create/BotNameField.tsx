
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BotNameFieldProps {
  botName: string;
  setBotName: (value: string) => void;
}

export function BotNameField({ botName, setBotName }: BotNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="bot-name">Bot Name</Label>
      <Input 
        id="bot-name" 
        placeholder="My Trading Bot" 
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
      />
    </div>
  );
}
