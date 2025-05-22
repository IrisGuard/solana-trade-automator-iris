
import { useState } from "react";
import { toast } from "sonner";
import { apiServices } from "@/services/solana/apiServices";
import { transactionsService } from "@/services/transactionsService";
import { SwapState, TokenInfo } from "../types";
import { Token } from "@/types/wallet";

interface UseJupiterSwapProps {
  walletAddress: string | undefined;
  isConnected: boolean;
  availableTokens: Token[];
}

export function useJupiterSwap({ walletAddress, isConnected, availableTokens }: UseJupiterSwapProps) {
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
  const getTokenInfo = (mintAddress: string): TokenInfo => {
    return availableTokens.find(token => token.address === mintAddress) || {
      symbol: "Unknown",
      name: "Unknown Token",
      decimals: 0
    };
  };

  const inputToken = getTokenInfo(swapState.inputMint);
  const outputToken = getTokenInfo(swapState.outputMint);

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
      // Convert inputAmount to lamports/atoms based on decimal places
      const decimals = inputToken.decimals || 9; // Default to 9 for SOL
      const amountInSmallestUnit = Math.floor(parseFloat(inputAmount) * Math.pow(10, decimals));
      
      const quoteResponse = await apiServices.jupiter.getQuote(
        inputMint,
        outputMint,
        amountInSmallestUnit
      );
      
      if (!quoteResponse || !quoteResponse.outAmount) {
        throw new Error("Failed to get valid quote");
      }

      // Calculate output amount in human readable format
      const outputDecimals = outputToken.decimals || 6; // Default to 6 for USDC/USDT
      const outputAmount = (Number(quoteResponse.outAmount) / Math.pow(10, outputDecimals)).toFixed(outputDecimals);
      
      // Format price impact
      const priceImpact = quoteResponse.priceImpactPct 
        ? (Number(quoteResponse.priceImpactPct) * 100).toFixed(2) + '%'
        : "< 0.01%";
      
      setSwapState(prev => ({
        ...prev,
        quoteResponse,
        outputAmount,
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

    if (!swapState.quoteResponse) {
      toast.error("Please get a quote first");
      return;
    }

    setSwapState(prev => ({ ...prev, swapStatus: 'loading' }));

    try {
      // Build the transaction using Jupiter API
      const swapResult = await apiServices.jupiter.buildSwapTransaction(
        swapState.quoteResponse
      );
      
      if (!swapResult || !swapResult.swapTransaction) {
        throw new Error("Failed to build swap transaction");
      }

      // Execute the transaction
      const signature = await apiServices.jupiter.executeSwapTransaction(swapResult.swapTransaction);
      
      if (!signature) {
        throw new Error("Failed to execute swap transaction");
      }

      // Save transaction to database
      try {
        // Only try to save if there's a wallet address (user is logged in)
        if (walletAddress) {
          await transactionsService.saveTransaction({
            user_id: null, // Will be filled by backend RLS
            wallet_address: walletAddress,
            signature: signature,
            type: "swap",
            status: "success",
            amount: `${swapState.inputAmount} ${inputToken.symbol || 'Unknown'}`,
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
