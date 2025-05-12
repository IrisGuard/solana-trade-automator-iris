
import { MessageWithAccountKeys } from './types';
import { LAMPORTS_PER_SOL, KNOWN_PROGRAMS } from '../config';

/**
 * Προσδιορίζει τον τύπο της συναλλαγής από το programId
 */
export function determineTransactionType(programId: string): string {
  return KNOWN_PROGRAMS[programId] || 'Unknown';
}

/**
 * Μορφοποιεί lamports σε SOL με σωστά δεκαδικά ψηφία
 */
export function formatSolAmount(lamports: number): string {
  const sol = lamports / LAMPORTS_PER_SOL;
  
  // Αν είναι λιγότερο από 0.001, δείξε το ως μικρότερο ποσό
  if (sol > 0 && sol < 0.001) {
    return '< 0.001';
  }
  
  // Για μεγαλύτερα ποσά, στρογγυλοποίηση στα 4 δεκαδικά ψηφία
  return sol.toFixed(4).replace(/\.?0+$/, '');
}

/**
 * Έλεγχος αν το αντικείμενο message έχει μέθοδο getAccountKeys
 */
export function hasGetAccountKeysMethod(message: any): message is { getAccountKeys: () => any } {
  return message && typeof message.getAccountKeys === 'function';
}

/**
 * Προσδιορισμός αν η συναλλαγή είναι SPL token transfer
 */
export function isSplTokenTransfer(instructionType: string): boolean {
  return instructionType === 'mintTo' || 
         instructionType === 'transfer' || 
         instructionType === 'transferChecked';
}

/**
 * Παίρνει μια σύντομη έκδοση μιας διεύθυνσης wallet
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

/**
 * Υπολογίζει τον χρόνο που έχει περάσει από το timestamp
 */
export function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) {
    return `${seconds} δευτ.`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} λεπτά`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ώρες`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} μέρες`;
}
