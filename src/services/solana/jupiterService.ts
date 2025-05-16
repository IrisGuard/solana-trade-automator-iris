
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from './config';
import { errorCollector } from '@/utils/error-handling/collector';
import { botTransactionService } from '@/services/bot/botTransactionService';

// Constants
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

// Types
export interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number; // In native units (e.g., lamports)
  slippage?: number; // Basis points (e.g., 0.5% = 50)
}

export interface JupiterQuoteResponse {
  data: {
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapMode: string;
    slippageBps: number;
    platformFee?: {
      amount: string;
      feeBps: number;
    };
    priceImpactPct: number;
    routePlan: any[];
    contextSlot: number;
  };
}

export interface JupiterSwapParams {
  quoteResponse: JupiterQuoteResponse;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
}

export interface JupiterSwapResponse {
  swapTransaction: string; // Serialized transaction
}

/**
 * Get price quote for a swap
 */
export const getJupiterQuote = async ({
  inputMint,
  outputMint,
  amount,
  slippage = 50 // Default 0.5%
}: JupiterQuoteParams): Promise<JupiterQuoteResponse | null> => {
  try {
    // Construct the query URL
    const queryParams = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippage.toString()
    });
    
    const response = await fetch(`${JUPITER_QUOTE_API}?${queryParams.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jupiter API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Jupiter quote:', error);
    errorCollector.captureError(error, {
      component: 'getJupiterQuote',
      source: 'jupiterService',
      details: { inputMint, outputMint, amount }
    });
    return null;
  }
};

/**
 * Execute a swap using Jupiter
 */
export const executeJupiterSwap = async ({
  quoteResponse,
  userPublicKey,
  wrapAndUnwrapSol = true
}: JupiterSwapParams): Promise<string | null> => {
  try {
    // @ts-ignore - Phantom wallet is available in the window object
    const { solana } = window;
    if (!solana || !solana.isPhantom) {
      toast.error('Phantom wallet δεν βρέθηκε');
      return null;
    }
    
    // Get swap transaction
    const swapRequestBody = {
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol
    };
    
    const swapResponse = await fetch(JUPITER_SWAP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(swapRequestBody)
    });
    
    if (!swapResponse.ok) {
      const errorText = await swapResponse.text();
      throw new Error(`Jupiter Swap API error: ${swapResponse.status} - ${errorText}`);
    }
    
    const { swapTransaction } = await swapResponse.json();
    
    // Deserialize the transaction
    const transactionBuffer = Buffer.from(swapTransaction, 'base64');
    let transaction;
    
    try {
      // First try to deserialize as a versioned transaction
      transaction = VersionedTransaction.deserialize(transactionBuffer);
    } catch (e) {
      // If that fails, try as a legacy transaction
      transaction = Transaction.from(transactionBuffer);
    }
    
    // Sign and send the transaction
    let signedTransaction;
    try {
      if (transaction instanceof VersionedTransaction) {
        signedTransaction = await solana.signTransaction(transaction);
      } else {
        signedTransaction = await solana.signTransaction(transaction);
      }
    } catch (err) {
      console.error('Error signing transaction:', err);
      toast.error('Η υπογραφή συναλλαγής απορρίφθηκε');
      return null;
    }
    
    // Send the signed transaction
    let signature;
    if (signedTransaction instanceof VersionedTransaction) {
      signature = await connection.sendTransaction(signedTransaction);
    } else {
      signature = await connection.sendRawTransaction(signedTransaction.serialize());
    }
    
    // Wait for confirmation
    toast.loading('Αποστολή συναλλαγής ανταλλαγής σε εξέλιξη...');
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      console.error('Transaction error:', confirmation.value.err);
      toast.error('Σφάλμα επιβεβαίωσης συναλλαγής ανταλλαγής');
      return null;
    }
    
    // Show success message
    const inputToken = quoteResponse.data.inputMint;
    const outputToken = quoteResponse.data.outputMint;
    const inputAmount = parseInt(quoteResponse.data.inAmount) / Math.pow(10, 9); // Assume 9 decimals for display
    const outputAmount = parseInt(quoteResponse.data.outAmount) / Math.pow(10, 9); // Assume 9 decimals for display
    
    toast.success(`Επιτυχής ανταλλαγή ${inputAmount} → ${outputAmount}`, {
      description: `${inputToken.substring(0, 4)}... → ${outputToken.substring(0, 4)}...`
    });
    
    // Record swap in database
    try {
      await botTransactionService.recordBotTransaction({
        bot_id: 'manual-swap',
        transaction_type: 'swap',
        amount: inputAmount,
        token_symbol: inputToken.substring(0, 4),
        price: outputAmount / inputAmount,
        signature: signature,
        status: 'completed'
      });
    } catch (err) {
      console.error('Error recording swap in database:', err);
      // Non-critical error, we can continue
    }
    
    return signature;
  } catch (error) {
    console.error('Error executing Jupiter swap:', error);
    errorCollector.captureError(error, {
      component: 'executeJupiterSwap',
      source: 'jupiterService',
      details: { quoteResponse, userPublicKey }
    });
    toast.error('Αποτυχία εκτέλεσης ανταλλαγής');
    return null;
  }
};

/**
 * Perform a token swap
 */
export const swapTokens = async (
  fromToken: string,
  toToken: string,
  amount: number,
  userPublicKey: string,
  slippage: number = 50
): Promise<boolean> => {
  try {
    // Get quote
    const quote = await getJupiterQuote({
      inputMint: fromToken,
      outputMint: toToken,
      amount: amount * Math.pow(10, 9), // Convert to lamports or equivalent
      slippage
    });
    
    if (!quote) {
      toast.error('Αδυναμία λήψης τιμής ανταλλαγής');
      return false;
    }
    
    // Show estimated output
    const estimatedOutput = parseInt(quote.data.outAmount) / Math.pow(10, 9);
    toast.info(`Εκτιμώμενο αποτέλεσμα: ${estimatedOutput}`, {
      description: `Επίπτωση τιμής: ${(quote.data.priceImpactPct * 100).toFixed(2)}%`
    });
    
    // Execute swap
    const signature = await executeJupiterSwap({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol: true
    });
    
    return !!signature;
  } catch (error) {
    console.error('Error swapping tokens:', error);
    errorCollector.captureError(error, {
      component: 'swapTokens',
      source: 'jupiterService',
      details: { fromToken, toToken, amount, userPublicKey }
    });
    toast.error('Αποτυχία ανταλλαγής tokens');
    return false;
  }
};

// Export Jupiter service
export const jupiterService = {
  getQuote: getJupiterQuote,
  executeSwap: executeJupiterSwap,
  swapTokens
};
