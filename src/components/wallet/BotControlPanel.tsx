
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface BotControlPanelProps {
  isRunning: boolean;
  startBot: () => void;
  stopBot: () => void;
  resetBot: () => void;
  isLoading?: boolean;
}

export function BotControlPanel({
  isRunning,
  startBot,
  stopBot,
  resetBot,
  isLoading = false
}: BotControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center mt-1">
                <div 
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isRunning ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
                <p className="font-medium">
                  {isRunning ? 'Running' : 'Stopped'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isRunning ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopBot}
                  disabled={isLoading}
                >
                  <Pause className="mr-1 h-4 w-4" /> Stop
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={startBot}
                  disabled={isLoading}
                >
                  <Play className="mr-1 h-4 w-4" /> Start
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetBot}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
