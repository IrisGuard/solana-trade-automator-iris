
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

interface TokensFooterProps {
  selectedToken: string | null;
  isLoading: boolean;
  onTradingClick: (tokenAddress: string) => void;
}

export function TokensFooter({ selectedToken, isLoading, onTradingClick }: TokensFooterProps) {
  if (!selectedToken) return null;
  
  return (
    <Button 
      className="w-full"
      disabled={isLoading}
      onClick={() => onTradingClick(selectedToken)}
    >
      {isLoading ? (
        <>
          <Loader className="h-4 w-4 mr-2 animate-spin" /> 
          Επεξεργασία...
        </>
      ) : (
        <>
          Δημιουργία Trading Bot για το επιλεγμένο token
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
