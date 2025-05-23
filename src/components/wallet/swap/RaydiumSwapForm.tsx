
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowDown, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { SwapInputPanel } from "./SwapInputPanel";
import { SwapQuote } from "./SwapQuote";
import { SwapActions } from "./SwapActions";
import { useTokenList } from "./hooks/useTokenList";
import { useRaydiumSwap } from "./hooks/useRaydiumSwap";
import { SwapFormProps } from "./types";

export function RaydiumSwapForm({ isConnected = false, connectWallet }: SwapFormProps) {
  const { walletAddress, tokens } = useWalletConnection();
  const availableTokens = useTokenList(tokens);
  
  const {
    swapState,
    inputToken,
    outputToken,
    getQuote,
    executeSwap,
    swapTokens,
    updateInputMint,
    updateOutputMint,
    updateInputAmount
  } = useRaydiumSwap({ 
    walletAddress, 
    isConnected, 
    availableTokens 
  });

  const inputTokenBalance = tokens?.find(t => t.address === swapState.inputMint)?.amount || 0;
  const outputTokenBalance = tokens?.find(t => t.address === swapState.outputMint)?.amount || 0;

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Raydium Swap</CardTitle>
          <CardDescription>Simulated swap experience with Raydium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Raydium Swap</CardTitle>
        <CardDescription>Simulated swap experience with Raydium</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SwapInputPanel 
          label="From"
          tokens={availableTokens}
          tokenMint={swapState.inputMint}
          amount={swapState.inputAmount}
          onTokenChange={updateInputMint}
          onAmountChange={updateInputAmount}
          disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
          excludeToken={swapState.outputMint}
          balance={inputTokenBalance}
          tokenInfo={inputToken}
        />

        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={swapTokens}
            disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
          >
            <ArrowDown />
          </Button>
        </div>

        <SwapInputPanel 
          label="To"
          tokens={availableTokens}
          tokenMint={swapState.outputMint}
          amount={swapState.outputAmount}
          onTokenChange={updateOutputMint}
          disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
          readOnly={true}
          excludeToken={swapState.inputMint}
          balance={outputTokenBalance}
          tokenInfo={outputToken}
        />

        {swapState.quoteResponse && (
          <SwapQuote 
            inputToken={inputToken}
            outputToken={outputToken}
            outputAmount={swapState.outputAmount}
            inputAmount={swapState.inputAmount}
            priceImpact={swapState.priceImpact}
          />
        )}

        {swapState.swapStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Swap failed. Please try again or check your wallet.
            </AlertDescription>
          </Alert>
        )}

        <SwapActions 
          isLoading={swapState.isLoading}
          swapStatus={swapState.swapStatus}
          hasQuote={!!swapState.quoteResponse}
          onGetQuote={getQuote}
          onSwap={executeSwap}
        />
      </CardContent>
    </Card>
  );
}
