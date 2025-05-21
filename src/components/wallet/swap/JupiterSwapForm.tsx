
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowDown } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenList } from "./hooks/useTokenList";
import { useJupiterSwap } from "./hooks/useJupiterSwap";
import { SwapInputPanel } from "./SwapInputPanel";
import { SwapQuote } from "./SwapQuote";
import { SwapActions } from "./SwapActions";

export function JupiterSwapForm() {
  const { walletAddress, isConnected, connectWallet, tokens } = useWalletConnection();
  const availableTokens = useTokenList(tokens);
  
  // Default slippage of 0.5%
  const defaultSlippage = 0.5;
  
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
  } = useJupiterSwap(
    tokens?.find(t => t.address === swapState?.inputMint) || null,
    tokens?.find(t => t.address === swapState?.outputMint) || null,
    parseFloat(swapState?.inputAmount || "0"),
    defaultSlippage
  );

  const inputTokenBalance = tokens?.find(t => t.address === swapState?.inputMint)?.amount || 0;
  const outputTokenBalance = tokens?.find(t => t.address === swapState?.outputMint)?.amount || 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Jupiter Swap</CardTitle>
        <CardDescription>Swap tokens at the best rates in Solana</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="text-center py-4">
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        ) : (
          <>
            <SwapInputPanel
              label="From"
              tokens={availableTokens}
              tokenMint={swapState?.inputMint || ""}
              amount={swapState?.inputAmount || ""}
              onTokenChange={updateInputMint}
              onAmountChange={updateInputAmount}
              disabled={swapState?.isLoading || swapState?.swapStatus === 'loading'}
              balance={inputTokenBalance}
              tokenInfo={inputToken || { symbol: "", name: "", mint: "" }}
            />

            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={swapTokens}
                disabled={swapState?.isLoading || swapState?.swapStatus === 'loading'}
              >
                <ArrowDown />
              </Button>
            </div>

            <SwapInputPanel
              label="To"
              tokens={availableTokens}
              tokenMint={swapState?.outputMint || ""}
              amount={swapState?.outputAmount || ""}
              onTokenChange={updateOutputMint}
              disabled={swapState?.isLoading || swapState?.swapStatus === 'loading'}
              readOnly={true}
              excludeToken={swapState?.inputMint}
              balance={outputTokenBalance}
              tokenInfo={outputToken || { symbol: "", name: "", mint: "" }}
            />

            {swapState?.quoteResponse && (
              <SwapQuote
                inputToken={inputToken || { symbol: "", name: "", mint: "" }}
                outputToken={outputToken || { symbol: "", name: "", mint: "" }}
                outputAmount={parseFloat(swapState?.outputAmount || "0")}
                inputAmount={parseFloat(swapState?.inputAmount || "0")}
                priceImpact={swapState?.priceImpact || "0%"}
              />
            )}

            {swapState?.swapStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Swap failed. Please try again or check your wallet.
                </AlertDescription>
              </Alert>
            )}

            <SwapActions
              isLoading={swapState?.isLoading || false}
              swapStatus={swapState?.swapStatus || 'idle'}
              hasQuote={!!swapState?.quoteResponse}
              onGetQuote={getQuote}
              onSwap={executeSwap}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
