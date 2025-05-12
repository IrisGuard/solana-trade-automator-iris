
import { ParsedInstruction, PartiallyDecodedInstruction, PublicKey } from '@solana/web3.js';

// Interfact για το transaction message με account keys
export interface MessageWithAccountKeys {
  accountKeys?: PublicKey[];
  getAccountKeys?: () => any;
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[];
}

// Τύπος για parsed instruction
export interface ParsedInstruction {
  programId: PublicKey;
  program?: string;
  parsed: {
    type: string;
    info: {
      source?: string;
      destination?: string;
      lamports?: number;
      authority?: string;
      mint?: string;
      amount?: string;
      [key: string]: any;
    };
  };
}

// Τύπος για partially decoded instruction
export interface PartiallyDecodedInstruction {
  programId: PublicKey;
  accounts: PublicKey[];
  data: string;
}

// Τύπος για αποτέλεσμα transaction signature
export interface TransactionSignatureResult {
  signature: string;
  slot?: number;
  err?: any;
  memo?: string;
  blockTime?: number;
  confirmationStatus?: 'processed' | 'confirmed' | 'finalized';
}
