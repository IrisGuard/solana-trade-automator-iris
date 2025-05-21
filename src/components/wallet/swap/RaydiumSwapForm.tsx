
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SwapInputPanel } from "./SwapInputPanel";
import { SwapQuote } from "./SwapQuote";
import { ArrowDown, Settings } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { SwapState } from "./types";

export function RaydiumSwapForm() {
  const { tokens, isConnected, connectWallet } = useWalletConnection();
  
  // Initial state for the swap
  const initialSwapState: SwapState = {
    inputMint: "",
    outputMint: "",
    inputAmount: "",
    outputAmount: "",
    isLoading: false,
    swapStatus: 'idle',
    quoteResponse: null,
    priceImpact: "0.00%"
  };
  
  const [swapState, setSwapState] = useState<SwapState>(initialSwapState);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  
  // Function to get token info by mint address
  const getTokenInfo = (mintAddress: string) => {
    const token = tokens.find(t => t.mint === mintAddress);
    return {
      symbol: token?.symbol || "Unknown",
      name: token?.name || "Token",
      mint: mintAddress,
      decimals: token?.decimals || 9
    };
  };
  
  // Handle input amount change
  const handleInputAmountChange = (amount: string) => {
    setSwapState(prev => ({ ...prev, inputAmount: amount }));
    if (amount && parseFloat(amount) > 0 && swapState.inputMint && swapState.outputMint) {
      getQuote(amount);
    } else {
      setSwapState(prev => ({ ...prev, outputAmount: "" }));
    }
  };
  
  // Handle input token change
  const handleInputTokenChange = (mint: string) => {
    setSwapState(prev => ({ 
      ...prev, 
      inputMint: mint,
      // Reset output if same as new input
      outputMint: prev.outputMint === mint ? "" : prev.outputMint
    }));
    
    if (swapState.inputAmount && parseFloat(swapState.inputAmount) > 0 && mint && swapState.outputMint) {
      getQuote(swapState.inputAmount);
    }
  };
  
  // Handle output token change
  const handleOutputTokenChange = (mint: string) => {
    setSwapState(prev => ({ 
      ...prev, 
      outputMint: mint,
      // Reset input if same as new output
      inputMint: prev.inputMint === mint ? "" : prev.inputMint
    }));
    
    if (swapState.inputAmount && parseFloat(swapState.inputAmount) > 0 && swapState.inputMint && mint) {
      getQuote(swapState.inputAmount);
    }
  };
  
  // Get quote from Raydium API (mocked)
  const getQuote = async (amount: string) => {
    if (!swapState.inputMint || !swapState.outputMint || !amount || parseFloat(amount) <= 0) {
      return;
    }
    
    setSwapState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockOutputAmount = parseFloat(amount) * (0.5 + Math.random());
      const mockPriceImpact = (Math.random() * 2).toFixed(2) + "%";
      
      setSwapState(prev => ({
        ...prev,
        outputAmount: mockOutputAmount.toFixed(6),
        priceImpact: mockPriceImpact,
        isLoading: false,
        quoteResponse: {
          inputAmount: parseFloat(amount),
          outputAmount: mockOutputAmount,
          priceImpact: mockPriceImpact
        }
      }));
    } catch (error) {
      console.error("Failed to get quote:", error);
      setSwapState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Execute the swap
  const executeSwap = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    
    if (!swapState.inputMint || !swapState.outputMint || !swapState.inputAmount) {
      return;
    }
    
    setSwapState(prev => ({ ...prev, isLoading: true, swapStatus: 'loading' }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success
      setSwapState(prev => ({ ...prev, isLoading: false, swapStatus: 'success' }));
      
      // Reset form after a delay
      setTimeout(() => {
        setSwapState({
          ...initialSwapState,
          inputMint: swapState.inputMint,
          outputMint: swapState.outputMint
        });
      }, 2000);
    } catch (error) {
      console.error("Swap failed:", error);
      setSwapState(prev => ({ ...prev, isLoading: false, swapStatus: 'error' }));
    }
  };
  
  // Input token info
  const inputTokenInfo = getTokenInfo(swapState.inputMint);
  
  // Output token info
  const outputTokenInfo = getTokenInfo(swapState.outputMint);
  
  // Find selected input token for balance
  const selectedInputToken = tokens.find(t => t.mint === swapState.inputMint);
  
  // Button text based on connection and swap state
  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (!swapState.inputMint) return "Select Input Token";
    if (!swapState.outputMint) return "Select Output Token";
    if (!swapState.inputAmount) return "Enter Amount";
    if (swapState.isLoading) return "Processing...";
    return "Swap";
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Raydium Swap</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {showSettings && (
            <div className="p-3 border rounded-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slippage Tolerance (%)</label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0.1"
                  max="5"
                />
              </div>
            </div>
          )}
          
          <SwapInputPanel
            label="From"
            tokens={tokens}
            tokenMint={swapState.inputMint}
            amount={swapState.inputAmount}
            onTokenChange={handleInputTokenChange}
            onAmountChange={handleInputAmountChange}
            disabled={swapState.isLoading}
            balance={selectedInputToken?.amount || 0}
            tokenInfo={inputTokenInfo}
          />
          
          <div className="flex justify-center">
            <div className="bg-muted p-2 rounded-full">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>
          
          <SwapInputPanel
            label="To (Estimated)"
            tokens={tokens}
            tokenMint={swapState.outputMint}
            amount={swapState.outputAmount}
            onTokenChange={handleOutputTokenChange}
            disabled={swapState.isLoading}
            readOnly={true}
            excludeToken={swapState.inputMint}
            balance={0}
            tokenInfo={outputTokenInfo}
          />
          
          {swapState.inputMint && swapState.outputMint && swapState.inputAmount && swapState.outputAmount && (
            <SwapQuote
              inputToken={inputTokenInfo}
              outputToken={outputTokenInfo}
              inputAmount={parseFloat(swapState.inputAmount)}
              outputAmount={parseFloat(swapState.outputAmount)}
              priceImpact={swapState.priceImpact}
            />
          )}
          
          <Button 
            className="w-full" 
            onClick={executeSwap}
            disabled={!swapState.inputMint || !swapState.outputMint || !swapState.inputAmount || swapState.isLoading}
          >
            {getButtonText()}
          </Button>
          
          {swapState.swapStatus === 'success' && (
            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-green-700 text-center">
              Swap completed successfully!
            </div>
          )}
          
          {swapState.swapStatus === 'error' && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-700 text-center">
              Swap failed. Please try again.
            </div>
          )}
          
          <div className="text-xs text-center text-muted-foreground">
            Powered by Raydium
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
