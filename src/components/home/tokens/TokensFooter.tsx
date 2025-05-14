
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface TokensFooterProps {
  selectedToken: string;
  isLoading: boolean;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokensFooter({ selectedToken, isLoading, onTradingClick }: TokensFooterProps) {
  const { t } = useLanguage();
  
  return (
    <div className="w-full flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Επιλεγμένο token για συναλλαγές
      </p>
      <Button 
        onClick={() => onTradingClick(selectedToken)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Φόρτωση...
          </>
        ) : (
          <>
            Δημιουργία Bot 
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
