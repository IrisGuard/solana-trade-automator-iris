
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TabHeaderProps {
  botStatus: string;
}

export function TabHeader({ botStatus }: TabHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-5 w-5 text-primary" />
      <span>Trading Bot</span>
      {botStatus === 'running' && (
        <div className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded border border-green-200">
          Ενεργό
        </div>
      )}
    </div>
  );
}
