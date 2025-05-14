
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface BotStatusPanelProps {
  trades: number;
  profits: string;
  timeRunning: string;
  profitPercentage?: number;
}

export function BotStatusPanel({
  trades,
  profits,
  timeRunning,
  profitPercentage
}: BotStatusPanelProps) {
  const isPositive = !profits.startsWith('-');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Trades</p>
              <p className="font-medium text-lg">{trades}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Profit</p>
              <div className="flex items-center">
                <p className={`font-medium text-lg ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {profits}
                </p>
                {profitPercentage !== undefined && (
                  <span className={`ml-1 flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(profitPercentage).toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Time Running</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="font-medium text-lg">{timeRunning}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
