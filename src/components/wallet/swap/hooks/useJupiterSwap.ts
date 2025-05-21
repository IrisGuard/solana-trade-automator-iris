
import { useState, useEffect, useCallback } from "../../../../react-compatibility";
import { Token } from "@/types/wallet";
import { ApiKeyService } from "@/services/api-keys/apiKeyService";
import { toast } from "sonner";

export function useJupiterSwap(
  fromToken: Token | null,
  toToken: Token | null,
  amount: number,
  slippage: number
) {
  const [isSwapping, setIsSwapping] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [expectedAmount, setExpectedAmount] = useState(0);
  
  // State for swap form
  const [inputMint, setInputMint] = useState("");
  const [outputMint, setOutputMint] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState("0%");

  // Swap state object for consistent interface
  const swapState = {
    inputMint,
    outputMint,
    inputAmount,
    outputAmount,
    isLoading: isSwapping,
    quoteResponse: quote,
    swapStatus: error ? 'error' : isSwapping ? 'loading' : 'idle',
    priceImpact
  };

  // Get quote when inputs change
  useEffect(() => {
    const getQuoteInternal = async () => {
      if (!fromToken || !toToken || amount <= 0) {
        setQuote(null);
        setExpectedAmount(0);
        setOutputAmount("0");
        return;
      }

      try {
        // In a real implementation, this would call Jupiter API
        console.log(`Getting quote for ${amount} ${fromToken.symbol} to ${toToken.symbol}`);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response
        const mockRate = Math.random() * 10 + 0.1; // Random rate between 0.1 and 10.1
        const expectedOutput = amount * mockRate;
        
        setQuote({
          inputMint: fromToken.mint,
          outputMint: toToken.mint,
          inAmount: amount,
          outAmount: expectedOutput,
          fee: expectedOutput * 0.003, // 0.3% fee
          priceImpact: Math.random() * 2, // 0-2% price impact
        });
        
        setExpectedAmount(expectedOutput);
        setOutputAmount(expectedOutput.toFixed(6));
        setPriceImpact((Math.random() * 2).toFixed(2) + "%");
        setError(null);
      } catch (err) {
        console.error("Error getting Jupiter quote:", err);
        setQuote(null);
        setError(err instanceof Error ? err : new Error("Failed to get quote"));
        toast.error("Failed to get swap quote");
      }
    };

    if (fromToken && toToken && inputMint && outputMint && inputAmount) {
      getQuoteInternal();
    }
  }, [fromToken, toToken, amount, inputMint, outputMint, inputAmount]);

  // Execute swap function
  const executeSwap = useCallback(async () => {
    if (!fromToken || !toToken || !quote || amount <= 0) {
      toast.error("Invalid swap parameters");
      return false;
    }

    setIsSwapping(true);
    try {
      // Check if we have a Jupiter API key
      const jupiterKey = await ApiKeyService.getRandomServiceKey("jupiter");
      
      if (!jupiterKey) {
        toast.error("No Jupiter API key found");
        return false;
      }
      
      // In a real implementation, this would call Jupiter API to execute the swap
      console.log(`Executing swap: ${amount} ${fromToken.symbol} to ${toToken.symbol}`);
      console.log(`Slippage: ${slippage}%`);
      console.log(`Expected output: ${expectedAmount} ${toToken.symbol}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast.success(`Swap completed: ${amount} ${fromToken.symbol} to ${expectedAmount.toFixed(4)} ${toToken.symbol}`);
        return true;
      } else {
        throw new Error("Swap failed due to network conditions");
      }
    } catch (err) {
      console.error("Error executing Jupiter swap:", err);
      setError(err instanceof Error ? err : new Error("Failed to execute swap"));
      toast.error("Swap failed: " + (err instanceof Error ? err.message : "Unknown error"));
      return false;
    } finally {
      setIsSwapping(false);
    }
  }, [fromToken, toToken, quote, amount, expectedAmount, slippage]);

  // Handle token selection
  const updateInputMint = useCallback((tokenMint) => {
    setInputMint(tokenMint);
    if (fromToken?.mint !== tokenMint) {
      setInputAmount(""); // Reset amount when changing token
    }
  }, [fromToken]);

  const updateOutputMint = useCallback((tokenMint) => {
    setOutputMint(tokenMint);
  }, []);

  const updateInputAmount = useCallback((amount) => {
    setInputAmount(amount);
  }, []);

  // Get quote function exposed to UI
  const getQuote = useCallback(() => {
    if (!inputMint || !outputMint || !inputAmount) {
      toast.error("Please select tokens and enter an amount");
      return;
    }
    
    setIsSwapping(true);
    // This will trigger the useEffect
    setTimeout(() => setIsSwapping(false), 1000);
  }, [inputMint, outputMint, inputAmount]);

  // Swap tokens function
  const swapTokens = useCallback(() => {
    const tempInputMint = inputMint;
    const tempOutputMint = outputMint;
    setInputMint(tempOutputMint);
    setOutputMint(tempInputMint);
    setInputAmount("");
    setOutputAmount("");
    setQuote(null);
  }, [inputMint, outputMint]);

  return {
    isSwapping,
    quote,
    error,
    expectedAmount,
    executeSwap,
    swapState,
    inputToken: fromToken,
    outputToken: toToken,
    getQuote,
    swapTokens,
    updateInputMint,
    updateOutputMint,
    updateInputAmount
  };
}
