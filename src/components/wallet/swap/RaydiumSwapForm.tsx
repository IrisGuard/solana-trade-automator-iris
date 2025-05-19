
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { apiServices } from "@/services/solana/apiServices";
import { transactionsService } from "@/services/transactionsService";
import { toast } from "sonner";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Token } from "@/types/wallet";

// Common Solana tokens
const COMMON_TOKENS = [
  { mint: "So11111111111111111111111111111111111111112", symbol: "SOL", name: "Solana", decimals: 9 },
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", name: "USD Coin", decimals: 6 },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", symbol: "USDT", name: "Tether", decimals: 6 },
  { mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", symbol: "mSOL", name: "Marinade Staked SOL", decimals: 9 },
  { mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", symbol: "stSOL", name: "Lido Staked SOL", decimals: 9 },
];

interface SwapState {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  isLoading: boolean;
  quoteResponse: any;
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  outputAmount: string;
  priceImpact: string;
}

export function RaydiumSwapForm() {
  const { walletAddress, isConnected, connectWallet, tokens } = useWalletConnection();
  
  const [swapState, setSwapState] = useState<SwapState>({
    inputMint: "So11111111111111111111111111111111111111112", // SOL by default
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC by default
    inputAmount: "0.1",
    isLoading: false,
    quoteResponse: null,
    swapStatus: 'idle',
    outputAmount: "0",
    priceImpact: "0"
  });

  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);

  // Load user tokens and combine with common tokens
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      // Create a set of token addresses to avoid duplicates
      const tokenAddressSet = new Set(tokens.map(token => token.address));
      
      // Add common tokens if they're not already in the user's tokens
      const combinedTokens = [...tokens];
      
      COMMON_TOKENS.forEach(commonToken => {
        if (!tokenAddressSet.has(commonToken.mint)) {
          combinedTokens.push({
            address: commonToken.mint,
            symbol: commonToken.symbol,
            name: commonToken.name,
            decimals: commonToken.decimals,
            amount: 0,
            logo: "",
          });
        }
      });
      
      setAvailableTokens(combinedTokens);
    } else {
      // If no user tokens are available, use common tokens
      const formattedCommonTokens = COMMON_TOKENS.map(token => ({
        address: token.mint,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        amount: 0,
        logo: "",
      }));
      
      setAvailableTokens(formattedCommonTokens);
    }
  }, [tokens]);

  const getQuote = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const { inputMint, outputMint, inputAmount } = swapState;
    if (!inputMint || !outputMint || !inputAmount || parseFloat(inputAmount) <= 0) {
      toast.error("Please provide valid input values");
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true }));

    try {
      // In a real implementation, we'd call the Raydium API here
      // For demonstration, we'll simulate a swap quote
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate Raydium API response
      const simulatedResponse = {
        inAmount: parseFloat(inputAmount) * Math.pow(10, 9), // Convert to lamports for SOL
        outAmount: parseFloat(inputAmount) * 30 * Math.pow(10, 6), // Simulated USDC amount (1 SOL = ~$30)
        fee: {
          amount: parseFloat(inputAmount) * 0.0025 * Math.pow(10, 9),
          mint: inputMint,
          percent: 0.0025
        },
        priceImpact: 0.0015
      };
      
      // Format output amount
      const outputToken = availableTokens.find(token => token.address === outputMint);
      const outputDecimals = outputToken?.decimals || 6; // Default to 6 for USDC/USDT
      const outputAmount = (Number(simulatedResponse.outAmount) / Math.pow(10, outputDecimals)).toFixed(outputDecimals);
      
      // Format price impact
      const priceImpact = (Number(simulatedResponse.priceImpact) * 100).toFixed(2) + '%';
      
      setSwapState(prev => ({
        ...prev,
        quoteResponse: simulatedResponse,
        outputAmount,
        priceImpact,
        isLoading: false
      }));
      
      toast.success("Quote received successfully (simulated)");
    } catch (error: any) {
      console.error("Error fetching Raydium quote:", error);
      toast.error(`Failed to get quote: ${error.message}`);
      setSwapState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const executeSwap = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!swapState.quoteResponse) {
      toast.error("Please get a quote first");
      return;
    }

    setSwapState(prev => ({ ...prev, swapStatus: 'loading' }));

    try {
      // In a real implementation, we would execute the swap through the Raydium API
      // For demonstration, we'll simulate a successful swap
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction signature with a "raydium-" prefix to identify it
      const mockSignature = `raydium-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save transaction to database
      const inputToken = availableTokens.find(token => token.address === swapState.inputMint);
      const outputToken = availableTokens.find(token => token.address === swapState.outputMint);
      
      try {
        // Only try to save if there's a wallet address (user is logged in)
        if (walletAddress) {
          await transactionsService.saveTransaction({
            user_id: null, // Will be filled by backend RLS
            wallet_address: walletAddress,
            signature: mockSignature,
            type: "swap",
            status: "success",
            amount: `${swapState.inputAmount} ${inputToken?.symbol || 'Unknown'}`,
            source: swapState.inputMint,
            destination: swapState.outputMint,
          });
        }
      } catch (saveError) {
        console.error("Failed to save transaction:", saveError);
        // Continue anyway as the swap was successful
      }

      setSwapState(prev => ({ ...prev, swapStatus: 'success' }));
      toast.success(`Swap successful! Signature: ${mockSignature}`);
      
      // Reset form after success
      setTimeout(() => {
        setSwapState(prev => ({
          ...prev,
          swapStatus: 'idle',
          quoteResponse: null,
          outputAmount: "0",
          priceImpact: "0"
        }));
      }, 3000);
      
    } catch (error: any) {
      console.error("Swap failed:", error);
      toast.error(`Swap failed: ${error.message}`);
      setSwapState(prev => ({ ...prev, swapStatus: 'error' }));
    }
  };

  const swapTokens = () => {
    setSwapState(prev => ({
      ...prev,
      inputMint: prev.outputMint,
      outputMint: prev.inputMint,
      quoteResponse: null,
      outputAmount: "0",
      priceImpact: "0"
    }));
  };

  // Find token info by mint address
  const getTokenInfo = (mintAddress: string) => {
    return availableTokens.find(token => token.address === mintAddress) || {
      symbol: "Unknown",
      name: "Unknown Token",
      decimals: 0
    };
  };

  const inputToken = getTokenInfo(swapState.inputMint);
  const outputToken = getTokenInfo(swapState.outputMint);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Raydium Swap</CardTitle>
        <CardDescription>Simulated swap experience with Raydium</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="text-center py-4">
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="flex items-center gap-2">
                <Select
                  value={swapState.inputMint}
                  onValueChange={(value) => 
                    setSwapState(prev => ({ 
                      ...prev, 
                      inputMint: value,
                      quoteResponse: null,
                      outputAmount: "0", 
                      priceImpact: "0"
                    }))
                  }
                  disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.symbol} - {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="0.00"
                  value={swapState.inputAmount}
                  onChange={(e) => 
                    setSwapState(prev => ({ 
                      ...prev, 
                      inputAmount: e.target.value,
                      quoteResponse: null,
                      outputAmount: "0",
                      priceImpact: "0"
                    }))
                  }
                  disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
                  className="flex-1"
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                Balance: {tokens?.find(t => t.address === swapState.inputMint)?.amount || 0} {inputToken.symbol}
              </div>
            </div>

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

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex items-center gap-2">
                <Select
                  value={swapState.outputMint}
                  onValueChange={(value) => 
                    setSwapState(prev => ({ 
                      ...prev, 
                      outputMint: value,
                      quoteResponse: null,
                      outputAmount: "0",
                      priceImpact: "0"
                    }))
                  }
                  disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTokens
                      .filter(token => token.address !== swapState.inputMint)
                      .map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                <Input
                  type="text"
                  placeholder="0.00"
                  value={swapState.outputAmount}
                  disabled={true}
                  className="flex-1 bg-muted"
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                Balance: {tokens?.find(t => t.address === swapState.outputMint)?.amount || 0} {outputToken.symbol}
              </div>
            </div>

            {swapState.quoteResponse && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span>
                    1 {inputToken.symbol} ≈ {
                      (Number(swapState.outputAmount) / Number(swapState.inputAmount)).toFixed(6)
                    } {outputToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span>{swapState.priceImpact}</span>
                </div>
              </div>
            )}

            {swapState.swapStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Swap failed. Please try again or check your wallet.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={getQuote}
                disabled={swapState.isLoading || swapState.swapStatus === 'loading'}
                variant="outline"
                className="flex-1"
              >
                {swapState.isLoading ? (
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
                onClick={executeSwap}
                disabled={!swapState.quoteResponse || swapState.swapStatus === 'loading'}
                className="flex-1"
              >
                {swapState.swapStatus === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : 'Swap'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

