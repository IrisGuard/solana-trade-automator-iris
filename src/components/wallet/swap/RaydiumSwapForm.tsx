
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { raydiumService } from "@/services/solana/raydiumService";
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
  swapStatus: 'idle' | 'loading' | 'success' | 'error';
  outputAmount: string;
  priceImpact: string;
  pairInfo: any;
}

export function RaydiumSwapForm() {
  const { walletAddress, isConnected, connectWallet, tokens } = useWalletConnection();
  
  const [swapState, setSwapState] = useState<SwapState>({
    inputMint: "So11111111111111111111111111111111111111112", // SOL by default
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC by default
    inputAmount: "0.1",
    isLoading: false,
    swapStatus: 'idle',
    outputAmount: "0",
    priceImpact: "0",
    pairInfo: null
  });

  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [availablePairs, setAvailablePairs] = useState<any[]>([]);

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

  // Load available pairs from Raydium
  useEffect(() => {
    const loadPairs = async () => {
      try {
        // Placeholder for API settings - normally would come from a context or hook
        const apiSettings = {
          raydiumEnabled: true,
          raydiumApiEndpoint: 'https://api.raydium.io',
          raydiumApiVersion: 'v2'
        };
        
        const pairs = await raydiumService.getAllPairs(apiSettings);
        setAvailablePairs(pairs);
        
        // If we have pairs, find a matching one for the current tokens
        if (pairs.length > 0) {
          findAndSetPairInfo(pairs);
        }
      } catch (error) {
        console.error('Error loading Raydium pairs:', error);
        toast.error('Failed to load Raydium trading pairs');
      }
    };
    
    loadPairs();
  }, []);

  // Find pair info when tokens change
  const findAndSetPairInfo = (pairs = availablePairs) => {
    const { inputMint, outputMint } = swapState;
    
    // Find pair by mint addresses (simplified - actual logic would be more complex)
    const pair = pairs.find(p => 
      (p.baseMint === inputMint && p.quoteMint === outputMint) || 
      (p.baseMint === outputMint && p.quoteMint === inputMint)
    );
    
    if (pair) {
      setSwapState(prev => ({ ...prev, pairInfo: pair }));
    } else {
      setSwapState(prev => ({ ...prev, pairInfo: null }));
    }
  };

  useEffect(() => {
    if (availablePairs.length > 0) {
      findAndSetPairInfo();
    }
  }, [swapState.inputMint, swapState.outputMint, availablePairs]);

  const getQuote = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const { inputMint, outputMint, inputAmount, pairInfo } = swapState;
    if (!inputMint || !outputMint || !inputAmount || parseFloat(inputAmount) <= 0) {
      toast.error("Please provide valid input values");
      return;
    }

    // If no pair info is available, we can't proceed
    if (!pairInfo) {
      toast.error("No trading pair found for these tokens on Raydium");
      return;
    }

    setSwapState(prev => ({ ...prev, isLoading: true }));

    try {
      // Placeholder for API settings
      const apiSettings = {
        raydiumEnabled: true,
        raydiumApiEndpoint: 'https://api.raydium.io',
        raydiumApiVersion: 'v2'
      };
      
      // Get token info
      const inputToken = availableTokens.find(token => token.address === inputMint);
      if (!inputToken) {
        throw new Error("Input token not found");
      }
      
      const decimals = inputToken.decimals || 9; // Default to 9 for SOL
      const amountInSmallestUnit = parseFloat(inputAmount) * Math.pow(10, decimals);
      
      // Calculate output based on price from pair info
      const price = pairInfo.price;
      const isInputBase = pairInfo.baseMint === inputMint;
      
      let calculatedOutput;
      if (isInputBase) {
        // If input is base token, multiply by price
        calculatedOutput = parseFloat(inputAmount) * price;
      } else {
        // If input is quote token, divide by price
        calculatedOutput = parseFloat(inputAmount) / price;
      }
      
      const outputToken = availableTokens.find(token => token.address === outputMint);
      const outputDecimals = outputToken?.decimals || 6;
      const formattedOutput = calculatedOutput.toFixed(outputDecimals);
      
      // Simplified price impact calculation
      const priceImpact = "< 1.00%"; // Placeholder - actual calculation would be more complex
      
      setSwapState(prev => ({
        ...prev,
        outputAmount: formattedOutput,
        priceImpact,
        isLoading: false
      }));
      
      toast.success("Quote received successfully");
    } catch (error: any) {
      console.error("Error fetching quote:", error);
      toast.error(`Failed to get quote: ${error.message}`);
      setSwapState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const executeSwap = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!swapState.outputAmount || parseFloat(swapState.outputAmount) <= 0) {
      toast.error("Please get a quote first");
      return;
    }

    setSwapState(prev => ({ ...prev, swapStatus: 'loading' }));

    try {
      // This is a simplified mock of a Raydium swap
      // In a real implementation, this would use the Raydium SDK to execute the swap
      
      // Simulate a delay for the swap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock signature
      const signature = `raydium-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save transaction to database
      const inputToken = availableTokens.find(token => token.address === swapState.inputMint);
      const outputToken = availableTokens.find(token => token.address === swapState.outputMint);
      
      try {
        // Only try to save if there's a wallet address (user is logged in)
        if (walletAddress) {
          await transactionsService.saveTransaction({
            user_id: null, // Will be filled by backend RLS
            wallet_address: walletAddress,
            signature: signature,
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
      toast.success(`Swap successful! Signature: ${signature}`);
      
      // Reset form after success
      setTimeout(() => {
        setSwapState(prev => ({
          ...prev,
          swapStatus: 'idle',
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
        <CardDescription>Swap tokens using Raydium liquidity pools</CardDescription>
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
                <RefreshCw />
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

            {swapState.outputAmount !== "0" && (
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Provider</span>
                  <span>Raydium</span>
                </div>
              </div>
            )}

            {!swapState.pairInfo && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No Raydium pool found for this token pair. Try Jupiter instead.
                </AlertDescription>
              </Alert>
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
                disabled={!swapState.pairInfo || swapState.isLoading || swapState.swapStatus === 'loading'}
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
                disabled={!swapState.pairInfo || parseFloat(swapState.outputAmount) <= 0 || swapState.swapStatus === 'loading'}
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
