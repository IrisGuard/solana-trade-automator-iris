
import { PublicKey } from '@solana/web3.js';

// Διεπαφή για το transaction message με account keys
export interface MessageWithAccountKeys {
  accountKeys?: Array<PublicKey | { pubkey: PublicKey; signer: boolean; writable: boolean; }>;
  getAccountKeys?: () => any;
  instructions: Array<ParsedInstructionType | PartiallyDecodedInstructionType>;
}

// Τύπος για parsed instruction
export interface ParsedInstructionType {
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
export interface PartiallyDecodedInstructionType {
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
