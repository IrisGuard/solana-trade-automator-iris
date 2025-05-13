
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BotCardHeader } from "./components/BotCardHeader";
import { BotCardMetrics } from "./components/BotCardMetrics";
import { BotCardSettings } from "./components/BotCardSettings";
import { BotCardFooter } from "./components/BotCardFooter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, BarChart2 } from "lucide-react";

export interface BotCardProps {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
  index: number;
  id?: string;
  onToggle?: (index: number) => void;
  onDelete?: () => void;
}

export function BotCard({ 
  botName, 
  isActive, 
  tokens, 
  profit, 
  timeRunning, 
  index,
  id,
  onToggle,
  onDelete
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
    <Card className="overflow-hidden relative">
      {/* More Options Menu */}
      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit Bot
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Bot
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
