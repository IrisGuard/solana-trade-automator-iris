
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface SwapActionsProps {
  isLoading: boolean;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  hasQuote: boolean;
  onGetQuote: () => void;
  onSwap: () => void;
}

export function SwapActions({ isLoading, swapStatus, hasQuote, onGetQuote, onSwap }: SwapActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onGetQuote}
        disabled={isLoading || swapStatus === 'loading'}
        variant="outline"
        className="flex-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Get Quote
          </>
        )}
      </Button>
      
      <Button
        onClick={onSwap}
        disabled={!hasQuote || swapStatus === 'loading'}
        className="flex-1"
      >
        {swapStatus === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : 'Swap'}
      </Button>
    </div>
  );
}
