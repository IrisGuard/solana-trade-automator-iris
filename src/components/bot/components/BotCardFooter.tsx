
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BotCardFooterProps {
  expanded: boolean;
  onToggleExpand: () => void;
}

export function BotCardFooter({ expanded, onToggleExpand }: BotCardFooterProps) {
  return (
    <CardFooter>
      <Button 
        variant="ghost"
        size="sm"
        className="ml-auto flex items-center gap-1"
        onClick={onToggleExpand}
      >
        {expanded ? (
          <>
            Less <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            More <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>
    </CardFooter>
  );
}
