import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Connection
} from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { toast } from 'sonner';
import { connection } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';
import { botTransactionService } from '@/services/bot/botTransactionService';

/**
 * Send SOL from one wallet to another
 * @param fromWallet - Sender wallet address
 * @param toWallet - Recipient wallet address
 * @param amount - Amount in SOL (not lamports)
 * @returns Transaction signature or null if failed
 */
export const sendSOL = async (
  fromWallet: string,
  toWallet: string,
  amount: number
): Promise<string | null> => {
  try {
    if (!amount || amount <= 0) {
      toast.error('Το ποσό πρέπει να είναι μεγαλύτερο από μηδέν');
      return null;
    }
    
    // Convert wallet addresses to PublicKey objects
    const fromPubkey = new PublicKey(fromWallet);
    const toPubkey = new PublicKey(toWallet);
    
    // Convert SOL to lamports
    const lamports = amount * LAMPORTS_PER_SOL;
    
    // Create a transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );
    
    // Get recent blockhash for the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;
    
    // Request signature from Phantom wallet
    // @ts-ignore - Phantom wallet is available in the window object
    const { solana } = window;
    if (!solana || !solana.isPhantom) {
      toast.error('Phantom wallet δεν βρέθηκε');
      return null;
    }
    
    try {
      // Request user to sign transaction
      const signedTransaction = await solana.signTransaction(transaction);
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      toast.loading('Αποστολή συναλλαγής σε εξέλιξη...');
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        console.error('Transaction error:', confirmation.value.err);
        toast.error('Σφάλμα επιβεβαίωσης συναλλαγής');
        return null;
      }
      
      toast.success(`Επιτυχής αποστολή ${amount} SOL`, {
        description: `Προς: ${toWallet.substring(0, 8)}...${toWallet.substring(toWallet.length - 8)}`
      });
      
      return signature;
    } catch (err) {
      console.error('Signing error:', err);
      toast.error('Η υπογραφή συναλλαγής απορρίφθηκε');
      return null;
    }
  } catch (error) {
    console.error('Error sending SOL:', error);
    errorCollector.captureError(error, {
      component: 'sendSOL',
      source: 'services/solana/wallet/transfer',
      details: { fromWallet, toWallet, amount }
    });
    toast.error('Αποτυχία αποστολής SOL');
    return null;
  }
};

/**
 * Send SPL token from one wallet to another
 * @param fromWallet - Sender wallet address
 * @param toWallet - Recipient wallet address
 * @param amount - Amount of tokens to send
 * @param tokenAddress - Token mint address
 * @param decimals - Token decimals (optional, will be fetched if not provided)
 * @returns Transaction signature or null if failed
 */
export const sendSPLToken = async (
  fromWallet: string,
  toWallet: string,
  amount: number,
  tokenAddress: string,
  decimals?: number
): Promise<string | null> => {
  try {
    if (!amount || amount <= 0) {
      toast.error('Το ποσό πρέπει να είναι μεγαλύτερο από μηδέν');
      return null;
    }
    
    // Convert wallet addresses to PublicKey objects
    const fromPubkey = new PublicKey(fromWallet);
    const toPubkey = new PublicKey(toWallet);
    const tokenMint = new PublicKey(tokenAddress);
    
    // @ts-ignore - Phantom wallet is available in the window object
    const { solana } = window;
    if (!solana || !solana.isPhantom) {
      toast.error('Phantom wallet δεν βρέθηκε');
      return null;
    }
    
    // If decimals are not provided, fetch token info
    let tokenDecimals = decimals;
    if (!tokenDecimals) {
      try {
        const tokenInfo = await connection.getParsedAccountInfo(tokenMint);
        // @ts-ignore - Token info structure
        tokenDecimals = tokenInfo.value?.data.parsed.info.decimals || 9;
      } catch (err) {
        console.error('Error fetching token info:', err);
        tokenDecimals = 9; // Default to 9 decimals
      }
    }
    
    // Calculate token amount with decimals
    const adjustedAmount = amount * Math.pow(10, tokenDecimals);
    
    // Get or create associated token accounts
    // Create a dummy signer object for the getOrCreateAssociatedTokenAccount function
    // Note: This is just to satisfy the function signature - actual signing happens via Phantom
    const dummySigner = {
      publicKey: fromPubkey,
    };
    
    // Use dummySigner for source account
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      dummySigner as any,
      tokenMint,
      fromPubkey
    );
    
    // Use dummySigner for destination account
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      dummySigner as any,
      tokenMint,
      toPubkey
    );
    
    // Create a transfer transaction
    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromPubkey,
        Math.floor(adjustedAmount),
        [],
        // @ts-ignore - SPL token program
        undefined
      )
    );
    
    // Get recent blockhash for the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;
    
    try {
      // Request user to sign transaction
      const signedTransaction = await solana.signTransaction(transaction);
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      toast.loading('Αποστολή συναλλαγής σε εξέλιξη...');
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        console.error('Transaction error:', confirmation.value.err);
        toast.error('Σφάλμα επιβεβαίωσης συναλλαγής');
        return null;
      }
      
      toast.success(`Επιτυχής αποστολή ${amount} tokens`, {
        description: `Προς: ${toWallet.substring(0, 8)}...${toWallet.substring(toWallet.length - 8)}`
      });
      
      return signature;
    } catch (err) {
      console.error('Signing error:', err);
      toast.error('Η υπογραφή συναλλαγής απορρίφθηκε');
      return null;
    }
  } catch (error) {
    console.error('Error sending SPL token:', error);
    errorCollector.captureError(error, {
      component: 'sendSPLToken',
      source: 'services/solana/wallet/transfer',
      details: { fromWallet, toWallet, amount, tokenAddress }
    });
    toast.error('Αποτυχία αποστολής token');
    return null;
  }
};

/**
 * Send token (SOL or SPL)
 * @param fromWallet - Sender wallet address
 * @param toWallet - Recipient wallet address
 * @param amount - Amount to send
 * @param tokenAddress - Token mint address (undefined for SOL)
 * @returns Whether the transaction was successful
 */
export const sendToken = async (
  fromWallet: string,
  toWallet: string,
  amount: number,
  tokenAddress?: string
): Promise<boolean> => {
  try {
    let signature: string | null;
    
    if (!tokenAddress || tokenAddress === 'So11111111111111111111111111111111111111112') {
      // Send SOL
      signature = await sendSOL(fromWallet, toWallet, amount);
    } else {
      // Send SPL token
      signature = await sendSPLToken(fromWallet, toWallet, amount, tokenAddress);
    }
    
    if (signature) {
      // Record transaction in database
      try {
        await botTransactionService.recordBotTransaction({
          bot_id: 'manual-transfer', // We use a special ID for manual transfers
          transaction_type: 'send',
          amount: amount,
          token_symbol: tokenAddress ? 'SPL' : 'SOL',
          price: 0, // We don't have price info here
          signature: signature,
          status: 'completed'
        });
      } catch (err) {
        console.error('Error recording transaction in database:', err);
        // Non-critical error, we can continue
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error sending token:', error);
    toast.error('Αποτυχία αποστολής');
    return false;
  }
};
