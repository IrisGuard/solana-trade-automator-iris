
import { useState } from "react";
import { transactionsService } from "@/services/transactionsService";
import { toast } from "sonner";
import { Token } from "@/types/wallet";
import { SwapState, TokenInfo } from "../types";

interface UseRaydiumSwapProps {
  walletAddress: string | null;
  isConnected: boolean;
  availableTokens: Token[];
}

export function useRaydiumSwap({ walletAddress, isConnected, availableTokens }: UseRaydiumSwapProps) {
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

  const updateInputMint = (value: string) => {
    setSwapState(prev => ({ 
      ...prev, 
      inputMint: value,
      quoteResponse: null,
      outputAmount: "0", 
      priceImpact: "0"
    }));
  };

  const updateOutputMint = (value: string) => {
    setSwapState(prev => ({ 
      ...prev, 
      outputMint: value,
      quoteResponse: null,
      outputAmount: "0",
      priceImpact: "0"
    }));
  };

  const updateInputAmount = (value: string) => {
    setSwapState(prev => ({ 
      ...prev, 
      inputAmount: value,
      quoteResponse: null,
      outputAmount: "0",
      priceImpact: "0"
    }));
  };

  const getQuote = async () => {
    if (!walletAddress) {
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
      
      // Get output token decimals
      const outputTokenInfo = availableTokens?.find(token => token.address === outputMint);
      const outputDecimals = outputTokenInfo?.decimals || 6; // Default to 6 for USDC/USDT
      
      // Format output amount
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
    if (!walletAddress) {
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
      const inputTokenInfo = availableTokens?.find(token => token.address === swapState.inputMint);
      const outputTokenInfo = availableTokens?.find(token => token.address === swapState.outputMint);
      
      try {
        // Only try to save if there's a wallet address (user is logged in)
        if (walletAddress) {
          await transactionsService.saveTransaction({
            user_id: null, // Will be filled by backend RLS
            wallet_address: walletAddress,
            signature: mockSignature,
            type: "swap",
            status: "success",
            amount: `${swapState.inputAmount} ${inputTokenInfo?.symbol || 'Unknown'}`,
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

  return {
    swapState,
    inputToken,
    outputToken,
    getQuote,
    executeSwap,
    swapTokens,
    updateInputMint,
    updateOutputMint,
    updateInputAmount
  };
}
