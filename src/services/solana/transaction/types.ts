
import { PublicKey } from '@solana/web3.js';
import { Transaction } from '@/types/wallet';

export interface InstructionInfo {
  type?: string;
  info?: {
    source?: string;
    destination?: string;
    lamports?: number;
  };
}

export interface ParsedInstruction {
  parsed?: {
    type?: string;
    info?: InstructionInfo['info'];
  };
  programId?: string;
}

export interface PartiallyDecodedInstruction {
  programId: PublicKey;
  accounts?: PublicKey[];
  data?: string;
}

export interface MessageWithAccountKeys {
  getAccountKeys?: () => any;
  accountKeys?: any[];
  instructions?: (ParsedInstruction | PartiallyDecodedInstruction)[];
}
