
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeyVisibilityToggleProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const KeyVisibilityToggle: React.FC<KeyVisibilityToggleProps> = ({ 
  isVisible, 
  onToggleVisibility 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleVisibility}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isVisible ? "Απόκρυψη κλειδιού" : "Εμφάνιση κλειδιού"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
