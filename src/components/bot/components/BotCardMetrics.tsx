
import React from "react";

interface BotCardMetricsProps {
  profit: string;
  timeRunning: string;
}

export function BotCardMetrics({ profit, timeRunning }: BotCardMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Profit</p>
        <p className={`text-lg font-medium ${profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {profit}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Running for</p>
        <p className="text-lg font-medium">{timeRunning}</p>
      </div>
    </div>
  );
}
