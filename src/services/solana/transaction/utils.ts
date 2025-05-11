
import { KNOWN_PROGRAMS } from '../config';

/**
 * Helper to determine transaction type based on program ID
 */
export function determineTransactionType(programId: string): string {
  return KNOWN_PROGRAMS[programId] || 'Unknown';
}

/**
 * Helper to format SOL amount
 */
export function formatSolAmount(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 9 });
}

/**
 * Type guard for objects with getAccountKeys method
 */
export function hasGetAccountKeysMethod(obj: any): obj is { getAccountKeys(): any } {
  return obj && typeof obj.getAccountKeys === 'function';
}
