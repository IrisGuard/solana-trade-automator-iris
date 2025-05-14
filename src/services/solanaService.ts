
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Initialize Solana connection
export function getConnection(endpoint = clusterApiUrl('devnet')): Connection {
  return new Connection(endpoint, 'confirmed');
}

// Get SOL balance
export async function getSOLBalance(address: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
}

// Mock IDL for anchor
export const mockProgramIdl = {
  version: '0.1.0',
  name: 'mock_program',
  instructions: []
};
