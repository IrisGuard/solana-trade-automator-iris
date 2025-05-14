import { PublicKey } from '@solana/web3.js';
import { Token } from '@solana/spl-token';
import { logError } from '@/utils/errorUtils';
import { getAssociatedTokenAddress } from './token';
import { confirmTransaction } from '../utils';
import { createAssociatedTokenAccountInstruction, createSyncNativeInstruction, getTokenAccount, transfer, transferInstruction } from './instructions';
import { SOL_MINT } from '@/constants';
import { getWallet, useWallet } from '@/hooks/useWallet';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletContextState } from '@solana/wallet-adapter-react';

/**
 * Service class for handling token-related operations on the Solana blockchain.
 */
export class TokenService {
  /**
   * Gets the balance of a specific token for a given wallet address.
   *
   * @param walletAddress The public key of the wallet.
   * @param tokenMintAddress The public key of the token mint.
   * @returns The token balance as a number, or null if the account doesn't exist or an error occurs.
   */
  async getTokenBalance(walletAddress: PublicKey, tokenMintAddress: PublicKey): Promise<number | null> {
    try {
      const tokenAccountAddress = await getAssociatedTokenAddress(tokenMintAddress, walletAddress);
      const tokenAccountInfo = await getTokenAccount(tokenAccountAddress);

      if (!tokenAccountInfo) {
        return 0; // Account doesn't exist, return 0
      }

      return tokenAccountInfo.amount;
    } catch (error: any) {
      logError(error, 'TokenService.getTokenBalance', { walletAddress: walletAddress.toBase58(), tokenMintAddress: tokenMintAddress.toBase58() });
      return null;
    }
  }

  /**
   * Transfers tokens from one account to another.
   *
   * @param fromWallet The wallet initiating the transfer.
   * @param toPublicKey The public key of the recipient.
   * @param tokenMintAddress The public key of the token mint.
   * @param amount The amount of tokens to transfer.
   * @returns A promise that resolves when the transfer is confirmed, or rejects on failure.
   */
  async transferTokens(fromWallet: WalletContextState, toPublicKey: PublicKey, tokenMintAddress: PublicKey, amount: number): Promise<void> {
    try {
      const fromTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, fromWallet.publicKey!);
      const toTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, toPublicKey);

      const transferTransaction = await transfer(fromTokenAccount, toTokenAccount, amount, fromWallet);
      await confirmTransaction(transferTransaction);
    } catch (error: any) {
      logError(error, 'TokenService.transferTokens', {
        fromWallet: fromWallet.publicKey?.toBase58(),
        toPublicKey: toPublicKey.toBase58(),
        tokenMintAddress: tokenMintAddress.toBase58(),
        amount
      });
      throw error;
    }
  }

  /**
   * Transfers tokens from one account to another using a pre-constructed instruction.
   *
   * @param fromWallet The wallet initiating the transfer.
   * @param toPublicKey The public key of the recipient.
   * @param tokenMintAddress The public key of the token mint.
   * @param amount The amount of tokens to transfer.
   * @returns A promise that resolves when the transfer is confirmed, or rejects on failure.
   */
  async transferTokensInstruction(fromWallet: WalletContextState, toPublicKey: PublicKey, tokenMintAddress: PublicKey, amount: number): Promise<void> {
    try {
      const fromTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, fromWallet.publicKey!);
      const toTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, toPublicKey);

      const transferTransaction = await transferInstruction(fromTokenAccount, toTokenAccount, amount, fromWallet);
      await confirmTransaction(transferTransaction);
    } catch (error: any) {
      logError(error, 'TokenService.transferTokensInstruction', {
        fromWallet: fromWallet.publicKey?.toBase58(),
        toPublicKey: toPublicKey.toBase58(),
        tokenMintAddress: tokenMintAddress.toBase58(),
        amount
      });
      throw error;
    }
  }

  /**
   * Creates an associated token account for a specific token mint.
   *
   * @param wallet The wallet for which to create the associated token account.
   * @param tokenMintAddress The public key of the token mint.
   * @returns A promise that resolves when the account is created, or rejects on failure.
   */
  async createAssociatedTokenAccount(wallet: WalletContextState, tokenMintAddress: PublicKey): Promise<void> {
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(tokenMintAddress, wallet.publicKey!);
      const createAccountTransaction = await createAssociatedTokenAccountInstruction(associatedTokenAddress, tokenMintAddress, wallet);
      await confirmTransaction(createAccountTransaction);
    } catch (error: any) {
      logError(error, 'TokenService.createAssociatedTokenAccount', {
        walletPublicKey: wallet.publicKey?.toBase58(),
        tokenMintAddress: tokenMintAddress.toBase58()
      });
      throw error;
    }
  }

  /**
   * Wraps SOL tokens by creating a wrapped SOL account and transferring SOL into it.
   *
   * @param wallet The wallet initiating the wrap.
   * @param amount The amount of SOL to wrap.
   * @returns A promise that resolves when the SOL is wrapped, or rejects on failure.
   */
  async wrapSol(wallet: WalletContextState, amount: number): Promise<void> {
    try {
      const solMint = new PublicKey(SOL_MINT);
      const associatedTokenAddress = await getAssociatedTokenAddress(solMint, wallet.publicKey!);

      const wrapSolTransaction = await createSyncNativeInstruction(associatedTokenAddress, amount, wallet);
      await confirmTransaction(wrapSolTransaction);
    } catch (error: any) {
      logError(error, 'TokenService.wrapSol', {
        walletPublicKey: wallet.publicKey?.toBase58(),
        amount
      });
      throw error;
    }
  }
}
