
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-card";

interface BotStatusProps {
  isActive: boolean;
  isLoading?: boolean;
  onToggle: () => void;
}

export function BotStatus({ isActive, isLoading = false, onToggle }: BotStatusProps) {
  return (
    <GradientBorder variant={isActive ? "green" : "pink"}>
      <div className="flex items-center justify-between p-4 rounded-md bg-background">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${isActive ? "bg-emerald-500" : "bg-pink-500"} animate-pulse`}></div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">Κατάσταση Bot</h4>
              <Badge variant={isActive ? "outline" : "secondary"} className={isActive ? "border-emerald-400 text-emerald-500" : ""}>
                {isActive ? "Ενεργό" : "Ανενεργό"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isActive 
                ? "Το bot πραγματοποιεί συναλλαγές αυτόματα" 
                : "Το bot είναι σε αναμονή"}
            </p>
          </div>
        </div>
        
        <Button
          variant={isActive ? "outline" : "default"}
          className={isActive 
            ? "border-pink-400/30 hover:bg-pink-500/10" 
            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          }
          onClick={onToggle}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Power className="h-4 w-4 mr-2" />
          )}
          {isActive ? "Απενεργοποίηση" : "Ενεργοποίηση"}
        </Button>
      </div>
    </GradientBorder>
  );
}
