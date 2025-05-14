import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IDL } from './idl';
import { logError } from '@/utils/errorUtils';

const programIdl = IDL;
const programId = new PublicKey(IDL.metadata.address);

const network = clusterApiUrl('devnet');

const opts = {
  preflightCommitment: 'processed',
};

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection,
    window.solana,
    opts.preflightCommitment,
  );
  return provider;
};

export const useAnchor = () => {
  try {
    const provider = getProvider();
    const program = new Program(programIdl, programId, provider);
    return program;
  } catch (error) {
    logError(error, 'useAnchor');
  }
};

export const getCandyMachineState = async (
  candyMachineAddress: PublicKey,
  connection: Connection,
) => {
  try {
    const candyMachineAccount = await connection.getAccountInfo(
      candyMachineAddress,
    );
    if (candyMachineAccount) {
      const candyMachineState = await useAnchor().coder.accounts.decode(
        'CandyMachine',
        candyMachineAccount.data,
      );
      return candyMachineState;
    }
  } catch (error) {
    logError(error, 'getCandyMachineState');
  }
};
